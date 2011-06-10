from django.conf.urls.defaults import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('links.views',

    (r'^$', 'frontpage'),
    (r'^(?P<page_number>\d+)$', 'frontpage'),
    (r'^new$', 'new'),
    (r'^new/(?P<page_number>\d+)$', 'new'),
    (r'^submit$', 'submit'),
    (r'^login$', 'login'),
    (r'^logout', 'logout'),
    (r'^comments/(?P<submission_id>\d+)$', 'comments'),
    (r'^upvote/(?P<submission_id>\d+)$', 'upvote'),
    (r'^register$', 'register')

)
