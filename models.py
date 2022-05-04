from sqlite3 import Timestamp
from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass    


#class Seguidores(models.Model):
    #User = models.ForeignKey(User, on_delete=CASCADE, blank=False)
    #Seguidores = models.ManyToManyField(User, on_delete=models.SET_NULL, blank=True)

#class Seguidos(models.Model):
    #User = models.ForeignKey(User, on_delete=CASCADE, blank=False)
    #Seguidos = models.ManyToManyField(User, on_delete=models.SET_NULL, blank=True)

class Post(models.Model):
    User = models.ForeignKey(User, on_delete= models.CASCADE, blank=False) 
    Texto = models.TextField(max_length=1024)
    Imagen = models.ImageField(upload_to='images/', blank=True)
    Likes = models.IntegerField(auto_created=True, default=0)
    Timestamp = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return{
            "id": self.id,
            "User": self.User.username,
            "User_id": self.User.pk,
            "Texto": self.Texto,
            "Likes": self.Likes,
            #"Imagen": self.Imagen,
            "Timestamp": self.Timestamp.strftime("%b %d %Y, %I:%M %p"),
        }

         

    def __str__(self) -> str:
        return f"{self.User}  {self.Timestamp} \n {self.Texto}" 

    