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
    
    // only if user logged in, do this
    if (isAuthenticated) {
        // MOBILE RESPONSIVE PART FOR NAVBAR
            // When user click the hamburger button, show the general menu
        let mobileMenu = document.querySelector('#mobile-menu');
        let hamburgerBtn = document.querySelector('#hamburger-btn');
        hamburgerBtn.onclick = function() {
            if (mobileMenu.style.maxHeight === "0px" || mobileMenu.style.maxHeight === "") {
                // Remove eventlistener if there was any, because it will trigger before the menu appear and cause it to close right after appear
                document.removeEventListener('click', clickOutsideMobileMenu);
                mobileMenu.style.maxHeight = "800px";
                setTimeout(function() {
                    document.addEventListener('click', clickOutsideMobileMenu);
                }, 50);
            } else {
                mobileMenu.style.maxHeight = "0px";
            }
        }

            // When user click username or profile inside the general menu, show the profile menu
        let profileMenu = document.querySelector('#profile-menu');
        let profileBtn = document.querySelector('#profile-btn');
        profileBtn.onclick = function() {
            if (profileMenu.style.maxHeight === "0px" || profileMenu.style.maxHeight === "") {
                // Remove previous eventlistener
                document.removeEventListener('click', clickOutsideProfileMenu);
                profileMenu.style.maxHeight = "300px";
                setTimeout(function() {
                    document.addEventListener('click', clickOutsideProfileMenu);
                }, 50);
            } else {
                profileMenu.style.maxHeight = "0px";
            }
        }

            // When user click lists button, show the Lists menu
        let listsMenu = document.querySelector('#lists-menu');
        let listsBtn = document.querySelector('#lists-btn');
        listsBtn.onclick = function() {
            if (listsMenu.style.maxHeight === '0px' || listsMenu.style.maxHeight === "") {
                // Remove previous eventlistener
                document.removeEventListener('click', clickOutsideListsMenu);
                listsMenu.style.maxHeight = "300px";
                setTimeout(function() {
                    document.addEventListener('click', clickOutsideListsMenu);
                }, 50);
            } else {
                listsMenu.style.maxHeight = "0px";
            }
        }

            // When user click Add button, show the Add menu
        let addMenu = document.querySelector('#add-menu');
        let addBtn = document.querySelector('#add-btn');
        addBtn.onclick = function() {
            if (addMenu.style.maxHeight === "0px" || addMenu.style.maxHeight === "") {
                // Remove previous eventlistener
                document.removeEventListener('click', clickOutsideAddMenu);
                addMenu.style.maxHeight = "300px";
                setTimeout(function() {
                    document.addEventListener('click', clickOutsideAddMenu);
                }, 50);
            } else {
                addMenu.style.maxHeight = "0px";
            }
        }

            // Define a function that hide menu when user click outside
        function clickOutside(event, targetMenu) {
            if (!targetMenu.contains(event.target)) {
                targetMenu.style.maxHeight = "0px";
            }
        }

            // Define event delegation, without this, the event can't be remove correctly
        const clickOutsideMobileMenu = (event) => {
            clickOutside(event, mobileMenu);
        }
        const clickOutsideProfileMenu = (event) => {
            clickOutside(event, profileMenu);
        }
        const clickOutsideListsMenu = (event) => {
            clickOutside(event, listsMenu);
        }
        const clickOutsideAddMenu = (event) => {
            clickOutside(event, addMenu);
        }

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

        const checkAddMeetingRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify ({
                'right': 'modify_meeting_info'
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })
    
        // Get the adding list item
        const adding = document.querySelector('#adding-items');
        const mobileAdding = document.querySelector('#mobile-adding-items');
    
        // Get the adding people item
        const addPpListItem = document.querySelector('#add-people-list-item');
        const mobileAddPpListItem = document.querySelector('#mobile-add-people-list-item');
    
        // Get the adding service item
        const addSvListItem = document.querySelector('#add-service-list-item');
        const mobileAddSvListItem = document.querySelector('#mobile-add-service-list-item');

        // Get the adding company item
        const addCoListItem = document.querySelector('#add-company-list-item');
        const mobileAddCoListItem = document.querySelector('#mobile-add-company-list-item');
    
        // Get the adding contract item
        const addContractListItem = document.querySelector('#add-contract-list-item');
        const mobileAddContractListItem = document.querySelector('#mobile-add-contract-list-item');

        // Get the adding meeting item
        const addMeetingListItem = document.querySelector('#add-meeting-list-item');
        const mobileAddMeetingListItem = document.querySelector('#mobile-add-meeting-list-item');

        // Important-S: Wait for all promise to resolve, then count
        Promise.all([checkAddPeopleRight, checkAddServiceRight, checkAddCompanyRight, checkAddContractRight, checkAddMeetingRight])
    
        // Hide or show the list items
        .then(results => {
            const [addPeopleResult, addServiceResult, addCompanyResult, addContractResult, addMeetingResult] = results;       
    
            // Decide to show or hide list item depending on whether user have right to add people or not
            if (addPeopleResult) {
                addPpListItem.style.display = 'block';
                mobileAddPpListItem.style.display = 'block';
            } else {
                addPpListItem.style.display = 'none';
                mobileAddPpListItem.style.display = 'none';
            }
            
            // Similarly, decide for right to add service
            if (addServiceResult) {
                addSvListItem.style.display = 'block';
                mobileAddSvListItem.style.display = 'block';
            } else {
                addSvListItem.style.display = 'none';
                mobileAddSvListItem.style.display = 'none';
            }

            // Similarly, decide for right to add company
            if (addCompanyResult) {
                addCoListItem.style.display = 'block';
                mobileAddCoListItem.style.display = 'block';
            } else {
                addCoListItem.style.display = 'none';
                mobileAddCoListItem.style.display = 'none';
            }
            // The same with add contract
            if (addContractResult) {
                addContractListItem.style.display = 'block';
                mobileAddContractListItem.style.display = 'block';
            } else {
                addContractListItem.style.display = 'none';
                mobileAddContractListItem.style.display = 'none';
            }
            // Decide for add meeting button
            if (addMeetingResult) {
                addMeetingListItem.style.display = 'block';
                mobileAddMeetingListItem.style.display = 'block';
            } else {
                addMeetingListItem.style.display = 'none';
                mobileAddMeetingListItem.style.display = 'none';
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
    
            // If the count was 0, hide the whole button in navigation bar, the same for mobile navbar
            if (liNum === 0) {
                adding.style.display = 'none';
                mobileAdding.style.display = 'none';
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

                // For mobile navbar
                let jm = document.createElement('a');
                jm.className = 'sub-menu';
                jm.style.cursor = 'pointer';
                jm.style.color = 'white';
                jm.style.padding = '14px 16px';
                jm.style.textDecoration = 'none';
                jm.style.fontSize = '17px';
                jm.style.display = 'block';

                    // add hover effect
                jm.addEventListener('mouseover', function() {
                    jm.style.backgroundColor = '#ddd';
                    jm.style.color = 'black';
                })
                jm.addEventListener('mouseout', function() {
                    jm.style.backgroundColor = '';
                    jm.style.color = 'white';
                })

                jm.onclick = function() {
                    window.location.href = '/authorize';
                }
                jm.innerHTML = 'Manage users';
                const profileMenu = document.querySelector('#profile-menu');
                profileMenu.insertBefore(jm, profileMenu.firstChild);
            }
        })
        .catch(error => {
            console.log(error);
        })

        // CHECK RIGHTS FOR SHOW PEOPLE, COMPANY
        const readMyPeopleRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': "read_self_add_people_info"
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })

        const readPeopleRight = fetch('/check_right', {        
            method: 'POST',
            body: JSON.stringify({
                'right': "read_all_people_info"
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })

        const readCompaniesRight = fetch('/check_right', {        
            method: 'POST',
            body: JSON.stringify({
                'right': "read_company_info"
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })

        const readContractsRight = fetch('/check_right', {
            method: 'POST',
            body: JSON.stringify({
                'right': "read_contract_info"
            })
        })
        .then(response => response.json())
        .then(data => data.check_result)
        .catch(error => {
            console.log(error);
        })

        //Get the items from reading menu
        const reading = document.querySelector('#reading-items');
        const myPeopleItem = document.querySelector('#my-people-list-item');
        const allPeopleItem = document.querySelector('#all-people-list-item');
        const companiesListItem = document.querySelector('#all-companies-list-item');
        const activeContractsListItem = document.querySelector('#active-contracts-list-item');
        const archivedContractsListItem = document.querySelector('#archived-contracts-list-item');
        const allMeetingsListItem = document.querySelector('#all-meetings-list-item');
        const upcomingMeetingsListItem = document.querySelector('#upcoming-meetings-list-item');

        //Important-S: wait for all promises to resolve, then count
        Promise.all([readMyPeopleRight, readPeopleRight, readCompaniesRight, readContractsRight])
        .then(results => {
            const [readMyPeopleResult, readPeopleResult, readCompaniesResult, readContractsResult] = results;

            //If user has right to read their own people info
            if (readMyPeopleResult) {
                myPeopleItem.style.display = 'block';
            } else {
                myPeopleItem.style.display = 'none';
            }

            //Similarly for the right to read all people info
            if (readPeopleResult) {
                allPeopleItem.style.display = 'block';
            } else {
                allPeopleItem.style.display = 'none';
            }

            //The same goes with the right to read companies info
            if (readCompaniesResult) {
                companiesListItem.style.display = 'block';
            } else {
                companiesListItem.style.display = 'none';
            }

            //And the right to read contract info
            if (readContractsResult) {
                activeContractsListItem.style.display = 'block';
                archivedContractsListItem.style.display = 'block';
            } else {
                activeContractsListItem.style.display = 'none';
                archivedContractsListItem.style.display = 'none';
            }
        })
        //Then count the visible list items, if there is none, hide the entire menu
        .then(() => {
            //Get the dropdown menu ul
            const readDropDown = reading.querySelector('.dropdown-menu');

            //Get all li inside the dropdown
            const readAllLi = readDropDown.querySelectorAll('li');

            //Important-B: Get the visible li
            const readVisibleLi = Array.from(readAllLi).filter(li => li.style.display !== 'none');

            //Get the count
            const readLiNum = readVisibleLi.length;

            if (readLiNum === 0) {
                reading.style.display = 'none';
            }
        })
    }    
})