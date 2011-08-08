from django.db import models
from django.db.models import Min
from django.db.models import Max
from django.contrib.auth.models import User
from django.contrib.auth.models import AnonymousUser
import datetime as dt
import urlparse
import operator


class UserProfileManager(models.Manager):

    '''
    Table class for UserProfile.
    '''


    def create_user(self, username, email, password, firstname, lastname):

        '''
        Create a new user.

        @param username (string) - The new username.
        @param email (string) - The new email.
        @param password (string) - The new password.
        @param firstname (string) - The new first name.
        @param lastname (string) - The new last name.

        @return void.
        '''

        # Create the new native User object.
        new_user = User.objects.create_user(username, email, password)
        new_user.first_name = firstname
        new_user.last_name = lastname
        new_user.save()

        # Create the new UserProfile extension.
        new_user_profile = UserProfile(user = new_user)
        new_user_profile.save()


class UserProfile(models.Model):

    '''
    Row class for UserProfile.
    '''


    user = models.OneToOneField(User)
    objects = UserProfileManager()


    def __unicode__(self):

        '''
        Return readable output for shell sessions.

        @return string - The name of the user, in format first_name last_name.
        '''

        return self.user.first_name + self.user.last_name


    def _get_karma(self):

        '''
        Calculate the user's karma score.

        @return karma (integer).
        '''

        # Calculate the total of times that the user's comments and submissions
        # have been upvoted.
        comment_count = Comment.objects.filter(submission__user = self.user).count()
        upvote_count = SubmissionVote.objects.filter(submission__user = self.user).count()

        # Return the sum.
        return comment_count + upvote_count;

    karma = property(_get_karma)


class SubmissionManager(models.Manager):

    '''
    Table class for Submission.
    '''


    # Attribute getters for the core sort method.
    SORT_FUNCS = {
        'rank': operator.attrgetter('score'),
        'comments': operator.attrgetter('date_of_last_comment'),
        'new': operator.attrgetter('post_date')
    }


    # Constants for the submission and tags paging.
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

        if sort == 'comments':
            objects = objects.filter(comments__count__gt=0)

        # Iterate over the rows; add has-the-user-voted? attribute and, if sort
        # is 'comment,' filter out submissions without comments.

        for row in objects:
            row.has_voted = row.user_has_voted(user)

        # Apply the sorting function and slice the sorted set.
        sorted_links = sorted(objects, key = SubmissionManager.SORT_FUNCS[sort], reverse = True)
        sliced_links = sorted_links[((page - 1) * SubmissionManager.LINKS_PER_PAGE):(page * SubmissionManager.LINKS_PER_PAGE)]

        # Figure out whether there are more links beyond those contained in the
        # final, sliced query set.
        are_more = ((page * SubmissionManager.LINKS_PER_PAGE) < len(sorted_links))

        # Return a tuple with the query set and the are_more boolean
        return (sliced_links, are_more)


    def create_submission(self, url, title, user, post_date):

        '''
        Insert a new submission.

        @param url (string) - The url.
        @param title (string) - The title.
        @param user (request.user) - The current user.
        @param post_date (datetime) - The time of creation.

        @return submission (Submission) - The new submission object.
        '''

        submission = Submission(
            url = url,
            title = title,
            user = user,
            post_date = post_date)

        submission.save()

        return submission


    def next_page_route(self, sort, tag, mylinks, page):

        '''
        Build the route for the next page of links given any stack of filters.

        @param sort (string) - The active sorting parameter (rank, age, comments).
        @param tag (string) - The active tag.
        @param mylinks (boolean) - True if mylinks is active.
        @param page (integer) - The current page.

        @return route (string) - The constructed route.
        '''

        route = ''

        # Add route components to the URL.
        if mylinks: route += '/my-links'
        if tag: route += ('/' + tag)
        if sort != 'rank': route += ('/' + sort)

        # Calculate and add the new page number.
        route += ('/' + str((int(page) + 1)))

        return route


class Submission(models.Model):

    '''
    Row class for Submission.
    '''


    url = models.CharField(max_length=500, null=True)
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User)
    post_date = models.DateTimeField()
    objects = SubmissionManager()


    # Constants for ranking algorithm.
    links_per_page = 50
    gravity = 1.5


    def __unicode__(self):

        '''
        Return readable output for shell sessions.

        @return string - The Submission's title.
        '''

        return self.title


    def _get_number_of_comments(self):

        '''
        Return the number of comments for the submission.

        @return integer - The number of comments.
        '''

        return self.comment_set.all().count()

    # Property assignment for _get_number_of_comments.
    number_of_comments = property(_get_number_of_comments)


    def _get_submission_type(self):

        '''
        Return the type of the submission - 'link' or 'discussion.'

        @return string - The type.
        '''

        return 'discussion' if self.url == '' else 'link'

    # Property assignment for _get_submission_type.
    submission_type = property(_get_submission_type)


    def _get_number_of_votes(self, minusone = True):

        '''
        Return the number of upvotes that the submission has.

        @param minusone (boolean) - True the result should subtract 1 to
        exclude the automatic starting upvote that is applied when the 
        submission is posted.

        @return integer - The number of votes.
        '''

        votes = self.submissionvote_set.filter(direction=True).count()

        return votes - 1 if minusone else votes

    # Property assignment for _get_number_of_votes.
    number_of_votes = property(_get_number_of_votes)


    def _get_score(self):

        '''
        Calculate the score for the submission. Used by the sorting method in
        the manager class to rank the submissions.

        @return float - The score.
        '''

        # Get total votes and timedelta.
        votes = self._get_number_of_votes(minusone = False)
        age = dt.datetime.now() - self.post_date

        # Calculate the total number of seconds that have passed since the
        # submission was posted.
        total_seconds = (age.microseconds + (age.seconds + age.days * 86400) * 1000000) / 1000000

        # Do the decay calculation.
        return (votes) / pow(((total_seconds / 3600.00) + 2), self.gravity)

    # Property assignment for _get_score.
    score = property(_get_score)


    def _get_base_url(self):

        '''
        Get the url of the submission, without the 'http(s)://www.'

        @return string - The base url.
        '''

        parse = urlparse.urlparse(self.url)

        return parse.netloc[4:] if parse.netloc[0:4] == 'www.' else parse.netloc

    # Property assignment for _get_base_url.
    base_url = property(_get_base_url)


    def _get_date_of_last_comment(self):

        '''
        Get the post date of the most recently posted comment on the
        submission.

        @return datetime - The post date of the most recent comment.
        '''

        return self.comment_set.aggregate(Min('post_date'))

    # Property assignment for _get_gate_of_last_comment.
    date_of_last_comment = property(_get_date_of_last_comment)


    def user_has_voted(self, user):

        '''
        Check to see whether a given user has voted on the submission.

        @param user (request.user) - The current user.

        @return boolean - True if the user has already voted.
        '''

        vote = None

        if user.is_authenticated():
            vote = SubmissionVote.objects.filter(user = user, submission = self)

        return bool(vote)


