import json
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.db import IntegrityError
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta, date
from django.utils import timezone

# for word document editing
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

from .models import User, People, ContactDiary, Company, Service, Contract, ContractPrice
from .helpers import strong_password, user_right, days_between


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

                if not data.get('new-male-price'):
                    service.male_price = None
                else:
                    service.male_price = data['new-male-price']

                if not data.get('new-female-price'):
                    service.female_price = None
                else:
                    service.female_price = data['new-female-price']
                
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
        company_id = request.POST.get('company', '')
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

        if company_id:
            try:
                company = Company.objects.get(pk=company_id)
                people.company.add(company)
            except Company.DoesNotExist:
                request.session['nay_message'] = "Company does not exist"

        request.session['yay_message'] = 'People saved'
        return HttpResponseRedirect(reverse('people'))        

    # If user clicked link:
    else:
        if 'add_people_info' not in user_right(request.user.management_right_level):
            request.session['nay_message'] = 'You do not have the right to add person information'
            return HttpResponseRedirect(reverse('index'))

        # Get the companies
        companies = Company.objects.all()
        return render(request, "clinic/add_people.html",{
            "companies": companies
        })


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

    # Create a list of dictionary of people with their latest message
    people_with_latest_message = []

    for person in people:
        latest_message = person.talks.order_by("-date").first()
        people_with_latest_message.append({
            'person': person,
            'latest_message': latest_message
        })

    return render(request, "clinic/people.html", {
        "people": people,
        "people_with_latest_message": people_with_latest_message,
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

            # Get the company
            companies = person.company.all()

            # Get the message from this person
            messages = person.talks.all().order_by("-date")

            # Get messages from session
            yay_message = request.session.get('yay_message', '')
            nay_message = request.session.get('nay_message', '')
            request.session['yay_message'] = ''
            request.session['nay_message'] = ''

            return render(request, "clinic/person_detail.html", {
                "person": person,
                "messages": messages,
                "companies": companies,
                'yay_message': yay_message,
                'nay_message': nay_message
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
        if "add_company_info" not in user_right(request.user.management_right_level):
            request.session['nay_message'] = "You do not have the right to visit this part"
            return HttpResponseRedirect(reverse('index'))
        return render(request, "clinic/add_company.html")


# Allow user to add company's information
@login_required
def companies(request):
    # Only user with the right to check company info can go to this route
    if "read_company_info" not in user_right(request.user.management_right_level):
        request.session['nay_message'] = "You do not have the right to access this page"
        return HttpResponseRedirect(reverse('index'))
    # If user right satisfied condition, show all companies
    companies = Company.objects.all()

    return render(request, "clinic/companies.html", {
        "companies": companies
    })



# Allow add message from person_detail page
def message(request, person_id):
    if request.method == 'POST':
        content = request.POST['content']
        person = People.objects.get(pk=person_id)
        
        message = ContactDiary(
            name = person,
            content = content
        )
        message.save()
        request.session['yay_message'] = "Message saved"
        return redirect('person_detail', person_id=person.id)

    else:
        request.session['nay_message'] = "POST request required"
        return HttpResponseRedirect(reverse('index'))

# Add message from all people page, with symbol for better visual
def add_message_from_all_people_page(request, person_id):
    # If user submitted form
    if request.method == 'POST':
        person = People.objects.get(pk=person_id)
        content = request.POST.get('content', '')
        
        # save the new message
        new_message = ContactDiary(
            name = person,
            content = content
        )
        new_message.save()
        request.session['yay_message'] = "Message saved"
        return HttpResponseRedirect(reverse('people'))
    
    # If user clicked link
    else:
        person = People.objects.get(pk=person_id)
        return render(request, "clinic/add_message_from_all_people_page.html", {
            "person": person
        })


# Add contract
@login_required
def add_contract(request):
    # If user submitting form
    if request.method == 'POST':
        # Get the client id
        client_id = request.POST.get('client_id', '')

        if not client_id:
            request.session['nay_message'] = "Choose a company"
            return HttpResponseRedirect(reverse('add_contract'))

        # Try to get the company, if there ain't that company, raise error
        try:
            client = Company.objects.get(pk=client_id)
        except Company.DoesNotExist:
            request.session['nay_message'] = "Company does not exist"
            companies = Company.objects.all()
            services = Service.objects.all()
            return render(request, "clinic/add_contract.html", {
                "services": services,
                "companies": companies
            })
        
        # Get service id
        service_ids = request.POST.getlist('chosen_services')

        # Try to get the service, if there ain't that service, ignore that
        services = []
        for i in service_ids:
            try:
                service = Service.objects.get(pk=i)            
                services.append(service)
            except Service.DoesNotExist:
                request.session['nay_message'] = f"service with id {i} does not exist"

        # Get headcount, but checked if they're positive integer        
        male_headcount = request.POST.get('male_headcount', '')
        female_headcount = request.POST.get('female_headcount', '')

        try:
            male_number = int(male_headcount)
            female_number = int(female_headcount)
            if male_number < 0 or female_number < 0:
                request.session['nay_message'] = "headcount has to be positive integer, not negative"
                companies = Company.objects.all()
                services = Service.objects.all()
                return render(request, "clinic/add_contract.html", {
                    "services": services,
                    "companies": companies
                })
        except ValueError:
            request.session['nay_message'] = 'headcount has to be positive integer, not a float'
            companies = Company.objects.all()
            services = Service.objects.all()
            return render(request, "clinic/add_contract.html", {
                "services": services,
                "companies": companies
            })
        
        # Get the total value
        total_value = 0
        for service in services:
            if service.male_price:
                service_value_for_male = int(service.male_price)*male_number
            else:
                service_value_for_male = 0
            
            if service.female_price:
                service_value_for_female = int(service.female_price)*female_number
            else:
                service_value_for_female = 0
            total_value += (service_value_for_male + service_value_for_female)
        
        # Get the discount
        discount = request.POST.get('discount')
        if discount:
            discount = round(float(discount), 2)        

        # Get the total revenue
        revenue = round(float(total_value*(100 - discount)/100))

        # Get the initiation date
        initiation_date = request.POST.get('initiation_date', '')   
        new_contract = Contract(
            client = client,
            male_headcount = male_headcount,
            female_headcount = female_headcount,
            total_value = total_value,
            discount = discount,
            revenue = revenue,
            initiation_date = initiation_date,
            created_by = request.user
        )
        new_contract.save()
        new_contract.services.set(services)
        new_contract.save()

        # Get the contract file
        pdf_file = request.FILES.get('contract_file')
        if pdf_file:
            # Create a new Contract instance with the uploaded file
            new_contract.pdf_file = pdf_file
            new_contract.save()

        request.session['yay_message'] = "Contract added"

        return HttpResponseRedirect(reverse('index'))
    
    # If user clicked link or being redirect
    else:
        companies = Company.objects.all()
        services = Service.objects.all()
        return render(request, "clinic/add_contract.html", {
            "services": services,
            "companies": companies
        })


# Retrieve all contracts that are not archived
@login_required
def all_contracts(request):
    contracts = Contract.objects.filter(archived=False).order_by('initiation_date')

    # Get today
    today = date.today()

    # Add a field to each contract to confirm if the initiation date is near within 10 days
    for contract in contracts:
        if days_between(str(today), str(contract.initiation_date)) <= 10:
            contract.in_within_10_days = True
        else:
            contract.in_within_10_days = False

    return render(request, "clinic/contracts.html", {
        "contracts": contracts,
        "today": today
    })


# Allow user to access contract detail, and archive the contract
@login_required
def contract_detail(request, contract_id):
    try:
        contract = Contract.objects.get(pk=contract_id)
    except Contract.DoesNotExist:
        request.session['nay_message'] = "Invalid contract ID"
        return HttpResponseRedirect(reverse('all_contracts'))

    return render(request, "clinic/contract_detail.html", {
        "contract": contract
    })


# Allow user to change contracts from activation to finish or archived
@login_required
def archive_contract(request):
    if request.method == 'POST':
        contract_id = request.POST.get('contract_id')
        if contract_id:
            try:
                contract = Contract.objects.get(pk=contract_id)
                contract.archived = True
                contract.archived_date = timezone.now()
                contract.archived_by = request.user
                contract.save()
            except Contract.DoesNotExist:
                request.session['nay_message'] = "Contract with that id does not exist"
                return HttpResponseRedirect(reverse('all_contracts'))

        return redirect('contract_detail', contract_id = contract_id)
    
    else:
        request.session['nay_message'] = "POST method required"
        return HttpResponseRedirect(reverse('all_contracts'))


# Allow user to visit all archived contracts
@login_required
def all_archived_contracts(request):
    # Get all archived contracts
    contracts = Contract.objects.filter(archived=True).order_by("initiation_date")

    return render(request, "clinic/all_archived_contracts.html",{
        "contracts": contracts
    })


# Prepare a contract in word ready for printing
def generate_contract_docx(request, contract_id):
    # Get the contract
    contract = Contract.objects.get(pk=contract_id)

    # Create a new word document
    doc = Document()

    # Add content to the document
    title = doc.add_heading('CONTRACT AGREEMENT', level=1)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.runs[0]
    title_run.font.size = Pt(24)

    # Add contract detail to the document
    head1 = doc.add_heading('By King Hospital', level=3)
    head1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    head1_run = head1.runs[0]
    head1_run.font.size = Pt(16)

    # Date of Agreement
    contract_date = doc.add_paragraph(f"This Agreement is made on: {date.today()}")
    contract_date.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contract_date_run = contract_date.runs[0]
    contract_date_run.font.size = Pt(12)

    # Between
    doc.add_heading('BETWEEN', level= 2)

    # Create style for indentation
    style = doc.styles.add_style('IndentedStyle', 1)
    style.font.size = Pt(12)
    style.paragraph_format.left_indent = Inches(0.2)

    # Add the indented paragraph with the defined style
    doc.add_paragraph("A party: King Hospital", style='IndentedStyle')
    doc.add_paragraph(f"B party: {contract.client.name}", style='IndentedStyle')
    
    # Recitals
    doc.add_heading('RECITALS', level= 2)

    doc.add_paragraph("A party have appropriate legal right and technology to perform annual health check")
    doc.add_paragraph("B party have the need to provide their employees the benefit of checking health annually")

    # Agreements
    doc.add_heading('AGREEMENTS', level=2)

    doc.add_paragraph("A party will perform health check for B party's employees in the attached list")

    doc.add_heading('EMPLOYEE QUANTITY', level=3)

    doc.add_paragraph(f"Male employees: {contract.male_headcount}")

    doc.add_paragraph(f"Female employees: {contract.female_headcount}")

    doc.add_heading('TEST OR EXAMINATION TO BE PERFORMED', level=3)

    for service in contract.services:
        doc.add_paragraph({service.name})    
    
    doc.add_heading('CONTRACT VALUE', level=3)
    doc.add_paragraph(f"Total Value: {contract.total_value}")
    doc.add_paragraph(f"Discount: {contract.discount}")
    doc.add_paragraph(f"Value after discount: {contract.revenue}")

    doc.add_heading('CONTRACT INITIATION')

    doc.add_paragraph(f"A party will perform health check for employees of party B regarding the quantity and name list attached from the initiation date to the end of the duration given")

    doc.add_paragraph(f"Initiation Date: {contract.initiation_date}")

    doc.add_paragraph(f"Duration: 7 working days after initiation date")

    doc.add_heading ('PAYMENT DURATION', level=3)
    doc.add_paragraph("30 days after A party finished performing health check, send summarize health report, and payment request to B party")

    doc.add_heading('RESPONSIBILITY', level=2)

    doc.add_heading('A PARTY', level=3)

    doc.add_paragraph("Prepare sufficient resources including machines, devices, doctors, nurses, and other supporting staff to successfully perform health check regarding people quantity in the contract. Organize, and inform the capability of the performance team so that B party have the clue to inform their employees to plan their coming ahead")

    doc.add_heading('B PARTY', level=3)

    doc.add_paragraph("Inform employee about the time and place to perform health check, and to cooperate with performing team to have best efficiency")

    doc.add_paragraph("Pay the value due to the value in the contract")

    response = HttpResponse(content_type='application/msword')
    response['Content-Disposition'] = f'attachment; filename=contract_{contract.id}.docx'

    # save the doc
    doc.save(response)

    return response

# Allow team to manage timeline, schedule, meeting to meet up with clients

# Implement search function