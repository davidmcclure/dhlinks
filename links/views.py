from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.contrib import auth
from django import forms
from links.forms import *
from links.models import *
import datetime as dt


def frontpage(request):

    '''
    Show submissions sorted by the core ranking algorithm.
    '''

    # Get submissions and tags.
    submissions = Submission.objects.rank(request.user);
    tags = Tag.objects.rank()

    # Push to template.
    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': 'rank',
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def new_sort(request):

    '''
    Show submissions sorted by when they were posted, most recent at the top.
    '''

    # Get submissions and tags.
    submissions = Submission.objects.age_rank(request.user)
    tags = Tag.objects.rank()

    # Push to template.
    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': 'age',
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def tag_sort(request, tag, sort):

    '''
    Show submissions with a certain tag.

    @param tag - The selected tag.
    @param sort - The selected sort parameter.
    '''

    # Get submissions, tags, and the selected tag.
    submissions = Submission.objects.tag_rank(request.user, tag, sort)
    tags = Tag.objects.rank()
    tag = Tag.objects.get_by_url_slug(tag)

    # Push to template.
    return render_to_response('links/tag.html', {
        'submissions': submissions,
        'tags': tags,
        'tag': tag,
        'sort': sort,
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def comments_sort(request):

    '''
    Show submissions sorted by most recent comment.
    '''

    # Get submissions and tags.
    submissions = Submission.objects.comment_rank(request.user)
    tags = Tag.objects.rank()

    # Push to template.
    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': 'comments',
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def mylinks_sort(request, sort):

    '''
    Show links and discussions submitted by the current user.
    '''

    # Get submissions and tags.
    submissions = Submission.objects.mylinks_rank(request.user, sort);
    tags = Tag.objects.mylinks_rank(request.user)


    # Push to template.
    return render_to_response('links/mylinks.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': sort,
        'tag': None,
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def mylinks_tag_sort(request, tag, sort):

    '''
    Show links and discussions submitted by the current user, filtered by tag.
    '''

    # Get submissions and tags.
    submissions = Submission.objects.mylinks_tag_rank(request.user, sort, tag);
    tags = Tag.objects.mylinks_rank(request.user)
    tag = Tag.objects.get_by_url_slug(tag)

    # Push to template.
    return render_to_response('links/mylinks.html', {
        'submissions': submissions,
        'tags': tags,
        'tag': tag,
        'sort': sort,
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def comments(request, submission_id):

    '''
    Main comments view. It may be best to eventually split this off into its
    own app?
    '''

    # Get comments and tags.
    submission = Submission.objects.get(pk = submission_id)
    comments = Comment.objects.comments(submission_id, 'comments')
    teasers = Comment.objects.comments(submission_id, 'teasers')
    tags = Tag.objects.rank()

    # Push to template.
    return render_to_response('links/comments.html', {
        'submission': submission,
        'comments': comments,
        'teasers': teasers,
        'tags': tags,
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def submit(request):

    '''
    Process the submission flow.
    '''

    # Is the user logged in?
    if request.user.is_authenticated():

        # Has a form been posted?
        if request.method == 'POST':

            form = SubmitForm(request.POST)

            # Does the data in the form pass the validation checks?
            if form.is_valid():

                # Establish variables for model instantiations.
                url = form.cleaned_data['url']
                title = form.cleaned_data['title']
                comment = form.cleaned_data['comment']
                tags = form.cleaned_data['tags']
                user = request.user
                post_date = dt.datetime.now()

                # Create the new submission.
                submission = Submission.objects.create_submission(
                    url, title, user, post_date)

                # Create the new tags.
                Tag.objects.create_tags(tags, submission)

                # Create the starting upvote.
                SubmissionVote.objects.create_vote(
                    user, submission, True, post_date)

                # Create the first comment, if it exists.
                Comment.objects.create_comment(
                    comment, post_date, submission)

                # Redirect to the front page.
                return HttpResponseRedirect('/')

        # If no form is posted, show the form.
        else: form = SubmitForm()

        # Push the form into the template.
        return render_to_response('links/submit.html', {
            'form': form
        }, context_instance=RequestContext(request))

    # If the user is not logged in, set a session variable that
    # records the origin of the login flow and redirect to login.
    else:
        request.session['login_redirect'] = 'submit'
        request.session['register_redirect'] = 'submit'
        return HttpResponseRedirect('/login')


def login(request):

    '''
    Process the login flow.
    '''

    # Is the user logged in?
    if not request.user.is_authenticated():

        # Has a form been posted?
        if request.method == 'POST':

            form = LoginForm(request.POST)

            # Does the data in the form pass the validation checks?
            if form.is_valid():

                # Get the usename and password out of the cleaned data.
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']

                # Throw the combo at the auth system, which checks to
                # see if the user exists and, if so, returns her User object.
                user = auth.authenticate(
                    username = username,
                    password = password)

                # If the user exists and is active (Django taxonomy),
                # log the use in and redirect to wherever the user was
                # trying to go when she was prompted to log in.
                if user is not None and user.is_active:
                    auth.login(request, user)
                    request.session.set_expiry(0)
                    return HttpResponseRedirect('/' + request.session.get('login_redirect', ''))

        # If no form is posted, show the form.
        else: form = LoginForm()

        # Push the form into the template.
        return render_to_response('links/login.html', {
            'form': form
        }, context_instance=RequestContext(request))

    # If the use is already logged in, bounce her out to the front page.
    else: return HttpResponseRedirect('/');


def register(request):

    '''
    Process the registration flow.
    '''

    # Is the user logged in?
    if not request.user.is_authenticated():

        # Has a form been posted?
        if request.method == 'POST':

            form = RegisterForm(request.POST)

            # Does the data in the form pass the validation checks?
            if form.is_valid():

                # Get the new user information out of the cleaned data.
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                email = form.cleaned_data['email']
                firstname = form.cleaned_data['firstname']
                lastname = form.cleaned_data['lastname']

                # Create the new user profile record.
                UserProfile.objects.create_user(
                    username, email, password, firstname, lastname)

                # Authenticate the new user.
                user = auth.authenticate(
                    username = username,
                    password = password)

                # Log the new user in.
                auth.login(request, user)
                request.session.set_expiry(0)

                # Redirect to wherever the user was when she was prompted to
                # login/register.
                return HttpResponseRedirect('/' + request.session.get('register_redirect', ''))

        # If no form is posted, show the form.
        else: form = RegisterForm()

        # Push the form into the template.
        return render_to_response('links/register.html', {
                'form': form
            }, context_instance=RequestContext(request))

    # If the user is already logged in, bounce out to the front page.
    else: return HttpResponseRedirect('/');


def logout(request):

    '''
    Do logout.
    '''

    auth.logout(request)
    return HttpResponseRedirect('/')


def submissionvote(request, submission_id, direction):

    '''
    Process an upvote.
    '''

    # Is the user logged in?
    if request.user.is_authenticated():

        # Fetch the submission object, get the current time.
        submission = Submission.objects.get(pk = submission_id)
        user = request.user
        submit_date = dt.datetime.now()

        # If the user has already upvoted the link, redirect to the front page.
        # Theoretically, this should never be the case, since the view code
        # only displays the upvote link if the user has not already upvoted a
        # given submission. This safeguard prevents cheating by manually
        # hitting the /submission/upvote route.
        if SubmissionVote.objects.vote_exists(user, submission):
            return HttpResponseRedirect('/')

        # Otherwise, create the new vote record and redirect to the front page.
        else:
            SubmissionVote.objects.create_vote(
                user, submission, direction, submit_date)
            return HttpResponseRedirect('/')

    # If the user is not logged in, prompt login and store flow origin.
    else:
        request.session['login_redirect'] = 'submission/upvote/' + submission_id
        request.session['register_redirect'] = 'submission/upvote/' + submission_id
        return HttpResponseRedirect('/login')


# def jsontest(request):
#     links = Submission.objects.all()
#     return HttpResponse(serializers.serialize('json', links), mimetype='application/json')
