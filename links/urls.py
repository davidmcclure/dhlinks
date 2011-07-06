from django.conf.urls.defaults import *

urlpatterns = patterns('links.views',

    (r'^$', 'frontpage'),
    (r'^new$', 'new'),
    (r'^submit$', 'submit'),
    (r'^login$', 'login'),
    (r'^logout', 'logout'),
    (r'^comments/(?P<submission_id>\d+)$', 'comments'),
    (r'^submission/upvote/(?P<submission_id>\d+)$', 'submissionvote', { 'direction': True }),
    (r'^register$', 'register'),
    (r'^(?P<tag>[-\w]+)$', 'tag')

)
