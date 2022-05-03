import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.generic.list  import ListView
from django.core import serializers


from .forms import *

from .models import *

class PostListView(ListView):
    model = Post
    paginate_by = 10

def index(request):
    # Recibimos los posteos. Deberiamos guardar los diez ultimos
    #posteos = Post.objects.all().order_by('-Timestamp')[:10]
    #contexto = {'posteos':posteos}
    #if request.method == "POST":
    #    post = CrearPostForm(request.POST, request.FILES) 
    #    if post.is_valid():
    #        datos_posteo = post.cleaned_data
    #        post.save()
    #        contexto.update({'post':post})
    #        return render(request, "network/prueba.html", contexto)
            #return render(request, "network/index.html", contexto)
    #    else:
    #        return render(request, "network/error.html")
    #else:
    #    post = CrearPostForm(initial={'Texto':'Que estas pensando?', 'User': request.user.pk})
    #    contexto.update({'post':post})
    #    return render(request, "network/index.html", contexto)
        return render(request, "network/index.html")   

# Recibe un request y el numero de pagina y envia los elementos que corresponden en formato JSon

def posts(request, pagina):
    posteos = Post.objects.all().order_by('-Timestamp')     #Guardamos todos los posts
    #p = Paginator(posteos, 10)                              #Vamos a ver 10 posts por pagina
    if request.method == "GET":
        #pagina_posteos = p.get_page(pagina)
        #return JsonResponse(pagina_posteos.serialize())            
        return JsonResponse([post.serialize() for post in posteos], safe=False)        
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@csrf_exempt
@login_required
def postear(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)    
    else:           
        datos = json.loads(request.body) # datos es un objeto Python
        return JsonResponse({"message": "Datos correctos."}, status=201)  
         



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
