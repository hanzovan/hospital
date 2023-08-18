from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass


class People(models.Model):
    name = models.CharField(max_length=255)
    position = models.TextField(blank=True)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} working in {self.position}"


class ContactDiary(models.Model):
    name = models.ForeignKey(People, on_delete=models.CASCADE, related_name='talks')
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} have conversation with me: {self.content} at {self.date}"


class Client(models.Model):
    name = models.CharField(max_length=255)
    manager = models.ForeignKey(People, on_delete=models.CASCADE, related_name='companies')
    contact_person = models.ForeignKey(People, on_delete=models.CASCADE, related_name='company')
    address = models.TextField()
    male_headcount = models.IntegerField()
    female_headcount = models.IntegerField()

    def __str__(self):
        return f"{self.name} company"


class Service(models.Model):
    name = models.CharField(max_length=255)
    benefit = models.TextField(blank=True)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.name} in order to {self.benefit} with the price of {self.price}"


class Quotation(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='quote_price')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='quote_price')
    quote_price = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service} was quoted price of {self.quote_price} at {self.date}"

    
class Contract(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contracts')
    services = models.ManyToManyField(Service, related_name='contracts')
    date = models.DateTimeField(auto_now_add=True)
    male_headcount = models.IntegerField()
    female_headcount = models.IntegerField()

    def __str__(self):
        return f"{self.client} signed a contract in {self.date}"


class ContractPrice(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name='services_price')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='contract_price')
    price = models.IntegerField()

    def __str__(self):
        return f"{self.contract} use {self.service} with the price {self.price}"