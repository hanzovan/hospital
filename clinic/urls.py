from django.urls import path

# Import these to store and serve media file
from django.conf import settings
from django.conf.urls.static import static

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
    path('message/<int:person_id>', views.message, name="message"),
    path('add_message_from_all_people_page/<int:person_id>', views.add_message_from_all_people_page, name="add_message_from_all_people_page"),
    path('add_contract', views.add_contract, name="add_contract"),
    path('all_contracts', views.all_contracts, name="all_contracts"),
    path('contract/<int:contract_id>', views.contract_detail, name="contract_detail"),
    path('archive_contract', views.archive_contract, name='archive_contract'),
    path('archived_contracts', views.all_archived_contracts, name="all_archived_contracts"),
    path('generate_contract_docx/<int:contract_id>/', views.generate_contract_docx, name='generate_contract_docx'),
    path('add_meeting', views.add_meeting, name="add_meeting"),
    path('all_meetings', views.all_meetings, name="all_meetings"),
    path('upcoming_meetings', views.upcoming_meetings, name="upcoming_meetings"),
    path('meeting_agenda/<int:meeting_id>', views.meeting_agenda, name="meeting_agenda"),
    path('add_meeting_agenda/<int:meeting_id>', views.add_meeting_agenda, name="add_meeting_agenda"),
    path('end_meeting', views.end_meeting, name="end_meeting")
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
