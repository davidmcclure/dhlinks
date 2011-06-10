from django import forms
from links.models import *

class SubmitForm(forms.Form):

    url = forms.URLField(required=False, label='URL')
    title = forms.CharField(required=True)
    comment = forms.CharField(widget=forms.Textarea(), required=False)

    def clean(self):

        cleaned_data = self.cleaned_data
        url = cleaned_data.get('url')
        title = cleaned_data.get('title')
        comment = cleaned_data.get('comment')

        if url == '' and comment == '':
            raise forms.ValidationError('Enter a comment.')

        if url and title and comment:
            if url == '' and comment == '':
                raise forms.ValidationError('Enter a comment.')

        return cleaned_data


class LoginForm(forms.Form):

    username = forms.CharField(required=True)
    password = forms.CharField(required=True, widget=forms.PasswordInput)


class RegisterForm(forms.Form):

    username = forms.CharField(required=True)
    password = forms.CharField(required=True, widget=forms.PasswordInput)
    password_confirm = forms.CharField(required=True, widget=forms.PasswordInput, label='Password (confirm)')
    email = forms.EmailField(required=True)
    firstname = forms.CharField(required=True, label='First Name')
    lastname = forms.CharField(required=True, label='Last Name')
    location = forms.CharField(required=False)
    website = forms.URLField(required=False)
    bio = forms.CharField(widget=forms.Textarea(), required=False)

    def clean(self):

        cleaned_data = self.cleaned_data
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password != password_confirm:
            raise forms.ValidationError('Passwords do not match.')

        if User.objects.filter(username=cleaned_data.get('username')).exists():
            raise forms.ValidationError('Username taken.')

        return cleaned_data
