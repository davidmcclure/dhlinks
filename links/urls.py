from django.conf.urls.defaults import *

urlpatterns = patterns('links.views',

    (r'^$', 'frontpage'),
    (r'^(?P<page_number>\d+)$', 'frontpage'),
    (r'^new$', 'new'),
    (r'^new/(?P<page_number>\d+)$', 'new'),
    (r'^submit$', 'submit'),
    (r'^login$', 'login'),
    (r'^logout', 'logout'),
    (r'^comments/(?P<submission_id>\d+)$', 'comments'),
    (r'^submission/upvote/(?P<submission_id>\d+)$', 'submissionvote', { 'direction': True }),
    (r'^register$', 'register')

)
