from django.contrib import admin
from .models import User, People, ContactDiary, Service, Company, Contract, MeetUp, MeetingAgendaItem

# Register your models here.
admin.site.register(User)
admin.site.register(People)
admin.site.register(ContactDiary)
admin.site.register(Service)
admin.site.register(Company)
admin.site.register(Contract)
admin.site.register(MeetUp)
admin.site.register(MeetingAgendaItem)