document.addEventListener('DOMContentLoaded', function() {
    const editDiv = document.querySelector('.edit-div');
    const showBtn = document.querySelector('#edit-btn');
    const editForm = editDiv.querySelector('#edit-form');

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

    // By default editDiv will be hidden
    editDiv.style.display = 'none';

    // When user click the button, show the editDiv
    showBtn.onclick = function() {
        if (editDiv.style.display === 'none') {
            editDiv.style.display = 'block';
        } else {
            editDiv.style.display = 'none';
        }        
    }


})