class CommentManager(models.Manager):

    '''
    Table class for Comment.
    '''

    # Constants for the number of pixels that children comments should be
    # indented on comments pages ('comments') and for the previews on the links
    # pages ('teasers').
    indent_multipliers = {
        'comments': 30,
        'teasers': 20
    }

    def sort(self, submission_id, user):

        '''
        Get the comments for a given submission and construct the ordering
        based on the parent comment keying. This function initiates the
        recursive add_children(), which fills in the children comments for a
        given comment along with each of the children's overall level of
        indentation relative to the root level.

        @param submission_id (integer) - The id of the submission that comments
        are being shown for.
        @param user (request.user) - The current user.

        @return list - A list of tuples in which the first element, at index 0,
        is the comment objects, and the second element, at index 1, is the
        number of pixels that the comment should be indented from the root
        level. This is calculated using the static multipliers defined in
        indent_multipliers. This could also be done by just returning the level
        of indentation in integer format (0, 1, 2, etc.) and then defining css
        styles for each of these indentation levels, up to some max.
        '''

        # Create empty lists for ordered_comments (the container for the final
        # constructed list of tuples) and self.order, the class global acted on
        # by add_children as it recurses.
        ordered_comments = []
        self.order = []
        self.indentation_depth = 0

        # Get all comments for the submission.
        self.all_comments = Comment.objects.filter(submission__id = submission_id).order_by('post_date')

        # Iterate through the comment set, append the user_has_voted attribute
        # depending on whether or not the current user has upvoted the
        # comment, and call add_children, which fills in children comments in
        # the self.order list.
        for comment in self.all_comments:
            comment.has_voted = comment.user_has_voted(user)
            self.add_children(comment)

        # Iterate over the self.order list of tuples generated by add_children
        # and build a new set of tuples that includes the full comment objects.
        for id_indent_tuple in self.order:
            ordered_comments.append(([comment for comment in self.all_comments
                if comment.id == id_indent_tuple[0]][0], id_indent_tuple[1] * self.indent_multipliers['comments']))

        return ordered_comments

    def add_children(self, comment):

        '''
        Recursively construct the ordering for chronologically-nested comments.

        @param comment (Comment) - The comment to add children to.

        @return void.
        '''

        # If the comment's id is not already in the order list (that is, if it
        # hasn't already been included in a previous recursive run of the loop
        # as a child comment to another comment), add the id now.
        if comment.id not in [order[0] for order in self.order]:
            self.order.append((comment.id, self.indentation_depth))

        # Get the children comments.
        children = [child for child in self.all_comments if child.parent_id == comment.id]

        # Notch up the indentation depth before recursing.
        self.indentation_depth += 1

        # Call add_children on each of the children comments.
        for child_comment in children:
            self.add_children(child_comment)

        # Notch down the indentation depth.
        self.indentation_depth -= 1

        # Kick up.
        return


    def create_comment(self, comment, post_date, submission, user, parent):

        '''
        Insert a new comment.

        @param comment (string) - The comment.
        @param post_date (datetime) - The time the comment is being posted.
        @param submission (Submission) - The submission being commented on.
        @param user (request.user) - The current user.
        @param parent (Comment) - The parent comment.

        @return void.
        '''

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

    def rank(self, user = AnonymousUser, mylinks = False):

        '''
        Core sort method. Returns list of tags, sliced by page and filtered by
        user if mylinks is specified.

        @param page (string) - The page number.
        @param mylinks (boolean) - True if mylinks is selected.

        @return queryset - The tags.
        '''

        result_list = []

        # Get tag set.
        tags = self.model.objects.all()

        for row in tags:

            if mylinks:
                if TagSubmission.objects.filter(submission__user = user, tag = tag).exists():
                    row.user_count = row._get_total_user_submissions(user)

        if mylinks: sorted_tags = sorted(tags, key = lambda a: a.user_count, reverse = True)
        else: sorted_tags = sorted(tags, key = lambda a: a.count, reverse = True)

        return sorted_tags[:SubmissionManager.TAGS_PER_PAGE]


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
