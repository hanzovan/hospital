document.addEventListener('DOMContentLoaded', function() {
    // Define elements
    const editDiv = document.querySelector('.edit-div');
    const showBtn = document.querySelector('#edit-btn');
    const editForm = editDiv.querySelector('#edit-form');
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
        const new_email = document.querySelector('#email').value;
        const new_phone = document.querySelector('#phone').value;
        const new_note = document.querySelector('#note').value;
        
        // Send the values to the server for updating
        fetch(`/person/${person_id}`, {
            method: 'POST',
            body: JSON.stringify({
                'new_name': new_name,
                'new_position': new_position,
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
    editDiv.style.display = 'none';
    newMessageDiv.style.opacity = '0';

    // When user click the button, show the editDiv
    showBtn.onclick = function() {
        if (editDiv.style.display === 'none') {
            editDiv.style.display = 'block';
        } else {
            editDiv.style.display = 'none';
        }        
    }

    showNewMessageBtn.onclick = function() {
        if (newMessageDiv.style.opacity === '0') {
            newMessageDiv.style.opacity = '1';
            newMessageDiv.style.transform = 'translateY(0)';
        } else {
            newMessageDiv.style.opacity = '0';
            newMessageDiv.style.transform = 'translateY(-200px)';
        }
    }
    const messageContent = document.querySelector('#message-form').querySelector('.form-control');
    messageContent.onfocus = function() {
        this.closest('.form-group').classList.add('focused');
    }
    messageContent.onblur = function() {
        this.closest('.form-group').classList.remove('focused');
    }

    
})