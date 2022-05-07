from sqlite3 import Timestamp
from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass    
    Seguido = models.ManyToManyField('self', blank=True, related_name="UsuarioSeguidor")
    Seguidor = models.ManyToManyField('self', blank=True, related_name="UsuarioSeguido")

class Siguiendo(models.Model):
    Seguido = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="UsuarioSeguidor")
    Seguidor = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="UsuarioSeguido")


class Post(models.Model):
    User = models.ForeignKey(User, on_delete= models.CASCADE, blank=False) 
    Texto = models.TextField(max_length=1024)
    Imagen = models.ImageField(upload_to='images/', blank=True)
    Likes = models.ManyToManyField("User", blank=True, related_name="PostLeGustan")
    Timestamp = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return{
            "id": self.id,
            "User": self.User.username,
            "User_id": self.User.pk,
            "Texto": self.Texto,
            "Likes": self.Likes.count(),
            #"Imagen": self.Imagen,
            "Timestamp": self.Timestamp.strftime("%b %d %Y, %I:%M %p"),
        }

         

    def __str__(self) -> str:
        return f"{self.User}  {self.Timestamp} \n {self.Texto}" 

    