from django.db import models
from django.contrib.auth.models import User
import datetime as dt
import urlparse


class UserProfile(models.Model):

    user = models.OneToOneField(User)
    karma = models.PositiveIntegerField(default=0)
    location = models.CharField(max_length=50)
    website = models.CharField(max_length=200)
    bio = models.TextField()

    def __unicode__(self):
        return self.username


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

    def _get_submission_type(self):
        return '' if self.url == '' else '(' + self._get_base_url() + ')'
    submission_type = property(_get_submission_type)

    def _get_number_of_votes(self, minusone = True):
        votes = self.submissionvote_set.filter(direction=True).count()
        return votes - 1 if minusone else votes
    number_of_votes = property(_get_number_of_votes)

    def _get_score(self):
        votes = self._get_number_of_votes(minusone = False)
        age = dt.datetime.now() - self.post_date
        return (votes) / pow(((age.seconds / 3600.00) + 2), self.gravity)
    score = property(_get_score)

    def _get_base_url(self):
        parse = urlparse.urlparse(self.url)
        return parse.netloc[4:] if parse.netloc[0:4] == 'www.' else parse.netloc


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


class TagSubmission(models.Model):

    submission = models.ForeignKey(Submission)
    tag = models.ForeignKey(Tag)
