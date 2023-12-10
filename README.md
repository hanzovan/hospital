# HOSPITAL

# Distinctiveness and Complexity
## A. Distinctiveness
Developed using the Django framework, this web application caters to various to various hierarchical levels within a hospitals sales department. It aims to streamline client information management, covering company details, representatives, workforce statistics, historical contracts, meeting agreements, and client communications. The application focuses on minimizing paperwork, enhancing data management efficiency, and ensuring meticulous preparation for client interactions.
<br><br>
Unlike projects such as Pizza (online orders) or Network (user interaction), the Hospital application stands out with a comprehensive suite of features tailored to healthcare's intricate data structures. Its complexity lies in the hierarchical user roles, offering nuanced permissions for different responsibilities, ensuring data security and user-specific functionality.
<br><br>
Here are distinctive features:

### 1. Efficient Meeting Schedule Management
In clinical settings, meetings were traditionally managed through physical notes or scattered digital files. This application streamlines the process by allowing users to prepare and store meeting information efficiently. It enables scheduling future meetings, checking for overlaps, and storing results for quick reference.

### 2. Upcoming Contracts Alert
Contracts nearing initiation within 10 days turn red in the chronological list, alerting users. This ensures timely action before due dates.

### 3. Streamlined Contract Composition
The application significantly accelerates contract composition by prefiling essential information from the database. This not only expedites the process but also eliminates manual data entry.

### 4. Secure Storage of Contract Documents in PDF Format
Contracts are securely stored in the database, eliminating the risk of misplacement and ensuring easy retrieval.

### 5. User Account Differentiation for Varied Management Permissions
Users are categorized into four levels, each with increasing access and execution capabilities. This tiered structure prevents information leakage and unauthorized actions.

### 6. Seamless Mobile Experience
Optimal mobile responsiveness enhances user experience, ensuring ease of information access and task completion on various devices.

## B. Complexity
Developing the web application involved extensive work with Django, Python, and JavaScript. The project comprises 35 routes, 2000 lines of code in views, 24 HTML files, and 20 JavaScript files. Notably, intricate features, including user permissions and PDF file handling, were implemented without external libraries, demonstrating careful consideration and problem-solving.

### 1. Hospital Project Model
Initiating the development involved creating models like Company, Contract, MeetUp, and Service. The Company model stores vital information, necessitating additional models (People and User) for representatives and users. The User model introduces a hierarchical level system, contributing to the project's complexity.

### 2. Create accounts and log in, log out
The web application allows users to create accounts with a default management level of 0. Password checks and username uniqueness ensure secure account creation.

### 3. Check permission
A function defines permissions in a list, enhancing code maintainability. Permission checks are implemented across routes, ensuring legitimate user access.

### 4. Personal list of contact
Lower-level sales staff access only their contact information. Modifications require assistance from higher-level users.

### 5. Personal navigation bar
User access aligns with their management level, enhancing business security. Unauthorized attempts result in redirection.

### 6. Store pdf files of scanned contracts
Configuration settings in settings.py and urls.py enable secure storage and retrieval of PDF files, enhancing document accessibility.

### 7. Generate docx
A dedicated route streamlines contract composition, representing essential details for quick adjustments and efficient workflow.

### 8. User Interface Design
The responsive design ensures optimal usability across varying screen widths, providing an adaptive and user-friendly experience.

# File Structure and Functionality
The application follows the standard Django framework project structure, featuring a single application folder named '**clinic**'. Within this folder, essential files like '**views.py**', '**models.py**', and '**admin.py**' are complemented by custom additions such as '**helpers.py**' and '**urls.py**'. Additionally, two crucial directories, '**static**' and '**templates**', house CSS and JavaScript files, and HTML templates, respectively.
<br><br>

In the project root, I've created the '**media**' folder to store scanned contract files, the '**readme.md**' file, and the '**readme_images**' folder for images displayed in this '**readme.md**'. The '**styles.scss**' file is employed for styling the web application. In the '**hospital**' project folder, modifications were made to '**settings.py**' and '**urls.py**' for configuration.

## A. style.scss
This SASS file organizes and creates the '**styles.css**' file stored in the '**static**' folder within the '**clinic**' application. It plays a crucial role in styling the user interface, encompassing both PC and mobile-responsive components, as well as configuring various forms.

