from django import forms
from links.models import *

class SubmitForm(forms.Form):

    url = forms.URLField(required=False, initial='url')
    title = forms.CharField(required=True, initial='title')
    tags = forms.CharField(required=False, initial='tags')
    comment = forms.CharField(widget=forms.Textarea(), required=False, initial='comment')

    def clean_url(self):

        url = self.cleaned_data.get('url')
        title = self.cleaned_data.get('title')

        if url == 'url':
            url = ''

        if url == '' and comment == '':
            raise forms.ValidationError('Enter a comment.')

        if url and title and comment:
            if url == '' and comment == '':
                raise forms.ValidationError('Enter a comment.')

        return url

    def clean_tags(self):

        tags = self.cleaned_data.get('tags').split(',')
        cleaned_tags = []
        for tag in tags:
            tag = tag.strip().lower()
            if len(tag) > 30:
                raise forms.ValidationError('// tags have to be shorter than 30 characters')
            else:
                cleaned_tags.append(tag)

        return cleaned_tags

    def clean_comment(self):

        dummy_form = SubmitForm()
        cleaned_comment = self.cleaned_data.get('comment')
        if cleaned_comment == 'comment':
            cleaned_comment = ''

        return cleaned_comment


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

    comment = forms.CharField(widget=forms.Textarea(), required=False, initial='comment')
