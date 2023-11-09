document.addEventListener('DOMContentLoaded', function() {
    // Define form and button
    const editForm = document.querySelector('#edit-contract-form-container');
    const showEditingBtn = document.querySelector('#show-editing');
    const hideEditingBtn = document.querySelector('#hide-editing');

    // Check user right, if user does not have permission to edit contract, hide showEditingBtn
    fetch('/check_right', {
        method: 'POST',
        body: JSON.stringify({
            'right': 'modify_contract_info'
        })
    })
    .then(response => response.json())
    .then(data => {
        const result = data.check_result;
        if (result) {
            showEditingBtn.style.display = 'block';
        } else {
            showEditingBtn.style.display = 'none';
        }
    })
    .catch(error => {
        console.log(error);
    })

    // By default, the form should be hidden
    closeEditing(editForm);

    // When user click the showEditing button, the form should appear, clicking it again should hide it again
    showEditingBtn.onclick = function() {
        //Remove eventlistener first to avoid dupplicate
        document.removeEventListener('click', clickOutsideForm);        
        editForm.style.display = 'block';
        setTimeout(function() {
            editForm.style.opacity = '1';
            editForm.style.height = '100%';
            editForm.style.transform = 'translateY(-500px)';
            document.addEventListener('click', clickOutsideForm);
        }, 50);        
    }
    
    hideEditingBtn.onclick = function() {
        closeEditing(editForm);
    }

    //Function that hide the edit form
    function closeEditing(targetDiv) {
        targetDiv.style.opacity = '0';
        targetDiv.style.transform = 'translateY(-200px)';
        targetDiv.style.height = '0';
        setTimeout(function() {
            targetDiv.style.display = 'none';
        }, 1000);
    }
    //Function that close the form when user click outside
    function clickOutside(event, targetDiv) {
        if (!targetDiv.contains(event.target)) {
            closeEditing(targetDiv);
        }
    }
    //Delegation event
    const clickOutsideForm = (event) => {
        clickOutside(event, editForm);
    }
})