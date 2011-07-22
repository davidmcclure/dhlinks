from django.conf.urls.defaults import *

urlpatterns = patterns('links.views',

    (r'^$', 'frontpage'),
    (r'^new$', 'new'),
    (r'^submit$', 'submit'),
    (r'^login$', 'login'),
    (r'^logout$', 'logout'),
    (r'^submission/upvote/(?P<submission_id>\d+)$', 'submissionvote', { 'direction': True }),
    (r'^register$', 'register'),
    (r'^comments$', 'comments'),
    (r'^my-links$', 'mylinks', { 'sort': 'rank' }),
    (r'^my-links/new$', 'mylinks', { 'sort': 'new' }),
    (r'^my-links/comments$', 'mylinks', { 'sort': 'comments' }),
    (r'^(?P<tag>[-\w]+)$', 'tag', { 'sort': 'rank' }),
    (r'^(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'tag')

)
