from django.conf.urls.defaults import *

urlpatterns = patterns('links.views',

    (r'^$', 'frontpage'),
    (r'^new$', 'new_sort'),
    (r'^submit$', 'submit'),
    (r'^login$', 'login'),
    (r'^logout$', 'logout'),
    (r'^submission/upvote/(?P<submission_id>\d+)$', 'submissionvote', { 'direction': True }),
    (r'^register$', 'register'),
    (r'^comments$', 'comments_sort'),
    (r'^comments/(?P<submission_id>\d+)$', 'comments'),
    (r'^my-links$', 'mylinks_sort', { 'sort': 'rank' }),
    (r'^my-links/new$', 'mylinks_sort', { 'sort': 'new' }),
    (r'^my-links/comments$', 'mylinks_sort', { 'sort': 'comments' }),
    (r'^my-links/(?P<tag>[-\w]+)$', 'mylinks_tag_sort', { 'sort': 'rank' }),
    (r'^my-links/(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'mylinks_tag_sort'),
    (r'^(?P<tag>[-\w]+)$', 'tag_sort', { 'sort': 'rank' }),
    (r'^(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'tag_sort')

)
