from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('add_service', views.add_service, name='add_service'),
    path('add_people', views.add_people, name='add_people'),
    path('authorize', views.authorize, name='authorize'),
    path('service_detail/<int:service_id>', views.service_detail, name='service_detail'),
    path('people', views.people, name='people'),
    path('person/<int:person_id>', views.person_detail, name='person_detail'),
    path('check_right', views.check_right, name='check_right'),
    path('my_people', views.my_people, name="my_people"),
    path('add_company', views.add_company, name="add_company"),
    path('companies', views.companies, name="companies"),
    path('message/<int:person_id>', views.message, name="message")
]