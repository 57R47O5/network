from xml.dom.minidom import Document
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # Rutas API

    path("postear", views.postear, name="postear"),
    path("posts/<int:pagina>", views.posts, name="posts"),
    path("perfil/<int:usuario>",  views.perfil, name="perfil"),
    path("seguir", views.seguir, name="seguir"),
    path("dejar_de_seguir", views.dejar_de_seguir, name="dejar_de_seguir"),
    path("like", views.like, name="like"),
    path("unlike", views.unlike, name="unlike"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
