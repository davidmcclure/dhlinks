# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'UserProfile'
        db.create_table('links_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('karma', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
            ('location', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('website', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('bio', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('links', ['UserProfile'])

        # Adding model 'Submission'
        db.create_table('links_submission', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('url', self.gf('django.db.models.fields.CharField')(max_length=500, null=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('post_date', self.gf('django.db.models.fields.DateTimeField')()),
            ('upvotes', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
        ))
        db.send_create_signal('links', ['Submission'])

        # Adding model 'Comment'
        db.create_table('links_comment', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('comment', self.gf('django.db.models.fields.TextField')()),
            ('post_date', self.gf('django.db.models.fields.DateTimeField')()),
            ('submission', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['links.Submission'])),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='mastercomment', null=True, to=orm['links.Comment'])),
            ('upvotes', self.gf('django.db.models.fields.PositiveIntegerField')(default=0)),
        ))
        db.send_create_signal('links', ['Comment'])

        # Adding model 'Vote'
        db.create_table('links_vote', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('submit_date', self.gf('django.db.models.fields.DateTimeField')()),
        ))
        db.send_create_signal('links', ['Vote'])

        # Adding model 'SubmissionVote'
        db.create_table('links_submissionvote', (
            ('vote_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['links.Vote'], unique=True, primary_key=True)),
            ('submission', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['links.Submission'])),
        ))
        db.send_create_signal('links', ['SubmissionVote'])

        # Adding model 'CommentVote'
        db.create_table('links_commentvote', (
            ('vote_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['links.Vote'], unique=True, primary_key=True)),
            ('comment', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['links.Comment'])),
        ))
        db.send_create_signal('links', ['CommentVote'])

        # Adding model 'Tag'
        db.create_table('links_tag', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('tag', self.gf('django.db.models.fields.CharField')(max_length=50)),
        ))
        db.send_create_signal('links', ['Tag'])

        # Adding model 'TagSubmission'
        db.create_table('links_tagsubmission', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('submission', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['links.Submission'])),
            ('tag', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['links.Tag'])),
        ))
        db.send_create_signal('links', ['TagSubmission'])


    def backwards(self, orm):
        
        # Deleting model 'UserProfile'
        db.delete_table('links_userprofile')

        # Deleting model 'Submission'
        db.delete_table('links_submission')

        # Deleting model 'Comment'
        db.delete_table('links_comment')

        # Deleting model 'Vote'
        db.delete_table('links_vote')

        # Deleting model 'SubmissionVote'
        db.delete_table('links_submissionvote')

        # Deleting model 'CommentVote'
        db.delete_table('links_commentvote')

        # Deleting model 'Tag'
        db.delete_table('links_tag')

        # Deleting model 'TagSubmission'
        db.delete_table('links_tagsubmission')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'links.comment': {
            'Meta': {'object_name': 'Comment'},
            'comment': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'mastercomment'", 'null': 'True', 'to': "orm['links.Comment']"}),
            'post_date': ('django.db.models.fields.DateTimeField', [], {}),
            'submission': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['links.Submission']"}),
            'upvotes': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'})
        },
        'links.commentvote': {
            'Meta': {'object_name': 'CommentVote', '_ormbases': ['links.Vote']},
            'comment': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['links.Comment']"}),
            'vote_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['links.Vote']", 'unique': 'True', 'primary_key': 'True'})
        },
        'links.submission': {
            'Meta': {'object_name': 'Submission'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'post_date': ('django.db.models.fields.DateTimeField', [], {}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'upvotes': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'url': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'links.submissionvote': {
            'Meta': {'object_name': 'SubmissionVote', '_ormbases': ['links.Vote']},
            'submission': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['links.Submission']"}),
            'vote_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['links.Vote']", 'unique': 'True', 'primary_key': 'True'})
        },
        'links.tag': {
            'Meta': {'object_name': 'Tag'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'tag': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'links.tagsubmission': {
            'Meta': {'object_name': 'TagSubmission'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'submission': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['links.Submission']"}),
            'tag': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['links.Tag']"})
        },
        'links.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'bio': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'karma': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'}),
            'location': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'}),
            'website': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'links.vote': {
            'Meta': {'object_name': 'Vote'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'submit_date': ('django.db.models.fields.DateTimeField', [], {}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        }
    }

    complete_apps = ['links']
