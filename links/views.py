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

    submissions = Submission.objects.rank(request.user);
    tags = Tag.objects.rank()

    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags
    }, context_instance=RequestContext(request))


def new(request):

    submissions = Submission.objects.all().order_by('-post_date')
    tags = Tag.objects.rank()

    return render_to_response('links/links.html', {
        'submissions': submissions,
        'tags': tags
    }, context_instance=RequestContext(request))


def tag(request, tag):

    submissions = Submission.objects.tag_rank(request.user, tag)
    tags = Tag.objects.rank()

    return render_to_response('links/tag.html', {
        'submissions': submissions,
        'tags': tags,
        'tag': tag
    }, context_instance=RequestContext(request))


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
                    redirect = '/'
                    if 'login_redirect' in request.session:
                        redirect += request.session.get('login_redirect')
                    return HttpResponseRedirect(redirect)

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

                new_user = User.objects.create_user(
                    form.cleaned_data['username'],
                    form.cleaned_data['email'],
                    form.cleaned_data['password'])

                new_user.first_name = form.cleaned_data['firstname']
                new_user.last_name = form.cleaned_data['lastname']
                new_user.save()
                new_user_profile = UserProfile(
                        user = new_user,
                        location = form.cleaned_data['location'],
                        website = form.cleaned_data['website'],
                        bio = form.cleaned_data['bio']
                    )
                new_user_profile.save()
                user = auth.authenticate(
                        username = form.cleaned_data['username'],
                        password = form.cleaned_data['password']
                    )
                auth.login(request, user)
                request.session.set_expiry(0)
                return HttpResponseRedirect('/' + request.session.get('register_redirect', ''))
        else:
            form = RegisterForm()
        return render_to_response('links/register.html', {
                'form': form
            }, context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect('/');


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/')


def submissionvote(request, submission_id, direction):
    if request.user.is_authenticated():
        submission = Submission.objects.get(pk = submission_id)
        if SubmissionVote.objects.filter(user = request.user, submission = submission).exists():
            SubmissionVote.objects.get(user = request.user, submission = submission)
            return HttpResponseRedirect('/')
        else:
            vote_record = SubmissionVote(
                    user = request.user,
                    submission = submission,
                    direction = direction,
                    submit_date = dt.datetime.now()
                )
            vote_record.save()
            submission.save()
            return HttpResponseRedirect('/')
    else:
        request.session['login_redirect'] = 'submission/upvote/' + submission_id
        request.session['register_redirect'] = 'submission/upvote/' + submission_id
        return HttpResponseRedirect('/login')


# def jsontest(request):
#     links = Submission.objects.all()
#     return HttpResponse(serializers.serialize('json', links), mimetype='application/json')
