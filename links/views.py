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

    # Earthshatteringly slow way of doing the sort. How to do this?
    submissions = sorted(Submission.objects.all(), key = lambda a: a.score, reverse = True);
    tags = sorted(Tag.objects.all(), key = lambda a: a.count, reverse = True)
    has_voted_tuples = []
    for s in submissions:
        if request.user.is_authenticated():
            has_voted_tuples.append((s, s._user_has_voted(request.user)))
        else:
            has_voted_tuples.append((s, False))
    return render_to_response('links/links.html', {
        'submissions': has_voted_tuples,
        'tags': tags
    }, context_instance=RequestContext(request))


def new(request):
    submissions = Submission.objects.all().order_by('-post_date')
    tags = sorted(Tag.objects.all(), key = lambda a: a.count, reverse = True)
    has_voted_tuples = []
    for s in submissions:
        if request.user.is_authenticated():
            has_voted_tuples.append((s, s._user_has_voted(request.user)))
        else:
            has_voted_tuples.append((s, False))
    return render_to_response('links/links.html', {
        'submissions': has_voted_tuples,
        'tags': tags
    }, context_instance=RequestContext(request))


def tag(request, tag):
    tag = tag.replace('-', ' ')
    submissions = sorted(Submission.objects.filter(tagsubmission__tag__tag = tag), key = lambda a: a.score, reverse = True);
    tags = sorted(Tag.objects.all(), key = lambda a: a.count, reverse = True)
    has_voted_tuples = []
    for s in submissions:
        if request.user.is_authenticated():
            has_voted_tuples.append((s, s._user_has_voted(request.user)))
        else:
            has_voted_tuples.append((s, False))
    return render_to_response('links/tag.html', {
        'submissions': has_voted_tuples,
        'tags': tags,
        'tag': tag
    }, context_instance=RequestContext(request))


def submit(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            form = SubmitForm(request.POST)
            if form.is_valid():
                submission = Submission( # BREAK ALL OF THESE ADDERS OFF INTO MODEL CLASSES
                        url = form.cleaned_data['url'],
                        title = form.cleaned_data['title'],
                        user = request.user,
                        post_date = dt.datetime.now()
                    )
                submission.save()
                if form.cleaned_data['tags'] != '':
                    tags = form.cleaned_data['tags'].split(',')
                    for tag in tags:
                        if len(tag) <= 30: # check this in the form class, bounce back if any of the tags are too long
                            tag = tag.strip().lower()
                            parent_tag = Tag.objects.filter(tag = tag)
                            if parent_tag: parent_tag = parent_tag[0]
                            else:
                                parent_tag = Tag(tag = tag)
                                parent_tag.save()
                            tag_submission = TagSubmission(
                                        submission = submission,
                                        tag = parent_tag
                                )
                            tag_submission.save()
                vote_record = SubmissionVote(
                        user = request.user,
                        submission = submission,
                        direction = True,
                        submit_date = dt.datetime.now()
                    )
                vote_record.save()
                if form.cleaned_data['comment'] != '':
                    firstcomment = Comment(
                            comment = form.cleaned_data['comment'],
                            post_date = dt.datetime.now(),
                            submission = submission
                        )
                    firstcomment.save()
                return HttpResponseRedirect('/')
        else:
            form = SubmitForm()
        return render_to_response('links/submit.html', {
            'form': form
        })
    else:
        request.session['login_redirect'] = 'submit'
        request.session['register_redirect'] = 'submit'
        return HttpResponseRedirect('/login')


def login(request):
    if not request.user.is_authenticated():
        if request.method == 'POST':
            form = LoginForm(request.POST)
            if form.is_valid():
                user = auth.authenticate(
                        username=form.cleaned_data['username'],
                        password=form.cleaned_data['password']
                    )
                if user is not None and user.is_active:
                    auth.login(request, user)
                    request.session.set_expiry(0)
                    redirect = '/'
                    if 'login_redirect' in request.session:
                        redirect += request.session.get('login_redirect')
                    return HttpResponseRedirect(redirect)
        else:
            form = LoginForm()
        return render_to_response('links/login.html', {
            'form': form
        })
    else:
        return HttpResponseRedirect('/');


def register(request):
    if not request.user.is_authenticated():
        if request.method == 'POST':
            form = RegisterForm(request.POST)
            if form.is_valid():
                new_user = User.objects.create_user(
                        form.cleaned_data['username'],
                        form.cleaned_data['email'],
                        form.cleaned_data['password']
                    )
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
            })
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
