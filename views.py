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
        return render(request, "network/index.html")   

# Recibe un request y el numero de pagina y envia los elementos que corresponden en formato JSon

@csrf_exempt
@login_required
def posts(request, pagina):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)    
    else:           
        datos = json.loads(request.body) # datos es un objeto Python        
        Todo = datos.get("Todo", "")
        User = datos.get("User", 0)
        Seguidos = datos.get("Seguidos", "")        
        if(Todo):         
            posteos = Post.objects.all().order_by('-Timestamp')     #Guardamos todos los posts
            p = Paginator(posteos, 10)                             #Vamos a ver 10 posts por pagina
            pagina_posteos = p.get_page(pagina)
            return JsonResponse([post.serialize() for post in pagina_posteos], safe=False)                           
        elif(User != 0):
            posteos = Post.objects.filter(User__pk=User).order_by('-Timestamp')     #Guardamos todos los posts
            p = Paginator(posteos, 10)                             #Vamos a ver 10 posts por pagina
            pagina_posteos = p.get_page(pagina)
            return JsonResponse([post.serialize() for post in pagina_posteos], safe=False)                           
        else:
            JsonResponse({"error": "Tenemos algun tipo de error."}, status=400)
    

@csrf_exempt
@login_required
def postear(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)    
    else:           
        datos = json.loads(request.body) # datos es un objeto Python        
        print(datos.values())
        Usuario = datos.get("usuario","")
        user = User.objects.get(pk=Usuario)
        Texto = datos.get("texto", "")
        Imagen = datos.get("imagen","")        
        post = Post.objects.create(User = user, Texto = Texto, Imagen = Imagen, Likes=0)
        post.save() 
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

def perfil(request, usuario):
    nombre = User.objects.get(pk=usuario).username  
    userlogeado = request.user  
    Lesigo = Siguiendo.objects.filter(Seguido=usuario, Seguidor=userlogeado).count()    
    Mesigue = Siguiendo.objects.filter(Seguido=userlogeado, Seguidor=usuario).count()
    print(Lesigo) #Si es 1, lo estamos siguiendo, si es 0, no lo seguimos
    #Jsonresrponse puede dar como argumento una lista
    datos = {'nombre':nombre, 'Lesigo':Lesigo, 'Mesigue': Mesigue}
    if request.method == "GET":        
        return JsonResponse(datos, safe=False)                           
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@csrf_exempt
@login_required
def seguir(request):
    if request.method == "POST":
        datos = json.loads(request.body)
        seguidor = datos.get("Seguidor","")
        seguido = datos.get("Seguido", "")
        Seguidor = User.objects.get(pk=seguidor)
        Seguido = User.objects.get(pk=seguido)
        siguiendo = Siguiendo.objects.create(Seguidor=Seguidor, Seguido=Seguido)
        siguiendo.save()
        return JsonResponse({"message":"Follow correcto"}, status=201)
    else:
        return JsonResponse({"message":"Debe ser un POST"}, status=400)

@csrf_exempt
@login_required
def dejar_de_seguir(request):
    if request.method == "POST":
        datos = json.loads(request.body)
        seguidor = datos.get("Seguidor","")
        seguido = datos.get("Seguido", "")
        Seguidor = User.objects.get(pk=seguidor)
        Seguido = User.objects.get(pk=seguido)
        siguiendo = Siguiendo.objects.get(Seguidor=Seguidor, Seguido=Seguido)
        siguiendo.delete()
        return JsonResponse({"message":"Unfollow correcto"}, status=201)
    else:
        return JsonResponse({"message":"Debe ser un POST"}, status=400)        