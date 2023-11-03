document.addEventListener('DOMContentLoaded', function() {
    // Define elements
    const editDiv = document.querySelector('.edit-div');
    const showBtn = document.querySelector('#edit-btn');
    const editForm = editDiv.querySelector('#edit-person-detail-form');
    const showNewMessageBtn = document.querySelector('#new-message-show');
    const newMessageDiv = document.querySelector('#new-message');
    const removePersonFormContainer = document.querySelector('#remove-person-form-container');

    // By defaul the form should be hidden
    removePersonFormContainer.style.display = 'none';

    // Call an Http request to check user right
    fetch('/check_right', {
        method: 'POST',
        body: JSON.stringify({
            'right': 'modify_people_info'
        })
    })
    .then(response => response.json())
    .then(data => {
        const result = data.check_result;

        // If user does not have the right, hide the button, else show the button
        if (result) {
            removePersonFormContainer.style.display = 'block';
        } else {
            removePersonFormContainer.style.display = 'none';
        }
    })
    .catch(error => {
        console.log(error);
    })

    editForm.onsubmit = function() {
        // Get the value from the form
        const new_name = document.querySelector('#name').value;
        const new_position = document.querySelector('#position').value;
        const new_address = document.querySelector('#address').value;
        const new_email = document.querySelector('#email').value;
        const new_phone = document.querySelector('#phone').value;
        const new_note = document.querySelector('#note').value;
        
        // Send the values to the server for updating
        fetch(`/person/${person_id}`, {
            method: 'POST',
            body: JSON.stringify({
                'new_name': new_name,
                'new_position': new_position,
                'new_address': new_address,
                'new_email': new_email,
                'new_phone': new_phone,
                'new_note': new_note
            })
        })
        .then(response => {
            if (response.status === 200) {
                // Update value to be original value in browser
                document.querySelector('#original-name').innerHTML = `<strong>${new_name}</strong>`;
                document.querySelector('#original-position').innerHTML = `<strong>${new_position}</strong>`;
                document.querySelector('#original-email').innerHTML = `<strong>${new_email}</strong>`;
                document.querySelector('#original-phone').innerHTML = `<strong>${new_phone}</strong>`;
                document.querySelector('#original-note').innerHTML = `<strong>${new_note}</strong>`;
                // Hide the form
                editDiv.style.display = 'none';
            } else if (response.status === 403) {
                // Redirect user to people page
                window.location.href = '/';
            } else if (response.status === 400) {
                window.location.href= '/';
            } else if (response.status === 401) {
                window.location.href = '/';
            }
            else {
                console.error(error);
            }
        })
        .catch(error => {
            console.log(error);
        })        

        // Prevent form was submitted to server by other method
        return false;
    }

    // By default editDiv and newMessageDiv will be hidden
    editDiv.style.opacity = '0';
    editDiv.style.height = '0';
    newMessageDiv.style.opacity = '0';
    newMessageDiv.style.height = '0';

    // Display has to be set to none when not using form so that other components (like other function button) won't be affect
    editDiv.style.display = 'none';
    newMessageDiv.style.display = 'none';

    // Define a function that accept 2 arguments, the event and the targeted div, the function will close the div
    function clickOutside(event, targetDiv) {
        if(!targetDiv.contains(event.target)) {            
            closeEditing(targetDiv);
        }
    }

    // Event Delegation
    const clickOutsideEditDiv = (event) => {
        clickOutside(event, editDiv); 
    }
    const clickOutsideMessageDiv = (event) => {
        clickOutside(event, newMessageDiv);
    }

    // When user click the button, show the editDiv, or close it if it already shown
    showBtn.onclick = function() {
        if (editDiv.style.opacity === '0') {
            document.removeEventListener('click', clickOutsideEditDiv);
            editDiv.style.display = 'block';
            setTimeout(function() {
                editDiv.style.height = '100%';
                editDiv.style.opacity = '1';
                editDiv.style.transform = 'translateY(-500px)';
            }, 50);
            
            // Add eventlistener
            setTimeout(function() {
                document.addEventListener('click', clickOutsideEditDiv);
            }, 50);            

        } else {
            // Close the form
            closeEditing(editDiv);
        }        
    }

    showNewMessageBtn.onclick = function() {
        if (newMessageDiv.style.opacity === '0') {
            document.removeEventListener('click', clickOutsideMessageDiv);            
            newMessageDiv.style.display = 'block';
            setTimeout(function() {
                newMessageDiv.style.height = '100%';
                newMessageDiv.style.opacity = '1';
                newMessageDiv.style.transform = 'translateY(-400px)';
            }, 50);
            
            // Add eventlistener that close the message form when user click outside
            setTimeout(function() {
                document.addEventListener('click', clickOutsideMessageDiv);
            })
            
        } else {
            // Close the form
            closeEditing(newMessageDiv);
        }
    }
    // Make effect when user click on message input
    const messageContent = document.querySelector('#message-form').querySelector('.form-control');
    messageContent.onfocus = function() {
        this.closest('.form-group').classList.add('focused');
    }
    messageContent.onblur = function() {
        this.closest('.form-group').classList.remove('focused');
    }

    // Add effect when using click on a input on edit person form
    const editPersonControls = editForm.querySelectorAll('.form-control');
    editPersonControls.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })

    // Add button that allow user to close new message form
    const hideMessageBtn = document.querySelector('#hide-new-message');
    hideMessageBtn.onclick = function() {
        //Remove div
        closeEditing(newMessageDiv);
    }

    // Add button that allow user to close the editing info form
    const hideEditingPersonBtn = document.querySelector('#hide-editing-person');
    hideEditingPersonBtn.onclick = function() {
        //Remove div
        closeEditing(editDiv);
    }

    // Close editing form
    function closeEditing(targetDiv) {
        targetDiv.style.opacity = '0';
        targetDiv.style.transform = 'translateY(-200px)';
        targetDiv.style.height = '0';
        setTimeout(function() {
            targetDiv.style.display = 'none';
        }, 1000);
    }
})