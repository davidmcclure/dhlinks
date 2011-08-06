from django import forms
from links.models import *
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

class SubmitForm(forms.Form):

    url = forms.CharField(required=False, initial='url - leave blank to post a discussion thread')
    title = forms.CharField(required=True, initial='title', error_messages = { 'required': '// enter a title' })
    tags = forms.CharField(required=False, initial='tags')
    comment = forms.CharField(widget=forms.Textarea(), required=False, initial='comment')

    def clean(self):

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

        # Tags.
        split_tags = tags.split(',')
        cleaned_tags = []
        for tag in split_tags:
            tag = tag.strip().lower()
            if len(tag) > 30:
                msg = u'// tags must be < 30 characters'
                self._errors['tags'] = self.error_class([msg])
            else:
                if tag != 'tags': cleaned_tags.append(tag)

        cleaned_data['tags'] = cleaned_tags

        # Comment.
        if url in ['', 'url - leave blank to post a discussion thread'] and comment in ['', 'comment']:
            msg = u'// enter either a url or a comment'
            # self._errors['comment'] = self.error_class([msg])
            self._errors['url'] = self.error_class([msg])

        if comment in ['', 'comment']:
            cleaned_data['comment'] = ''

        return cleaned_data


class LoginForm(forms.Form):

    username = forms.CharField(required=True, initial='username')
    password = forms.CharField(required=True, widget=forms.PasswordInput, initial='password')
    remember_me = forms.BooleanField(required=False, label='remember me', initial=True)

    def clean(self):

        cleaned_data = self.cleaned_data
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if User.objects.filter(username=cleaned_data.get('username')).exists():
            user = User.objects.get(username=cleaned_data.get('username'))
            if not user.check_password(password):
                msg = u'// wrong password'
                self._errors['password'] = self.error_class([msg])

        else:
            msg = u'// nonexistent user name'
            self._errors['username'] = self.error_class([msg])

        return cleaned_data


class RegisterForm(forms.Form):

    username = forms.CharField(required=True, initial='username')
    password = forms.CharField(required=True, widget=forms.PasswordInput, initial='password')
    password_confirm = forms.CharField(required=True, widget=forms.PasswordInput, initial='confirm')
    email = forms.EmailField(required=True, initial='email')
    firstname = forms.CharField(required=True, initial='first name')
    lastname = forms.CharField(required=True, initial='last name')

    def clean(self):

        cleaned_data = self.cleaned_data
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password != password_confirm:
            raise forms.ValidationError('Passwords do not match.')

        if User.objects.filter(username=cleaned_data.get('username')).exists():
            raise forms.ValidationError('Username taken.')

        return cleaned_data


class CommentForm(forms.Form):

    comment = forms.CharField(widget=forms.Textarea(), required=True, initial='comment')
    parent_id = forms.CharField(widget=forms.HiddenInput(), required=True)
    submission_id = forms.CharField(widget=forms.HiddenInput(), required=True)