## B. /readme_images/
This directory houses all screen captures and images displayed in this README.md file.

## C. /media/uploaded_files
The storage location for all saved media files, primarily catering to scanned contracts uploaded by users.

## D. /hospital/
The default folder created upon project initiation, containing configuration files where adjustments to '**settings.py**' and '**urls.py**' were made.

### 1. settings.py
- Added the '**clinic**' app to the list of installed apps.
- Set the login URL for server redirection: **LOGIN_URL = 'login'**
- Configured the server to use the user model created in '**models.py**': **AUTH_USER_MODEL = 'clinic.User'**
- Defined media root and URL for serving and storing media files:
    - **MEDIA_ROOT = os.path.join(BASE_DIR, 'media')**
    - **MEDIA_URL = '/media/'**

### 2. urls.py
Defined the path for the web application to display the '**clinic**' app.

## E. /clinic/
This directory encompasses all files and folders related to the app.

### 1. /templates/
Contains all application templates.

#### 1.1 layout.html
This file establishes the standard structure for all pages in the hospital application. It includes the head and body, positioning elements like the navigation bar, containing functional links, headers for messages, footers for author names, and the main part of the page. Additionally, it holds variables utilized in JavaScript files, such as the current user's login status.

#### 1.2 Authorization templates
These include 'login.html', 'register.html', and 'authorize.html', responsible for displaying the user interface for authorization.

#### 1.3 Other templates
Tailored to server route requirements, these templates display data lists, forms, variables used by scripts or associated JavaScript files. Certain parts may be shown or hidden based on conditions, and some may change according to associated JavaScript files.

### 2. /static/
Contains files related to the styling of the web application.

#### 2.1 styles.css and styles.css.map
Generated by the SASS file, these files style various components of the web application, including the mobile-responsive part.

#### 2.2 bootstrap.css
An offline version of the Boostrap link, providing reliability in case of internet connection failure.

#### 2.3 layout.js
This JavaScript file controls the display of specific parts in 'layout.html':
- The header, containing messages from the server. If a message exists, it is displayed for 2 seconds and then fades out.
- Checking permissions: Multiple HTTP requests are sent to the server to check user permissions, deciding which parts and buttons will be displayed on the navigation bar.
- The mobile navigation bar, manually written to handle user interaction and navigation behavior.

#### 2.4 Other JavaScript file
Each file manipulates the associated template version, affecting form behavior, hiding or showing forms based on user interactions or empty spaces. Some files check user permissions via HTTP requests or retrieve values from templates. Others check instance field values to determine the visibility of certain parts of the web, such as 'meeting_agenda.js'.

### 3. models.py
Houses all the models utilized in the application.

#### 3.1 User
In addition to the default fields of AbstractUser, I added 'management_right_level', including four choices to define user permissions, ranging from 0-3.

#### 3.2 Company
Includes company information such as name, industry, contact details, workforce statistics, and the user who created and modified the instance.

#### 3.3 People
Encompasses information about an individual related to a company, including name, contact details, address, related company, and the user who created and modified the information.

#### 3.4 ContactDiary
Stores messages and sent dates from the hospital's contact, linked to the '**People**' model.

#### 3.5 Service
Contains information about a service, test, or examination, including name, details, prices for male and female individuals, and the user who created or modified the instance.

#### 3.6 MeetUp
Stores information about a meeting's schedule, client (foreign key linked to company), creation timestamp, and the meeting's status indicating whether it has concluded.

#### 3.7 MeetingAgendaItem
Stores items or problems to be debated or agreed upon in a meeting, including the status of the item (successful or not) and the meeting it belongs to (foreign key).

#### 3.8 Contract
Stores contract information, including the client, services chosen, the quantity or staff using the services, value, price, discount information, the payment that the client has to fulfill after the contract, intiation date, scanned file of the contract, archive status indicating whether the contract has finished or not



### 4. admin.py
This file serves to register all models to the admin page, granting administrators the ability to inspect and make modifications to the web application database. Admin.py facilitates efficient management and oversight of the application's data through the Django admin interface.

### 5. helpers.py
The **helpers.py** file plays a crucial role in providing utility functions for the web application, aiding in various tasks performed in views.py. It consists of three distinc functions:

