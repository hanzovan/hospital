from django.db import models
from django.contrib.auth.models import AbstractUser
from decimal import Decimal


# Create your models here.
class User(AbstractUser):
    class Level(models.IntegerChoices):

        GUEST = 0
        
        LOW = 1

        MIDDLE = 2

        TOP = 3
    management_right_level = models.IntegerField(choices=Level.choices, blank=True, null=True)


class Company(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)
    address = models.TextField()
    email = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    representative = models.ForeignKey('People', on_delete=models.SET_NULL, blank=True, null=True, related_name="companies")
    male_headcount = models.IntegerField()
    female_headcount = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="add_companies")
    modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="modified_companies")

    def __str__(self):
        return f"{self.name} company"


class People(models.Model):
    name = models.CharField(max_length=255)

    # I decided to eliminate this field so that person have only one way relationship with company through representative
    # company = models.ManyToManyField(Company,related_name="contact")

    position = models.TextField(blank=True)
    address = models.TextField(blank=True, null=True)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    note = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='add_people')
    modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='modified_person')

    def __str__(self):
        return f"{self.name} working in {self.position}"


class ContactDiary(models.Model):
    name = models.ForeignKey(People, on_delete=models.CASCADE, related_name='talks')
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} have conversation with me: {self.content} at {self.date}"


class Service(models.Model):
    name = models.CharField(max_length=255)
    benefit = models.TextField(blank=True)
    male_price = models.IntegerField(blank=True, null=True)
    female_price = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='add_services')
    modified_by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL, related_name='modified_services')

    def __str__(self):
        return f"{self.name} in order to {self.benefit} with the price of {self.male_price} for male and {self.female_price} for female"


# Create class that store meeting information
class MeetUp(models.Model):
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='meetings')
    created = models.DateTimeField(auto_now_add=True)
    end_or_not = models.BooleanField(default=False)

# Create a class that store meeting item's result
class MeetingAgendaItem(models.Model):
    meetup = models.ForeignKey(MeetUp, on_delete=models.CASCADE, related_name='agenda')
    item = models.TextField()
    result = models.TextField()

    
class Contract(models.Model):
    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contracts')
    services = models.ManyToManyField(Service, related_name='contracts')
    male_headcount = models.IntegerField()
    female_headcount = models.IntegerField()
    total_value = models.IntegerField(blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    revenue = models.IntegerField(blank=True, null=True)
    initiation_date = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='contracts_added')
    modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='contracts_modified')
    pdf_file = models.FileField(upload_to='uploaded_files/', blank=True, null=True)
    archived = models.BooleanField(default=False)
    archived_date = models.DateTimeField(blank=True, null=True)
    archived_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="archived_contracts")

    def __str__(self):
        return f"{self.client} signed a contract in {self.created}"