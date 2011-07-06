from django.db import models
from django.contrib.auth.models import User
import datetime as dt
import urlparse


class UserProfile(models.Model):

    user = models.OneToOneField(User)

    def __unicode__(self):
        return self.user.username

    def _get_karma(self):
        comment_count = Comment.objects.filter(submission__user = self.user).count()
        upvote_count = SubmissionVote.objects.filter(submission__user = self.user).count()
        return comment_count + upvote_count;
    karms = property(_get_karma)


class Submission(models.Model):

    url = models.CharField(max_length=500, null=True)
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User)
    post_date = models.DateTimeField()

    links_per_page = 50
    gravity = 1.5

    def __unicode__(self):
        return self.title

    def _get_number_of_comments(self):
        return self.comment_set.all().count()
    number_of_comments = property(_get_number_of_comments)

    # def _get_submission_type(self):
    #     return '' if self.url == '' else '(' + self._get_base_url() + ')'
    # submission_type = property(_get_submission_type)

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


class Comment(models.Model):

    comment = models.TextField()
    post_date = models.DateTimeField()
    submission = models.ForeignKey(Submission)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='mastercomment')

    def __unicode__(self):
        return self.comment


class Vote(models.Model):

    user = models.ForeignKey(User)
    submit_date = models.DateTimeField()
    direction = models.BooleanField()

class SubmissionVote(Vote):

    submission = models.ForeignKey(Submission)

    def __unicode__(self):
        return self.submission.title


class CommentVote(Vote):

    comment = models.ForeignKey(Comment)

    def __unicode__(self):
        return self.comment.comment


class Tag(models.Model):

    tag = models.CharField(max_length=50)

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
