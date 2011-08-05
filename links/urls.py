from django.conf.urls.defaults import *

urlpatterns = patterns('links.views',

    # Show submissions:

    (r'^$', 'submissions'),
    (r'^new$', 'submissions', { 'sort': 'new' }),
    (r'^comments$', 'submissions', { 'sort': 'comments' }),
    (r'^my-links$', 'submissions', { 'mylinks': True, 'navigation': 'mylinks' }),
    (r'^my-links/new$', 'submissions', { 'mylinks': True, 'sort': 'new', 'navigation': 'mylinks' }),
    (r'^my-links/comments$', 'submissions', { 'mylinks': True, 'sort': 'comments', 'navigation': 'mylinks' }),
    (r'^my-links/(?P<tag>[-\w]+)$', 'submissions', { 'mylinks': True, 'navigation': 'mylinks' }),
    (r'^my-links/(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'submissions', { 'mylinks': True, 'navigation': 'mylinks' }),
    (r'^(?P<tag>[-\w]+)$', 'submissions'),
    (r'^(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'submissions'),

    # Comments:
    (r'^comments/(?P<submission_id>\d+)$', 'comments'),

    # Administration and submission:
    (r'^submit$', 'submit'),
    (r'^login$', 'login'),
    (r'^logout$', 'logout'),
    (r'^submission/upvote/(?P<submission_id>\d+)$', 'submissionvote', { 'direction': True }),
    (r'^comment/upvote/(?P<comment_id>\d+)$', 'commentvote', { 'direction': True }),
    (r'^register$', 'register')

)
