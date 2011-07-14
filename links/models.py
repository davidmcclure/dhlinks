from django.db import models
from django.db.models import Min
from django.contrib.auth.models import User
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

        return self.user.username

    def _get_karma(self):

        comment_count = Comment.objects.filter(submission__user = self.user).count()
        upvote_count = SubmissionVote.objects.filter(submission__user = self.user).count()
        return comment_count + upvote_count;

    karms = property(_get_karma)


class SubmissionManager(models.Manager):

    SORT_FUNCS = {
        'rank': operator.attrgetter('score'),
        'comments': operator.attrgetter('date_of_last_comment'),
        'new': operator.attrgetter('post_date')
    }

    def rank(self, user):
        result_list = []
        for row in self.model.objects.all():
            submsision = self.model.objects.get(id = row.id)
            row.has_voted = submsision.user_has_voted(user)
            result_list.append(row)
        return sorted(result_list, key = SubmissionManager.SORT_FUNCS['rank'], reverse = True)

    def tag_rank(self, user, tag, sort):
        result_list = []
        for row in self.model.objects.filter(tagsubmission__tag__tag = tag.replace('-', ' ')):
            submsision = self.model.objects.get(id = row.id)
            row.has_voted = submsision.user_has_voted(user)
            if sort == 'comments' and row.comment_set.count() == 0:
                pass
            else: result_list.append(row)
        return sorted(result_list, key = SubmissionManager.SORT_FUNCS[sort], reverse = (sort != 'new'))

    def comment_rank(self, user):
        result_list = []
        for row in self.model.objects.all():
            submsision = self.model.objects.get(id = row.id)
            row.has_voted = submsision.user_has_voted(user)
            if row.comment_set.count() > 0:
                result_list.append(row)
        return sorted(result_list, key = SubmissionManager.SORT_FUNCS['comments'], reverse = True)

    def create_submission(self, url, title, user, post_date):
        submission = Submission(
            url = url,
            title = title,
            user = user,
            post_date = post_date)
        submission.save()
        return submission

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

    def user_has_voted(self, user):
        vote = []
        if user.is_authenticated():
            vote = SubmissionVote.objects.filter(user = user, submission = self)
        return True if vote else False



class CommentManager(models.Manager):

    def create_comment(self, comment, post_date, submission):
        if comment != '':
            first_comment = Comment(
                comment = comment,
                post_date = post_date,
                submission = submission)
            first_comment.save()

class Comment(models.Model):

    comment = models.TextField()
    post_date = models.DateTimeField()
    submission = models.ForeignKey(Submission)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='mastercomment')

    objects = CommentManager()

    def __unicode__(self):
        return self.comment



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
        return True if SubmissionVote.objects.filter(user = user, submission = submission).exists() else False

class SubmissionVote(Vote):

    submission = models.ForeignKey(Submission)

    objects = SubmissionVoteManager()

    def __unicode__(self):
        return self.submission.title



class CommentVote(Vote):

    comment = models.ForeignKey(Comment)

    def __unicode__(self):
        return self.comment.comment


class TagManager(models.Manager):

    def rank(self):
        return sorted(self.model.objects.all(), key = lambda a: a.count, reverse = True)

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

    def _get_url_slug(self):
        return '-'.join(self.tag.split(' '))
    url_slug = property(_get_url_slug)


class TagSubmission(models.Model):

    submission = models.ForeignKey(Submission)
    tag = models.ForeignKey(Tag)

    def __unicode__(self):
        return self.submission.title + ' ~ ' + self.tag.tag
