document.addEventListener('DOMContentLoaded', function() {
    const removeCompanyFormContainer = document.querySelector('#remove-company-form-container');
    
    //By default, the button should be hidden
    removeCompanyFormContainer.style.display = 'none';

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
        } else {
            removeCompanyFormContainer.style.display = 'none';
        }
    })
    .catch(error => {
        console.log(error);
    })
})