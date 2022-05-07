# Generated by Django 4.0.3 on 2022-05-07 20:37

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_siguiendo'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='Seguido',
            field=models.ManyToManyField(blank=True, related_name='UsuarioSeguidor', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='user',
            name='Seguidor',
            field=models.ManyToManyField(blank=True, related_name='UsuarioSeguido', to=settings.AUTH_USER_MODEL),
        ),
        migrations.RemoveField(
            model_name='post',
            name='Likes',
        ),
        migrations.AddField(
            model_name='post',
            name='Likes',
            field=models.ManyToManyField(blank=True, related_name='PostLeGustan', to=settings.AUTH_USER_MODEL),
        ),
    ]
