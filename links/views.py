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


def submissions(request, sort = 'rank', tag = None, mylinks = False, navigation = None, page = 1):

    '''
    Show submissions.

    @param sort (string) - The sort vertical (rank, rage, or comments).
    @param tag (string) - The tag to sort by.
    @param mylinks (boolean) - True if the 'my links' filter is active.
    @param navigation (string) - The active nagivation link.
    @param page (integer) - The page number.
    '''

    # Get submissions and tags.
    submissions = Submission.objects.sort(request.user, sort, tag, mylinks, int(page))
    tags = Tag.objects.rank(request.user, int(page), mylinks)

    # If a tag is selected, get the tag record for the view.
    if tag: tag = Tag.objects.get_by_url_slug(tag)

    # Push to template.
    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': sort,
        'tag': tag,
        'anon': request.user.is_anonymous(),
        'mylinks': mylinks,
        'navigation': navigation,
        'page': page,
        'request': request
    }, context_instance = RequestContext(request))


def comments(request, submission_id, first = False):

    '''
    Show comments for a given submission.
    '''

    # Get comments and tags.
    submission = Submission.objects.get(pk = submission_id)
    comments = Comment.objects.comments(submission_id, request.user)
    tags = Tag.objects.rank()
    form = CommentForm()

    request.session['comments_redirect'] = 'comments/' + submission_id

    # Push to template.
    return render_to_response('links/comments.html', {
        'submission': submission,
        'hasvoted': submission.user_has_voted(request.user),
        'comments': comments,
        'form': form,
        'is_first': first,
        'tags': tags,
        'anon': request.user.is_anonymous()
    }, context_instance = RequestContext(request))


def addcomment(request):

    '''
    Insert a new comment.
    '''

    # Has a form been posted?
    if request.method == 'POST':

        form = CommentForm(request.POST)

        # Does the data in the form pass the validation checks?
        if form.is_valid():

            parent_id = form.cleaned_data['parent_id']
            submission_id = form.cleaned_data['submission_id']

            if parent_id != 'root': parent = Comment.objects.get(id = int(parent_id))
            else: parent = None

            submission = Submission.objects.get(id = int(submission_id))

            comment = form.cleaned_data['comment']
            post_date = dt.datetime.now()
            user = request.user

            # Create the first comment, if it exists.
            Comment.objects.create_comment(
                comment, post_date, submission, user, parent)

    return HttpResponseRedirect('/' + \
            request.session.get('comments_redirect', ''))

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
                    comment, post_date, submission, user, None)

                # Redirect to the front page.
                return HttpResponseRedirect('/')

        # If no form is posted, show the form.
        else: form = SubmitForm()

        # Push the form into the template.
        tags = Tag.objects.rank()
        return render_to_response('links/submit.html', {
            'form': form,
            'tags': tags,
            'anon': request.user.is_anonymous(),
            'navigation': 'submit'
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
                remember_me = form.cleaned_data['remember_me']

                # Throw the combo at the auth system
                user = auth.authenticate(
                    username = username,
                    password = password)

                # If the user exists and is active, log the use in
                # and redirect to wherever the user was trying to go
                # when she was prompted to log in.
                if user is not None and user.is_active:
                    auth.login(request, user)
                    if remember_me: request.session.set_expiry(0)
                    else: request.session.set_expiry(600)
                    return HttpResponseRedirect('/' + \
                            request.session.get('login_redirect', ''))

        # If no form is posted, show the form.
        else: form = LoginForm()

        # Get tags, push the form into the template.
        tags = Tag.objects.rank()
        return render_to_response('links/login.html', {
            'form': form,
            'tags': tags,
            'anon': request.user.is_anonymous(),
            'navigation': 'login'
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
                return HttpResponseRedirect('/' + \
                        request.session.get('register_redirect', ''))

        # If no form is posted, show the form.
        else: form = RegisterForm()

        # Push the form into the template.
        tags = Tag.objects.rank()
        return render_to_response('links/register.html', {
                'form': form,
                'tags': tags,
                'anon': request.user.is_anonymous(),
                'navigation': 'login'
            }, context_instance=RequestContext(request))

    # If the user is already logged in, bounce out to the front page.
    else: return HttpResponseRedirect('/');


def logout(request):

    '''
    Do logout.
    '''

    auth.logout(request)
    return HttpResponseRedirect('/')


def vote(request, voted_object_type, object_id, direction):

    '''
    Process an upvote.

    @param upvoted_object_type (string) - 'Comment' or 'Submission.'
    @param object_it (integer) - The id of the object to apply the vote to.
    @param direction (boolean) - True for up, False for down.
    '''

    # Is the user logged in?
    if request.user.is_authenticated():

        # Fetch the submission object, get the current time.
        voted_object = eval(voted_object_type).objects.get(pk = object_id)
        user = request.user
        submit_date = dt.datetime.now()

        # If the user has already upvoted the link, redirect to the front page.
        # Theoretically, this should never be the case, since the view code
        # only displays the upvote link if the user has not already upvoted a
        # given submission. This safeguard prevents users from cheating by manually
        # hitting the /submission/upvote route.
        if eval(voted_object_type + 'Vote').objects.vote_exists(user, voted_object):
            return HttpResponseRedirect('/')

        # Otherwise, create the new vote record and redirect to the front page.
        else:
            eval(voted_object_type + 'Vote').objects.create_vote(
                user, voted_object, direction, submit_date)

            if voted_object_type == 'Submission': return HttpResponseRedirect('/')
            elif voted_object_type == 'Comment': return HttpResponseRedirect('/comments/' \
                    + str(int(voted_object.submission.id)))

    # If the user is not logged in, prompt login and store flow origin.
    else:
        request.session['login_redirect'] = voted_object_type.lower() + '/upvote/' + object_id
        request.session['register_redirect'] = voted_object_type.lower() + '/upvote/' + object_id
        return HttpResponseRedirect('/login')


# def jsontest(request):
#     links = Submission.objects.all()
#     return HttpResponse(serializers.serialize('json', links), mimetype='application/json')
