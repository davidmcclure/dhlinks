from django.shortcuts import render_to_response
from django.core.context_processors import csrf
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.contrib import auth
from django import forms
from links.forms import *
from links.models import *
import datetime as dt

def frontpage(request, page_number=1):
	return HttpResponseRedirect('/new')

def new(request, page_number=1):
	links_per_page = 50
	page_number = int(page_number)
	submissions = Submission.objects.all().order_by('-post_date')\
			[(page_number-1)*links_per_page:page_number*links_per_page]
	return render_to_response('links/links.html', {
		'submissions': submissions
	})

def submit(request):
	if request.user.is_authenticated():
		if request.method == 'POST':
			form = SubmitForm(request.POST)
			if form.is_valid():
				submission = Submission(
						url=form.cleaned_data['url'],
						title=form.cleaned_data['title'],
						user=request.user,
						post_date=dt.datetime.now()
					)
				submission.save()
				if form.cleaned_data['comment'] != '':
					firstcomment = Comment(
							comment=form.cleaned_data['comment'],
							post_date=dt.datetime.now(),
							submission=submission
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
		return HttpResponseRedirect('/login')

def login(request):
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
				return HttpResponseRedirect('/' + request.session.get('login_redirect'))
	else:
		form = LoginForm()
	return render_to_response('links/login.html', {
		'redirect': request.session.get('login_redirect'),
		'form': form
	})

def register(request):
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
					user=new_user,
					location=form.cleaned_data['location'],
					website=form.cleaned_data['website'],
					bio=form.cleaned_data['bio']
				)
			new_user_profile.save()
			user = auth.authenticate(
					username = form.cleaned_data['username'],
					password = form.cleaned_data['password']
				)
			auth.login(request, user)
			request.session.set_expiry(0)
			return HttpResponseRedirect('/submit')
	else:
		form = RegisterForm()
	return render_to_response('links/register.html', {
			'form': form
		})

def logout(request):
	auth.logout(request)
	return HttpResponseRedirect('/')

def upvote(request, submission_id):
	if request.user.is_authenticated():
		submission = Submission.objects.get(pk=submission_id)
		try:
			SubmissionVote.objects.get(user=request.user, submission=submission)
			return HttpResponseRedirect('/')
		except SubmissionVote.DoesNotExist:
			vote_record = SubmissionVote(
					user=request.user,
					submission=submission,
					submit_date=dt.datetime.now()
				)
			vote_record.save()
			submission.upvotes += 1
			submission.save()
			return HttpResponseRedirect('/')
	else:
		request.session['login_redirect'] = 'upvote/' + submission_id
		return HttpResponseRedirect('/login')