#### 5.1 **strong_password(e)**
This function is designed to evaluate whether a given password meets specific criteria for strength. It checks if the password contains at least one special character, one number, one alphabet character, and is at least 6 characters in length. This function is employed during the account creation process to enhance password security, ensuring that user information remains confidential and protected.

#### 5.2 **user_right(level)**
The **user_right** function is responsible for managing and determining the list of permissions associated with a given user level. It serves as a pivotal component in the application's permission-checking mechanism. Based on the provided user level, the function constructs a list of rights that user is granted, facilitating nuanced access control. The function plays a key role in regulating user capabilities throughout the application, ensuring that users only have access to functionalities aligned with their designated management level.

#### 5.3 **days_between(d1, d2)**
This utility function calculates and returns the number of days between two given dates. It is utilized within the application for tasks such as determining the time gap between two significant events or dates. The function enhances the applications ability to manage and analyze temporal aspects, contributing to various data-related functionalities.

### 6. urls.py
This file plays a crucial role in mapping the URLs of the web application to their corresponding views. Additionally, the last 2 lines are essential for serving media files during development.

### 7. views.py
This is the most important file in the app, handling HTTP requests and allowing users to interact with the server database. The file include:

#### 7.1 Authorization routes
These routes allow users to create accounts, log in, log out, verify user management levels, and authorize permissions:

- **register(request)**: Allows users to create an account.
- **login_view(request)**: Allows users to log in to their account.
- **logout_view(request)**: Allows users to log out
- **check_right(request)**: Allows the user interface to sent an HTTP request to the server to check user permissions.
- **authorize(request)**: Allows a top-level admin to modify other users' management right levels.

#### 7.2 Functioning routes
These routes enable various functionalities:

- **index**: Allows users to access the list of services (test or examination) from the database.
- **add_service(request)**: Allows users to add an instance of a service to the database.
- **service_detail(request, service_id)**: allow user to access specific service instance with more details. Allowing user to modify the detail as long as the user has permission.
- **remove_service(request)**: allow user to remove instance of service
- **add_people(request)**: allow user to add contact to the database
- **my_people(request)**: allow user to access the list of all people that were created by the current user.
- **people(request)**: allow user to access the list of all people created by all users.
- **person_detail(request, persion_id)**: allow user to access details of person's instance, modifying details of that person, access all messages of the person. Also allow user to add more message from a person in the list by clicking link.
- **remove_person(request)**: allow user to remove an instance of person or contact.
- **add_company(request)**: allow user to add instance of company to the database, including all the details. User can also choose to add representative for the company later or choose representative from the available list, or add a new person themself, which will then be also added to the contact list the same time with company.
- **companies(request)**: allow user to access the list of the companies
- **company_detail(request, company_id)**: allow user to access details about a specific company, modify its information, allowing user to update representative information by 2 methods: creating a brand new person, or choosing from an available list of people.
- **remove_company(request)**: allow user to remove an instance of company
- **message(request, person_id)**: allow user to add message related to a person
- **add_message_from_all_people_page(request, person_id)**: allow user to add message after clicking a link from people route
- **add_contract(request)**: allow user to add contract to database, the contract includes all the services that the clients chose and all other important information such as, quantity of staff that use the services, discount, price after discount, scanned file.
- **all_contracts(request)**: allow user to access information of all active contracts.
- **all_archived_contract(request)**: allow user to access information of all archived contracts.
- **contract_detail(request, contract_id)**: allow user to access details of a contract.
- **edit_contract(request)**: allow user to edit contract information.
- **generate_contract_docx(request, contract_id)**: allow user to compose the contract with crucial information of the contract already gathered by the code.
- **add_meeting(request)**: allow user to add a meeting information.
- **all_meetings(request)**: allow user to access the list of all meetings.
- **upcoming_meetings(request)**: allow user to access the list of all upcoming meetings, which was not overdue.
- **meeting_agenda(request, meeting_id)**: allow user to access all meeting agenda information.
- **add_meeting_agenda(request, meeting_id)**: allow user to add meeting agenda item into the meeting.
- **meeting_item_remove(request, meeting_id)**: allow user to remove item from meeting's agenda.
- **edit_meeting(request, meeting_id)**: allow user to adjust meeting's schedule.
- **end_meeting(request)**: allow user to change the status of the meeting to "**ended**"

