from sqlite3 import Timestamp
from tkinter import CASCADE
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    User = models.ForeignKey(User, on_delete= models.CASCADE, blank=False) 
    Texto = models.TextField(max_length=1024)
    Imagen = models.ImageField(upload_to='images/', blank=True)
    Timestamp = models.DateTimeField(auto_now_add=True)
    
    def serialize(self):
        return{
            "id": self.id,
            "User": self.User.pk,
            "Texto": self.Texto,
            #"Imagen": self.Imagen,
            "Timestamp": self.Timestamp.strftime("%b %d %Y, %I:%M %p"),
        }

         

    def __str__(self) -> str:
        return f"{self.User}  {self.Timestamp} \n {self.Texto}" 

    