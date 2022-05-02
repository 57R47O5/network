from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .forms import *

from .models import *


def index(request):
    # Recibimos los posteos. Deberiamos guardar los diez ultimos
    posteos = Post.objects.all().order_by('-Timestamp')[:10]
    contexto = {'posteos':posteos}
    if request.method == "POST":
        post = CrearPostForm(request.POST, request.FILES) 
        if post.is_valid():
            datos_posteo = post.cleaned_data
            post.save()
            contexto.update({'post':post})
            return render(request, "network/prueba.html", contexto)
            #return render(request, "network/index.html", contexto)
        else:
            return render(request, "network/error.html")
    else:
        post = CrearPostForm(initial={'Texto':'Que estas pensando?', 'User': request.user.pk})
        contexto.update({'post':post})
        return render(request, "network/index.html", contexto)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
