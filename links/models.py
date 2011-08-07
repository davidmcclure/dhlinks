from django.db import models
from django.db.models import Min
from django.db.models import Max
from django.contrib.auth.models import User
from django.contrib.auth.models import AnonymousUser
import datetime as dt
import urlparse
import operator


class UserProfileManager(models.Manager):

    def create_user(self, username, email, password, firstname, lastname):
        new_user = User.objects.create_user(
            username, email, password)
        new_user.first_name = firstname
        new_user.last_name = lastname
        new_user.save()
        new_user_profile = UserProfile(user = new_user)
        new_user_profile.save()


class UserProfile(models.Model):

    user = models.OneToOneField(User)

    objects = UserProfileManager()

    def __unicode__(self):

        return self.user.first_name + self.user.last_name

    def _get_karma(self):

        comment_count = Comment.objects.filter(submission__user = self.user).count()
        upvote_count = SubmissionVote.objects.filter(submission__user = self.user).count()
        return comment_count + upvote_count;

    karma = property(_get_karma)


class SubmissionManager(models.Manager):

    SORT_FUNCS = {
        'rank': operator.attrgetter('score'),
        'comments': operator.attrgetter('date_of_last_comment'),
        'new': operator.attrgetter('post_date')
    }

    LINKS_PER_PAGE = 50
    TAGS_PER_PAGE = 95

    def sort(self, user, sort, tag, mylinks, page):

        '''
        Core sort method. Returns a list of submissions sorted according to
        the sort parameter and filtered by mylinks and tag, if present.

        @param user (request.user) - The current user.
        @param sort (string) - The sort parameter to order by.
        @param tag (string) - The tag to filter by.
        @param mylinks (boolean) - If the mylinks filter is applied.
        @param batch (integer) - The batching number.

        @return tuple (queryset, are_more) - The submissions along with a
        boolean that indicates whether or not there are more links beyond those
        contained in the queryset (used to control whether or not a 'more' link
        should be displayed).
        '''

        result_list = []

        # Apply filters to the Submissions object set depending on the inputs.

        if tag and not mylinks:
            # Just filter by tag.
            objects = self.model.objects.filter(tagsubmission__tag__tag = tag.replace('-', ' '))

        elif not tag and mylinks:
            # Just filter by user.
            objects = self.model.objects.filter(user = user)

        elif tag and mylinks:
            # Filter by user and tag.
            objects = self.model.objects.filter(tagsubmission__tag__tag = tag.replace('-', ' '), user = user)

        else:
            # Get everything.
            objects = self.model.objects.all()

        # Iterate over the rows; add has-the-user-voted? attribute and, if sort
        # is 'comment,' filter out submissions without comments.

        for row in objects:
            submsision = self.model.objects.get(id = row.id)
            row.has_voted = submsision.user_has_voted(user)
            if sort == 'comments' and row.comment_set.count() == 0:
                pass
            else: result_list.append(row)

        # Apply the sorting function and slice the sorted set.
        sorted_links = sorted(result_list, key = SubmissionManager.SORT_FUNCS[sort], reverse = True)
        sliced_links = sorted_links[((page - 1) * SubmissionManager.LINKS_PER_PAGE):(page * SubmissionManager.LINKS_PER_PAGE)]

        # Figure out whether there are more links beyond those contained in the
        # final, sliced query set.
        are_more = ((page * SubmissionManager.LINKS_PER_PAGE) < len(sorted_links))

        # Return a tuple with the query set and the are_more boolean
        return (sliced_links, are_more)


    def create_submission(self, url, title, user, post_date):
        submission = Submission(
            url = url,
            title = title,
            user = user,
            post_date = post_date)
        submission.save()
        return submission


    def next_page_route(self, sort, tag, mylinks, page):
        route = ''
        if mylinks: route += '/my-links'
        if tag: route += ('/' + tag)
        if sort != 'rank': route += ('/' + sort)
        route += ('/' + str((int(page) + 1)))
        return route



