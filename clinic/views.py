import json
from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.db import IntegrityError
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, People, ContactDiary, Company, Service, Quotation, Contract, ContractPrice
from .helpers import strong_password, user_right


# Create your views here.
@login_required
def index(request):
    yay_message = request.session.get('yay_message', '')
    nay_message = request.session.get('nay_message', '')

    request.session['yay_message'] = ''
    request.session['nay_message'] = ''

    # Get all the service
    services = Service.objects.all()

    return render(request, "clinic/index.html", {
        "yay_message": yay_message,
        "nay_message": nay_message,
        "services": services
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
            user = User.objects.create_user(username=username, email=email, password=password, management_right_level=0)
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


# Allow client side to check the user right
@login_required
@csrf_exempt
def check_right(request):
    if request.method != 'POST':
        return JsonResponse({'error':'POST method required'}, status=400)
    data = json.loads(request.body)
    if data.get('right') is not None:
        right = data['right']
        check_result = (right in user_right(request.user.management_right_level))
        return JsonResponse({'check_result': check_result}, safe=False)

    else:
        return JsonResponse({'message': 'no info'})

# Allow top level admin to manage to list of users, and to apply management level for other users
@login_required
@csrf_exempt
def authorize(request):
    # if admin submitted form
    if request.method == 'POST':
        # User must have the right to submit form
        if 'modify_user_right' not in user_right(request.user.management_right_level):
            return JsonResponse({'error': "You do not have rights to change user's level"}, status=400)

        data = json.loads(request.body)

        if data.get('new_level') is not None and data.get('chosen_user_id') is not None:
            # Get the user
            user = User.objects.get(pk=data['chosen_user_id'])
            user.management_right_level = data['new_level']
            user.save()            
            
            return JsonResponse({'message': 'Level changed'})
        else:
            return JsonResponse({'message': 'Nothing changed'})
    
    # if admin clicking link
    else:
        # if user does not have right to access this page
        if 'read_user_right' not in user_right(request.user.management_right_level):            
            request.session['nay_message'] = "You don't have the right to visit this page"
            return HttpResponseRedirect(reverse('index'))
        modify_right = 'modify_user_right' in user_right(request.user.management_right_level)
        data_users = User.objects.all()
        return render(request, "clinic/authorize.html", {
            "data_users": data_users,
            "levels": [1, 2, 3],
            "modify_right": modify_right
        })
    

# Allow user to add service
# Check if user have right to add service or not
@login_required
def add_service(request):
    # If user submitted form
    if request.method == 'POST':
        # If user do not have right, raise error
        if 'modify_service_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = 'You do not have right to do this'
            return HttpResponseRedirect(reverse('index'))

        # Define variables
        name = request.POST['name']
        male_price = request.POST.get('male_price')
        female_price = request.POST.get('female_price')
        benefit = request.POST.get('benefit', '')
        description = request.POST.get('description', '')

        if not name or (not male_price and not female_price):
            return render(request, "clinic/add_service.html", {
                "nay_message": "Please fill at least name, price of the service for male or female"
            })

        if not male_price:
            male_price = None
        if not female_price:
            female_price = None
        
        old_services = Service.objects.filter(Q(name__icontains=name))            
        if old_services.count() > 0:
            return render(request, "clinic/add_service.html", {
                "nay_message": f"{name} already in database"
            })

        else:
            # if user input correct, add to the services
            service = Service(
                name = name,
                male_price = male_price,
                female_price = female_price,
                benefit = benefit,
                description = description,
                created_by = request.user
            )
            service.save()
            request.session['yay_message'] = 'Service added'
            return HttpResponseRedirect(reverse('index'))

    # If user clicked link
    else:
        # Only user with the modify service right can visit this page
        if 'modify_service_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = 'You do not have right to access this part'
            return HttpResponseRedirect(reverse('index'))
        
        return render(request, "clinic/add_service.html")


# Allow user to check the service's detail
@login_required
@csrf_exempt
def service_detail(request, service_id):
    # If user is admin and submited the form
    if request.method == 'POST':
        # If user does not have the right to edit, response error by json, then use JS to redirect user to index page
        if 'modify_service_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = 'You do not have the right to modify this information'
            return JsonResponse({'error':'You do not have the right to edit'}, status=403)
        data = json.loads(request.body)

        if data.get('new-name') is not None:
            try:
                service = Service.objects.get(pk=service_id)
                service.name = data['new-name']
                service.male_price = data['new-male-price']
                service.female_price = data['new-female-price']
                service.benefit = data['new-benefit']
                service.description = data['new-description']
                service.modified_by = request.user
                service.save()
                return JsonResponse({'message': 'Changes saved'}, status=200)
            except Service.DoesNotExist:
                return JsonResponse({'error': 'Service does not exist in database'}, status=400)

    else:
        if 'read_all_service_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = "You do not have the right to check service's detail"
            return HttpResponseRedirect(reverse('index'))
        try:
            service = Service.objects.get(pk=service_id)
            return render(request, "clinic/service_detail.html", {
                "service": service
            })
        except Service.DoesNotExist:
            request.session['nay_message'] = 'Service does not exist'
            return HttpResponseRedirect(reverse('index'))


# Allow user to add people
@login_required
def add_people(request):
    # If user submitted form
    if request.method == 'POST':
        # Check if user have the right, it no, redirect to index, if yes then continue
        if 'add_people_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = "You do not have the right to add person's information"
            return HttpResponseRedirect(reverse('index'))

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
            note = note,
            created_by = request.user
        )
        people.save()
        request.session['yay_message'] = 'People saved'
        return HttpResponseRedirect(reverse('people'))        

    # If user clicked link:
    else:
        if 'add_people_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = 'You do not have the right to add person information'
            return HttpResponseRedirect(reverse('index'))
        return render(request, "clinic/add_people.html")


# Allow user to check people added by current user
@login_required
def my_people(request):
    if "read_self_add_people_info" not in user_right(request.user.management_right_level):
        request.session['nay_message'] = "You're not allow to check this info"
        return HttpResponseRedirect(reverse('index'))
    
    people = People.objects.filter(created_by=request.user)

    return render(request, "clinic/my_people.html", {
        "people": people
    })


# Allow user to check all people relevant to the hospital, only level 2 or higher admin can check this
@login_required
def people(request):
    if "read_all_people_info" not in user_right(request.user.management_right_level):
        request.session['nay_message'] = 'You are not allowed to enter this part'
        return HttpResponseRedirect(reverse('index'))

    nay_message = request.session.get('nay_message', '')
    yay_message = request.session.get('yay_message', '')

    request.session['nay_message'] = ''    
    request.session['yay_message'] = ''

    people = People.objects.all()
    return render(request, "clinic/people.html", {
        "people": people,
        "nay_message": nay_message,
        "yay_message": yay_message
    })


# Allow admin to check people's information and modify it
@login_required
@csrf_exempt
def person_detail(request, person_id):
    # If user submited the form
    if request.method == 'POST':
        # Check if user have the right to modify person's info
        if "modify_people_info" not in user_right(request.user.management_right_level):
            request.session['nay_message'] = "You do not have the right to modify this information"
            return JsonResponse({'error': 'You do not have the right to modify this info'}, status=403)
        
        # Get variables
        data = json.loads(request.body)

        # If user do not leave empty name for person, update new information
        if data.get('new_name') is not None:
            try:
                person = People.objects.get(pk=person_id)
                person.name = data['new_name']
                person.position = data['new_position']
                person.email = data['new_email']
                person.phone = data['new_phone']
                person.note = data['new_note']
                
                person.save()

                return JsonResponse({'message': 'New info saved'}, status=200)

            except People.DoesNotExist:
                request.session['nay_message'] = 'That person does not exist in database'
                return JsonResponse({'error': 'Person does not exist'}, status=400)

        # If user leave empty name, return error
        else:
            request.session['nay_message'] = "Don't leave empty name"
            return JsonResponse({'error': "Don't leave empty name"}, status=401)

    # If admin clicked link or visit the correct url
    else:
        # Check if current user has the right to visit page, if not redirect user to index page
        if "read_all_people_info" not in user_right(request.user.management_right_level):
            request.session['nay_message'] = 'You do not have the right to visit this page'
            return HttpResponseRedirect(reverse('index'))
        
        # If user is valid for the right, continue
        try:
            person = People.objects.get(pk=person_id)
            return render(request, "clinic/person_detail.html", {
                "person": person
            })
        except People.DoesNotExist:
            request.session['nay_message'] = 'That person does not exist'
            return HttpResponseRedirect(reverse('people'))
        

# Add company
@login_required
def add_company(request):
    # If user submit form
    if request.method == 'POST':
        # Check if user have right
        if "add_company_info" not in user_right(request.user.management_right_level):
            request.session['nay_message'] = "You don't have the right to add company"
            return HttpResponseRedirect(reverse('index'))

        # If user have right, continue to check user input
        name = request.POST['name']
        industry = request.POST['industry']
        address = request.POST['address']
        male_headcount = request.POST['male_headcount']
        female_headcount = request.POST['female_headcount']

        if not name or not industry or not address or not male_headcount or not female_headcount:
            return render(request, "clinic/add_company.html", {
                "nay_message": "All fields required"
            })
        
        if int(male_headcount) < 0 or int(female_headcount) < 0:
            nay_message = "Please enter positive number"
            return render(request, "clinic/add_company.html", {
                "nay_message": nay_message
            })
        
        # Save the company
        try:
            company = Company.objects.get(name=name)
            return render(request, "clinic/add_company.html", {
                "nay_message": "Company name already exist"
            })
        except Company.DoesNotExist:
            new_company = Company(
                name = name,
                industry = industry,
                address = address,
                male_headcount = male_headcount,
                female_headcount = female_headcount
            )
            new_company.save()
            request.session['yay_message'] = "Company added"
            return HttpResponseRedirect(reverse('index'))
    
    # If user clicking link or being redirected
    else:
        return render(request, "clinic/add_company.html")


# Add message


# Add contract


# Add quote price


# Retrieve contract information