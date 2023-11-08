document.addEventListener('DOMContentLoaded', function() {
    // If there's message in alert bar, hide it after a short time
    hideMessage();
    function hideMessage() {
        const yay_message = document.querySelector('.alert-success');
        const nay_message = document.querySelector('.alert-danger');
        if (yay_message || nay_message) {
            setTimeout(function() {
                document.querySelector('header').style.animationPlayState = 'running';
            }, 2000)            
            document.querySelector('header').addEventListener('animationend', function() {
                document.querySelector('header').innerHTML = '';
            })
        }
    }
    
    // only check if user logged in
    if (isAuthenticated) {
        // CHECK RIGHTS FOR ADD PEOPLE, ADD SERVICE, ADD COMPANY, ADD CONTRACT, WHEN ALL WERE CHECKED, COUNT THE RIGHTS, THEN IF THE RIGHT = 0, HIDE THE 'ADD' BUTTON ON NAVIGATION BAR
        const checkAddPeopleRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': 'add_people_info'        
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })    
    
        const checkAddServiceRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': 'add_service_info'        
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })

        const checkAddCompanyRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify ({
                'right': 'add_company_info'
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })

        const checkAddContractRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify ({
                'right': 'modify_contract_info'
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })
    
        // Get the adding list item
        const adding = document.querySelector('#adding-items');
    
        // Get the adding people item
        const addPpListItem = document.querySelector('#add-people-list-item');
    
        // Get the adding service item
        const addSvListItem = document.querySelector('#add-service-list-item');

        // Get the adding company item
        const addCoListItem = document.querySelector('#add-company-list-item');
    
        // Get the adding contract item
        const addContractListItem = document.querySelector('#add-contract-list-item');

        // IMPORTANT-LEVEL-S: Wait for both promise to resolve, then count
        Promise.all([checkAddPeopleRight, checkAddServiceRight, checkAddCompanyRight, checkAddContractRight])
    
        // Hide or show the list items
        .then(results => {
            const [addPeopleResult, addServiceResult, addCompanyResult, addContractResult] = results;       
    
            // Decide to show or hide list item depending on whether user have right to add people or not
            if (addPeopleResult) {
                addPpListItem.style.display = 'block';
            } else {
                addPpListItem.style.display = 'none';
            }
            
            // Similarly, decide for right to add service
            if (addServiceResult) {
                addSvListItem.style.display = 'block';
            } else {
                addSvListItem.style.display = 'none';
            }

            // Similarly, decide for right to add company
            if (addCompanyResult) {
                addCoListItem.style.display = 'block';
            } else {
                addCoListItem.style.display = 'none';
            }
            // The same with add contract
            if (addContractResult) {
                addContractListItem.style.display = 'block';
            } else {
                addContractListItem.style.display = 'none';
            }
        })
    
        // then count the visible list items
        .then(() => {
            // get the dropdown menu ul
            const dropDown = adding.querySelector('.dropdown-menu');
            
            // get all li inside that dropdown
            const AllLi = dropDown.querySelectorAll('li');
    
            // IMPORTANT-LEVEL-B: Get the lis that are visible
            const visibleLi = Array.from(AllLi).filter(li => li.style.display !== 'none');
    
            // Get the count
            const liNum = visibleLi.length;
    
            // If the count was 0, hide the whole button in navigation bar
            if (liNum === 0) {
                adding.style.display = 'none';
            }
        })

        // Check the user right, if he/she is legit for read user management page, create a link in the dropdown menu
        fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': 'read_user_right'
            })
        })
        .then(response => response.json())
        .then(data => {
            const result = data.check_result;

            // If user has the right, create the link
            if (result) {
                let i = document.createElement('li');
                let j = document.createElement('a');
                j.className = 'dropdown-item';
                j.onclick = function() {
                    // IMPORTANT-LEVEL-C: create link to other route in JS
                    window.location.href = '/authorize';
                }
                j.style.cursor = 'pointer';
                j.innerHTML = 'Manage users';
                i.append(j);

                // Insert to the first row inside of the menu
                const menu = document.querySelector('#user-dropdown-menu');
                menu.insertBefore(i, menu.firstChild);
            }
        })
        .catch(error => {
            console.log(error);
        })

        // CHECK RIGHTS FOR SHOW PEOPLE, COMPANY
        fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': "read_all_people_info"
            })
        })
        .then(response => response.json())
        .then(data => {
            const result = data.check_result;

            // If user have right
            if (result) {
                document.querySelector('#all-people-list-item').style.display = 'block';
            } else {
                document.querySelector('#all-people-list-item').style.display = 'none';
            }
        })
        .catch(error => {
            console.log(error);
        })

        fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': "read_company_info"
            })
        })
        .then(response => response.json())
        .then(data => {
            const result = data.check_result;

            // If user have right
            if (result) {
                document.querySelector('#all-companies-list-item').style.display = 'block';
            } else {
                document.querySelector('#all-companies-list-item').style.display = 'none';
            }
        })
        .catch(error => {
            console.log(error);
        })
    }    
})