class Submission(models.Model):

    url = models.CharField(max_length=500, null=True)
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User)
    post_date = models.DateTimeField()

    objects = SubmissionManager()

    links_per_page = 50
    gravity = 1.5

    def __unicode__(self):
        return self.title

    def _get_number_of_comments(self):
        return self.comment_set.all().count()
    number_of_comments = property(_get_number_of_comments)

    def _get_submission_type(self):
        return 'discussion' if self.url == '' else 'link'
    submission_type = property(_get_submission_type)

    def _get_number_of_votes(self, minusone = True):
        votes = self.submissionvote_set.filter(direction=True).count()
        return votes - 1 if minusone else votes
    number_of_votes = property(_get_number_of_votes)

    def _get_score(self):
        votes = self._get_number_of_votes(minusone = False)
        age = dt.datetime.now() - self.post_date
        total_seconds = (age.microseconds + (age.seconds + age.days * 24 * 3600) * 10**6) / 10**6
        return (votes) / pow(((total_seconds / 3600.00) + 2), self.gravity)
    score = property(_get_score)

    def _get_base_url(self):
        parse = urlparse.urlparse(self.url)
        return parse.netloc[4:] if parse.netloc[0:4] == 'www.' else parse.netloc
    base_url = property(_get_base_url)

    def _get_date_of_last_comment(self):
        return self.comment_set.aggregate(Min('post_date'))
    date_of_last_comment = property(_get_date_of_last_comment)

    def _get_comments_slug(self):
        return '-'.join(self.title.split(' ')).lower()
    comments_slug = property(_get_comments_slug)

    def user_has_voted(self, user):
        vote = []
        if user.is_authenticated():
            vote = SubmissionVote.objects.filter(user = user, submission = self)
        return True if vote else False


class CommentManager(models.Manager):

    indent_multipliers = {
        'comments': 30,
        'teasers': 20
    }

    def comments(self, submission_id, user):
        ordered_comments = []
        self.order = []
        self.indentation_depth = 0
        self.all_comments = Comment.objects.filter(submission = Submission.objects.get(pk=submission_id)).order_by('post_date')
        for comment in self.all_comments:
            comment_record = self.model.objects.get(id = comment.id)
            comment.has_voted = comment_record.user_has_voted(user)
            self.add_children(comment)
        for order in self.order:
            ordered_comments.append(([comment for comment in self.all_comments
                if comment.id == order[0]][0], order[1] * self.indent_multipliers['comments']))
        return ordered_comments

    def add_children(self, comment):
        if comment.id not in [order[0] for order in self.order]:
            self.order.append((comment.id, self.indentation_depth))
        children = [child for child in self.all_comments if child.parent_id == comment.id]
        self.indentation_depth += 1
        for child_comment in children:
            self.add_children(child_comment)

            # Once, after recursing out of itself at line 238, add_children was
            # possessed of a divining fire in the black and death-like
            # negativity of the unconsummated post-recursion code. It surveyed
            # the silence, beheld the broad pythonic None, and resolved to fill it
            # with Some. Quietly it chanted a mysterious and begloamed fable.

        self.indentation_depth -= 1
        return

    def create_comment(self, comment, post_date, submission, user, parent):
        if comment != '':
            new_comment = Comment(
                comment = comment,
                post_date = post_date,
                submission = submission,
                parent = parent,
                user = user)
            new_comment.save()


class Comment(models.Model):

    user = models.ForeignKey(User)
    comment = models.TextField()
    post_date = models.DateTimeField()
    submission = models.ForeignKey(Submission)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='mastercomment')

    objects = CommentManager()

    def __unicode__(self):
        return self.comment

    def _get_number_of_votes(self):
        return self.commentvote_set.filter(direction=True).count()
    number_of_votes = property(_get_number_of_votes)

    def _get_posted_on(self):
        age = dt.datetime.now() - self.post_date
        total_seconds = (age.microseconds + (age.seconds + age.days * 24 * 3600) * 10**6) / 10**6
        if total_seconds > 86400:
            string = 'on ' + self.post_date.strftime('%A, %B %d, %Y at %I:%M %p').replace(' 0', ' ')
        elif total_seconds > 3600:
            string = str(int(round((total_seconds / 3600), 0))) + ' hours ago'
        elif total_seconds > 60:
            string = str(int(round((total_seconds / 60), 0))) + ' minutes ago'
        else:
            string = str(total_seconds) + ' seconds ago'
        return string
    posted_on = property(_get_posted_on)

    def user_has_voted(self, user):
        vote = []
        if user.is_authenticated():
            vote = CommentVote.objects.filter(user = user, comment = self)
        return True if vote else False


