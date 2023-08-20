from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.db import IntegrityError
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse

from .models import User, People, ContactDiary, Company, Service, Quotation, Contract, ContractPrice
from .helpers import strong_password

# Create your views here.
@login_required
def index(request):
    yay_message = request.session.get('yay_message', '')
    nay_message = request.session.get('nay_message', '')

    request.session['yay_message'] = ''
    request.session['nay_message'] = ''

    return render(request, "clinic/index.html", {
        "yay_message": yay_message,
        "nay_message": nay_message
    })


# Allow user to create their own account
def register(request):
    # If user submitted form
    if request.method == 'POST':
        # Define variables
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm = request.POST['confirm']

        # Handle user input
        if not username or not email or not password or not confirm:
            return render(request, 'clinic/register.html', {
                'nay_message': 'Please fill all fields'
            })

        if password != confirm:
            return render(request, "clinic/register.html", {
                "nay_message": "Passwords do not match"
            })
        
        if not strong_password(password):
            return render(request, "clinic/register.html", {
                "nay_message": 'Password is not strong enough'
            })

        # If user input is okay, try to create a new account
        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            login(request, user)
            request.session['yay_message'] = 'Registered successfully'
            return HttpResponseRedirect(reverse('index'))

        except IntegrityError:
            return render(request, "clinic/register.html", {
                "nay_message": "Username already taken"
            })

    # If user clicking link
    else:
        # Render the register page with register form
        return render(request, "clinic/register.html")


# Allow user to logged in with their account
def login_view(request):
    # User submitting form
    if request.method == 'POST':
        # Handle user input
        username = request.POST['username']
        password = request.POST['password']

        if not username or not password:
            return render(request, "clinic/login.html", {
                "nay_message": "Please fill all fields"
            })
        
        # authenticate user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            request.session['yay_message'] = 'Logged in successfully'
            return HttpResponseRedirect(reverse('index'))

        else:            
            return render(request, "clinic/login.html", {
                "nay_message":"Invalid credentials"
            })

    # If user clicking link or being redirected
    else:
        yay_message = request.session.get('yay_message', '')
        nay_message = request.session.get('nay_message', '')

        request.session['yay_message'] = ''
        request.session['nay_message'] = ''
        return render(request, "clinic/login.html", {
            "yay_message": yay_message,
            "nay_message": nay_message
        })


# Allow user to log out
@login_required
def logout_view(request):
    logout(request)
    request.session['yay_message'] = 'Logged out'
    return HttpResponseRedirect(reverse('index'))


# Allow user to add service
@login_required
def add_service(request):
    # If user submitted form
    if request.method == 'POST':
        # Define variables
        name = request.POST['name'].lower()
        male_price = request.POST['male_price']
        female_price = request.POST['female_price']
        benefit = request.POST.get('benefit', '')

        if not name or not male_price or not female_price:
            return render(request, "clinic/add_service.html", {
                "nay_message": "Please fill at least name, price of the service"
            })

        try:
            old_service = Service.objects.get(name=name)            
            return render(request, "clinic/add_service.html", {
                "nay_message": f"{old_service.name}already in database"
            })

        except Service.DoesNotExist:
            # if user input correct, add to the services
            service = Service(
                name = name,
                male_price = male_price,
                female_price = female_price,
                benefit = benefit
            )
            service.save()
            request.session['yay_message'] = 'Service added'
            return HttpResponseRedirect(reverse('index'))

    # If user clicked link
    else:
        return render(request, "clinic/add_service.html")


# Allow user to add people
@login_required
def add_people(request):
    # If user submitted form
    if request.method == 'POST':
        # Handle user input
        name = request.POST['name']
        position = request.POST.get('position', '')
        email = request.POST.get('email', '')
        phone = request.POST.get('phone', '')
        note = request.POST.get('note', '')

        if not name:
            return render(request, "clinic/add_people.html", {
                "nay_message": "Name required"
            })

        # If user input is okay, trying to create new people in database        
        people = People(
            name = name,
            position = position,
            email = email,
            phone = phone,
            note = note
        )
        people.save()
        request.session['yay_message'] = 'People saved'
        return HttpResponseRedirect(reverse('index'))        

    # If user clicked link:
    else:
        return render(request, "clinic/add_people.html")