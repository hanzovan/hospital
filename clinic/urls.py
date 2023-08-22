from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('add_service', views.add_service, name='add_service'),
    path('add_people', views.add_people, name='add_people'),
    path('authorize', views.authorize, name='authorize')
]