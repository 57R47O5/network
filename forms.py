from . models import *
from django import forms
from django.forms import HiddenInput, ModelForm

# Formulario para crear post

class CrearPostForm(ModelForm):
    class Meta:
        model = Post
        fields = {'User', 'Texto', 'Imagen'}
        widgets = {
            'User': HiddenInput,
            'Texto': forms.Textarea
        }