class Vote(models.Model):

    user = models.ForeignKey(User)
    submit_date = models.DateTimeField()
    direction = models.BooleanField()


class SubmissionVoteManager(models.Manager):

    def create_vote(self, user, submission, direction, post_date):
        vote_record = SubmissionVote(
            user = user,
            submission = submission,
            direction = direction,
            submit_date = post_date)
        vote_record.save()

    def vote_exists(self, user, submission):
        return SubmissionVote.objects.filter(user = user, submission =
                submission).exists()


class SubmissionVote(Vote):

    submission = models.ForeignKey(Submission)

    objects = SubmissionVoteManager()

    def __unicode__(self):
        return self.submission.title


class CommentVoteManager(models.Manager):

    def create_vote(self, user, comment, direction, post_date):
        vote_record = CommentVote(
            user = user,
            comment = comment,
            direction = direction,
            submit_date = post_date)
        vote_record.save()

    def vote_exists(self, user, comment):
        return CommentVote.objects.filter(user = user, comment =
                comment).exists()


class CommentVote(Vote):

    comment = models.ForeignKey(Comment)

    objects = CommentVoteManager()

    def __unicode__(self):
        return self.comment.comment


class TagManager(models.Manager):

    def rank(self, user = AnonymousUser, mylinks = False, all_tags = False):

        '''
        Core sort method. Returns list of tags, sliced by page and filtered by
        user if mylinks is specified.

        @param page (string) - The page number.
        @param mylinks (boolean) - True if mylinks is selected.
        @param all_tags (boolean) - True if all tags should be queried.

        @return queryset - The tags.
        '''

        result_list = []

        # Get tag set.
        tags = self.model.objects.all()

        # Iterate through and filter.
        for row in tags:

            # Add user count attribute to rowset.
            tag = self.model.objects.get(id = row.id)

            # Filter out tags not posted by user if mylinks is selected.
            if mylinks:
                if TagSubmission.objects.filter(submission__user = user, tag = tag).exists():
                    row.user_count = tag._get_total_user_submissions(user)
                    result_list.append(row)

            else:
                result_list.append(row)

        if mylinks: sorted_tags = sorted(result_list, key = lambda a: a.user_count, reverse = True)
        else: sorted_tags = sorted(result_list, key = lambda a: a.count, reverse = True)

        sliced_tags = sorted_tags[:SubmissionManager.TAGS_PER_PAGE]

		if all_tags:
			return sorted_tags
		else:
			return sliced_tags


    def get_by_url_slug(self, slug):
        return self.model.objects.get(tag = slug.replace('-', ' '))


    def create_tags(self, tags, submission):
       for tag in tags:
            new_tag = Tag(tag = tag)
            parent_tag = new_tag.save()
            tag_submission = TagSubmission(
                submission = submission,
                tag = parent_tag)
            tag_submission.save()


class Tag(models.Model):

    tag = models.CharField(max_length=50)

    objects = TagManager()

    def save(self, *args, **kwargs):
        duplicate_test = Tag.objects.filter(tag = self.tag)
        if duplicate_test:
            return duplicate_test[0]
        else:
            super(Tag, self).save(self, *args, **kwargs)
            return self

    def __unicode__(self):
        return self.tag

    def _get_total_submissions(self):
        return self.tagsubmission_set.count()
    count = property(_get_total_submissions)

    def _get_total_user_submissions(self, user):
        return TagSubmission.objects.filter(tag = self, submission__user = user).count()

    def _get_url_slug(self):
        return '-'.join(self.tag.split(' '))
    url_slug = property(_get_url_slug)

class TagSubmission(models.Model):

    submission = models.ForeignKey(Submission)
    tag = models.ForeignKey(Tag)

    def __unicode__(self):
        return self.submission.title + ' ~ ' + self.tag.tag
