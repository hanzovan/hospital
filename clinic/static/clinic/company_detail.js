document.addEventListener('DOMContentLoaded', function() {
    const removeCompanyFormContainer = document.querySelector('#remove-company-form-container');
    const showEditCompanyBtn = document.querySelector('#show-edit-company-btn');
    
    //By default, the button should be hidden
    removeCompanyFormContainer.style.display = 'none';
    showEditCompanyBtn.style.display = 'none';

    // Send an Http request that check for user right
    fetch('/check_right', {
        method: 'POST',
        body: JSON.stringify({
            'right': 'modify_company_info'
        })
    })
    .then(response => response.json())
    .then(data => {
        const result = data.check_result;

        // If user has the right show the form and button, else keep hiding it
        if (result) {
            removeCompanyFormContainer.style.display = 'block';
            showEditCompanyBtn.style.display = 'block';
        } else {
            removeCompanyFormContainer.style.display = 'none';
            showEditCompanyBtn.style.display = 'none';
        }
    })
    .catch(error => {
        console.log(error);
    })
    
    //Get the form container
    const editFormContainer = document.querySelector('#edit-company-container');

    //Edit form effect for label
    const editFormControls = editFormContainer.querySelectorAll('.form-control');
    editFormControls.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })

    // Get the form representative part
    const updateRepresentativeMethod = editFormContainer.querySelector('#update_representative_method');

    // Get the first method div
    const createNewMethod = editFormContainer.querySelector('#create-new-method');
    // Get the 2nd method div
    const chooseFromListMethod = editFormContainer.querySelector('#choose-from-list-method');
    // Hide the methods by default
    createNewMethod.style.display = 'none';
    chooseFromListMethod.style.display = 'none';

    // Show them when user choose method
    updateRepresentativeMethod.onchange = function() {
        if (this.value === 'create_new') {
            createNewMethod.style.display = 'block';
            chooseFromListMethod.style.display = 'none';
        } else if (this.value === 'choose_from_list') {
            chooseFromListMethod.style.display = 'block';
            createNewMethod.style.display = 'none';
        } else {
            chooseFromListMethod.style.display = 'none';
            createNewMethod.style.display = 'none';
        }
    }

    //Be default, hide the form
    editFormContainer.style.opacity = '0';
    editFormContainer.style.height = '0';
    editFormContainer.style.display = 'none';

    //When user click show button, show the form
    showEditCompanyBtn.onclick = function() {
        document.removeEventListener('click', clickOutsideForm);
        editFormContainer.style.display = 'block';
        setTimeout(function() {
            editFormContainer.style.opacity = '1';
            editFormContainer.style.height = '100%';
            editFormContainer.style.transform = 'translateY(-500px)';               
            document.addEventListener('click', clickOutsideForm);
        }, 50);        
    }

    //Get the hide button
    const hideEditBtn = document.querySelector('#hide-editing-company');

    //Define function that hide the editing form
    function closeEditing(targetDiv) {
        targetDiv.style.opacity = '0';
        targetDiv.style.transform = 'translateY(-200px)';
        targetDiv.style.height = '0';
        setTimeout(function() {
            targetDiv.style.display = 'none';
        }, 1000);
    }

    hideEditBtn.onclick = function() {
        closeEditing(editFormContainer);
    }

    //Define a function that hide edit form when user click outside
    function clickOutside(event, targetDiv) {
        if(!targetDiv.contains(event.target)) {
            closeEditing(targetDiv);
        }
    }

    //Define event delegation
    const clickOutsideForm = (event) => {
        clickOutside(event, editFormContainer);
    }
})