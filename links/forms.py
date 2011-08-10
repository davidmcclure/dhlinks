from django import forms
from links.models import *
from django.core.validators import URLValidator
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

class SubmitForm(forms.Form):

    '''
    Main submission form.
    '''


    url = forms.CharField(required=False, initial='url - leave blank to post a discussion thread')
    title = forms.CharField(required=True, initial='title', error_messages = { 'required': '// enter a title' })
    tags = forms.CharField(required=False, initial='tags')
    comment = forms.CharField(widget=forms.Textarea(), required=False, initial='comment')


    def clean(self):

        '''
        Validate the data.

        @return list - The cleaned data.
        '''

        cleaned_data = self.cleaned_data
        title = cleaned_data.get('title')
        url = cleaned_data.get('url')
        tags = cleaned_data.get('tags')
        comment = cleaned_data.get('comment')

        # Title.
        if title == 'title' or title == '':
            msg = u'// enter a title'
            self._errors['title'] = self.error_class([msg])

        # Url.
        if url not in ['', 'url - leave blank to post a discussion thread']:
            validate = URLValidator(verify_exists = True)
            try:
                validate(url)
            except ValidationError, e:
                msg = u'// bad url'
                self._errors['url'] = self.error_class([msg])

        else:
            cleaned_data['url'] = ''

        # Tags.
        split_tags = tags.rstrip(',').split(',')
        cleaned_tags = []

        for tag in split_tags:
            tag = tag.strip().lower()
            if len(tag) > 30:
                msg = u'// tags must be < 30 characters'
                self._errors['tags'] = self.error_class([msg])
            else:
                if tag != 'tags' and tag not in cleaned_tags: cleaned_tags.append(tag)

        cleaned_data['tags'] = cleaned_tags

        # Comment.
        if url in ['', 'url - leave blank to post a discussion thread'] and comment in ['', 'comment']:
            msg = u'// enter either a url or a comment'
            self._errors['url'] = self.error_class([msg])

        if comment in ['', 'comment']:
            cleaned_data['comment'] = ''

        return cleaned_data


class LoginForm(forms.Form):

    '''
    Login form.
    '''


    username = forms.CharField(required=True, initial='username')
    password = forms.CharField(required=True, widget=forms.PasswordInput, initial='password')
    remember_me = forms.BooleanField(required=False, label='remember me', initial=True)


    def clean(self):

        '''
        Validate the data.

        @return list - The cleaned data.
        '''

        cleaned_data = self.cleaned_data
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        # If the user exists, is the password correct?
        if User.objects.filter(username=cleaned_data.get('username')).exists():
            user = User.objects.get(username=cleaned_data.get('username'))
            if not user.check_password(password):
                msg = u'// wrong password'
                self._errors['password'] = self.error_class([msg])

        # If the user doesn't exist...
        else:
            msg = u'// nonexistent user name'
            self._errors['username'] = self.error_class([msg])

        return cleaned_data


class RegisterForm(forms.Form):

    '''
    Sign up form.
    '''


    username = forms.CharField(required=True, initial='username', error_messages = { 'required': '// enter a username' })
    password = forms.CharField(required=True, widget=forms.PasswordInput, initial='password', error_messages = { 'required': '// try again' })
    password_confirm = forms.CharField(required=True, widget=forms.PasswordInput, initial='confirm', error_messages = { 'required': '// try again' })
    email = forms.EmailField(required=True, initial='email')
    firstname = forms.CharField(required=True, initial='first name', error_messages = { 'required': '// enter your first name' })
    lastname = forms.CharField(required=True, initial='last name', error_messages = { 'required': '// enter your last name' })


    def clean(self):

        '''
        Validate the data.

        @return list - The cleaned data.
        '''

        cleaned_data = self.cleaned_data
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')
        email = cleaned_data.get('email')
        firstname = cleaned_data.get('firstname')
        lastname = cleaned_data.get('lastname')

        # Username.
        if username in ['', 'username']:
            msg = u'// enter a username'
            self._errors['username'] = self.error_class([msg])

        elif User.objects.filter(username=username).exists():
            msg = u'// username taken'
            self._errors['username'] = self.error_class([msg])

        # Passwords.
        if (password in ['', 'password'] or password_confirm in ['', 'confirm']) or password != password_confirm:
            msg = u'// try again'
            self._errors['password'] = self.error_class([msg])
            self._errors['password_confirm'] = self.error_class([msg])

        # Email.
        if email not in ['', 'email']:
            try:
                validate_email(email)
            except ValidationError:
                msg = u'// invalid address'
                self._errors['email'] = self.error_class([msg])

        else:
            msg = u'// enter an email address'
            self._errors['email'] = self.error_class([msg])

        # First name.
        if firstname in ['', 'firstname', 'first name']:
            msg = u'// enter your first name'
            self._errors['firstname'] = self.error_class([msg])

        # Last name.
        if lastname in ['', 'lastname', 'last name']:
            msg = u'// enter your last name'
            self._errors['lastname'] = self.error_class([msg])

        return cleaned_data


class CommentForm(forms.Form):

    '''
    Comment form.
    '''

    comment = forms.CharField(widget=forms.Textarea(), required=True, initial='comment')
    parent_id = forms.CharField(widget=forms.HiddenInput(), required=True)
    submission_id = forms.CharField(widget=forms.HiddenInput(), required=True)
