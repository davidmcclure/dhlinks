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
    Get submissions and tags for the default, algorithmically ranked front page
    view. Makes use of the custom model managers Submission.objects.rank() and
    Tag.objects.rank(), get run the queries and intercept the results sets to
    add custom attributes (notably the per-submission information about whether
    or not the current user has upvoted the submission) and runs ranking
    algorithms on the results. The submissions get run through the core ranking
    algorithm, and the tags are sorted according to the number times they have
    been assigned to a submission.

    @param request - The default request object dispatched by the URL router.
    @return render_to_response - The rendered template, populated by the
    submissions, tags, and selected sorting order.
    '''

    submissions = Submission.objects.rank(request.user);
    tags = Tag.objects.rank()

    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': 'rank'
    }, context_instance = RequestContext(request))


def new(request):

    submissions = Submission.objects.all().order_by('-post_date')
    tags = Tag.objects.rank()

    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': 'age'
    }, context_instance = RequestContext(request))


def tag(request, tag, sort):

    submissions = Submission.objects.tag_rank(request.user, tag, sort)
    tags = Tag.objects.rank()
    tag = Tag.objects.get_by_url_slug(tag)

    return render_to_response('links/tag.html', {
        'submissions': submissions,
        'tags': tags,
        'tag': tag,
        'sort': sort
    }, context_instance = RequestContext(request))


def comments(request):

    submissions = Submission.objects.comment_rank(request.user)
    tags = Tag.objects.rank()

    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags,
        'sort': 'comments'
    }, context_instance = RequestContext(request))


def submit(request):

    if request.user.is_authenticated():

        if request.method == 'POST':

            form = SubmitForm(request.POST)

            if form.is_valid():

                url = form.cleaned_data['url']
                title = form.cleaned_data['title']
                comment = form.cleaned_data['comment']
                tags = form.cleaned_data['tags']
                user = request.user
                post_date = dt.datetime.now()

                submission = Submission.objects.create_submission(
                    url, title, user, post_date)

                Tag.objects.create_tags(tags, submission)

                SubmissionVote.objects.create_vote(
                    user, submission, True, post_date)

                Comment.objects.create_comment(
                    comment, post_date, submission)

                return HttpResponseRedirect('/')

        else: form = SubmitForm()

        return render_to_response('links/submit.html', {
            'form': form
        }, context_instance=RequestContext(request))

    else:
        request.session['login_redirect'] = 'submit'
        request.session['register_redirect'] = 'submit'
        return HttpResponseRedirect('/login')


def login(request):

    if not request.user.is_authenticated():

        if request.method == 'POST':

            form = LoginForm(request.POST)

            if form.is_valid():

                username = form.cleaned_data['username']
                password = form.cleaned_data['password']

                user = auth.authenticate(
                    username = username,
                    password = password)

                if user is not None and user.is_active:
                    auth.login(request, user)
                    request.session.set_expiry(0)
                    return HttpResponseRedirect('/' + request.session.get('login_redirect', ''))

        else: form = LoginForm()

        return render_to_response('links/login.html', {
            'form': form
        }, context_instance=RequestContext(request))

    else: return HttpResponseRedirect('/');


def register(request):

    if not request.user.is_authenticated():

        if request.method == 'POST':

            form = RegisterForm(request.POST)

            if form.is_valid():

                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                email = form.cleaned_data['email']
                firstname = form.cleaned_data['firstname']
                lastname = form.cleaned_data['lastname']

                UserProfile.objects.create_user(
                    username, email, password, firstname, lastname)

                user = auth.authenticate(
                    username = username,
                    password = password)

                auth.login(request, user)
                request.session.set_expiry(0)

                return HttpResponseRedirect('/' + request.session.get('register_redirect', ''))

        else: form = RegisterForm()

        return render_to_response('links/register.html', {
                'form': form
            }, context_instance=RequestContext(request))

    else: return HttpResponseRedirect('/');


def logout(request):

    auth.logout(request)
    return HttpResponseRedirect('/')


def submissionvote(request, submission_id, direction):

    if request.user.is_authenticated():

        submission = Submission.objects.get(pk = submission_id)
        user = request.user
        submit_date = dt.datetime.now()

        if SubmissionVote.objects.vote_exists(user, submission):
            return HttpResponseRedirect('/')

        else:
            SubmissionVote.objects.create_vote(
                user, submission, direction, submit_date)
            return HttpResponseRedirect('/')

    else:
        request.session['login_redirect'] = 'submission/upvote/' + submission_id
        request.session['register_redirect'] = 'submission/upvote/' + submission_id
        return HttpResponseRedirect('/login')


# def jsontest(request):
#     links = Submission.objects.all()
#     return HttpResponse(serializers.serialize('json', links), mimetype='application/json')
