from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    class Level(models.IntegerChoices):

        # Level 1: add people, check people they added, check all services
        LOW = 1

        # Level 2: add, modified all people, check all people, services
        MIDDLE = 2

        # Level 3: add, modified all people, services, check all people, authorize admins
        TOP = 3
    management_right_level = models.IntegerField(choices=Level.choices, blank=True, null=True)


class Company(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)
    address = models.TextField()
    male_headcount = models.IntegerField()
    female_headcount = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="add_companies")
    modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="modified_companies")

    def __str__(self):
        return f"{self.name} company"


class People(models.Model):
    name = models.CharField(max_length=255)
    company = models.ManyToManyField(Company,related_name="contact")
    position = models.TextField(blank=True)
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


class Quotation(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='quote_price')
    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='quote_price')
    male_quote_price = models.IntegerField(blank=True, null=True)
    female_quote_price = models.IntegerField(blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service} was quoted price of {self.male_quote_price} for male and {self.female_quote_price} for female at {self.date}"

    
class Contract(models.Model):
    client = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contracts')
    services = models.ManyToManyField(Service, related_name='contracts')
    male_headcount = models.IntegerField()
    female_headcount = models.IntegerField()
    initiation_date = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='contracts_added')
    pdf_file = models.FileField(upload_to='uploaded_files/', blank=True, null=True)
    archived = models.BooleanField(default=False)
    archived_date = models.DateTimeField(blank=True, null=True)
    archived_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="archived_contracts")

    def __str__(self):
        return f"{self.client} signed a contract in {self.created}"


class ContractPrice(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='services_price')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='contract_price')
    male_price = models.IntegerField(blank=True, null=True)
    female_price = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.contract} use {self.service} with the price {self.male_price} for male and {self.female_price} for female"