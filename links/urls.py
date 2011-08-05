from django.conf.urls.defaults import *

urlpatterns = patterns('links.views',

    # ** Show submissions ** #

    # Default front page.
    (r'^$', 'submissions'),

    # Sorted by age.
    (r'^new$', 'submissions', {
        'sort': 'new'
        }),

    # Filtered by tag.
    (r'^(?P<tag>[-\w]+)$', 'submissions'),

    # Sorted by most recent comment.
    (r'^comments$', 'submissions', {
        'sort': 'comments'
        }),

    # Filtered by tag and sorted by sort parameter.
    (r'^(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'submissions'),

    # Current user's links, ordered by rank.
    (r'^my-links$', 'submissions', {
        'mylinks': True,
        'navigation': 'mylinks' 
        }),

    # Current user's links, ordered by age.
    (r'^my-links/new$', 'submissions', {
        'mylinks': True,
        'sort': 'new',
        'navigation': 'mylinks'
        }),

    # Current user's links, ordered by most recent comment.
    (r'^my-links/comments$', 'submissions', { 
        'mylinks': True,
        'sort': 'comments',
        'navigation': 'mylinks'
        }),

    # Current user's links, filtered by tag.
    (r'^my-links/(?P<tag>[-\w]+)$', 'submissions', {
        'mylinks': True,
        'navigation': 'mylinks' 
        }),

    # Current user's links, filtered by tag and sorted by sort parameter.
    (r'^my-links/(?P<tag>[-\w]+)/(?P<sort>[\w]+)', 'submissions', {
        'mylinks': True,
        'navigation': 'mylinks'
        }),

    # ** Comments ** #

    # Show comments for submission.
    (r'^comments/(?P<submission_id>\d+)$', 'comments'),

    # ** Administration and submission. ** #

    # Submit form.
    (r'^submit$', 'submit'),

    # Login form.
    (r'^login$', 'login'),

    # Register form.
    (r'^register$', 'register'),

    # Do logout (redirects).
    (r'^logout$', 'logout'),

    # Upvote submission.
    (r'^submission/upvote/(?P<submission_id>\d+)$', 'submissionvote',{
        'direction': True
        }),

    # Upvote comment.
    (r'^comment/upvote/(?P<comment_id>\d+)$', 'commentvote',{
        'direction': True
        })

)
