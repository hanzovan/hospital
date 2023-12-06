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
