document.addEventListener('DOMContentLoaded', function() {
    // Define object in service detail page
    const editBtn = document.querySelector('#edit-btn');
    const editBtnContainer = document.querySelector('#edit-btn-container');
    const removeBtn = document.querySelector('#remove-service-btn');
    const removeFormContainer = document.querySelector('#remove-service-form-container');

    // by default hide the editBtn, remove btn
    editBtnContainer.style.display = 'none';
    removeFormContainer.style.display = 'none';

    // User an HTTP request to check if user is valid for edit service
    fetch('/check_right', {
        method: 'POST',
        body: JSON.stringify({
            'right': 'modify_service_info'
        })        
    })
    .then(response => response.json())
    .then(data => {
        const result = data.check_result;
        
        // If user does not have right, hide the button 
        if (result) {
            editBtnContainer.style.display = 'block';
            removeFormContainer.style.display = 'block';
        } else {
            editBtnContainer.style.display = 'none';
            removeFormContainer.style.display = 'none';
        }
    })
    .catch(error => {
        console.log(error);
    })
    
    editBtn.onclick = function() {
        // If form already created, delete it, if not exist, create it
        if (document.querySelector('#edit-container')) {
            document.querySelector('#edit-container').remove();
        } else {
            // Create general div
            const editContainer = document.createElement('div');
            editContainer.id = 'edit-container';
            editContainer.className = 'general';
            document.querySelector('#edit-view').appendChild(editContainer);

            // Create form container
            const formContainer = document.createElement('div');
            formContainer.className = 'form-container';
            editContainer.appendChild(formContainer);

            // Add a button for user to close form
            const xBtn = document.createElement('button');
            xBtn.className = 'closing-btn';
            xBtn.innerHTML = 'X';
            xBtn.onclick = function() {
                formContainer.style.opacity = '0';
                formContainer.style.transform = 'translateY(-200px)';
            }
            formContainer.appendChild(xBtn);

            // Create the form
            const editForm = document.createElement('form');
            editForm.id = 'edit-service-form';
            formContainer.appendChild(editForm);

            // Create container inside the form
            const container = document.createElement('div');
            container.className = 'container';
            editForm.appendChild(container);

            // Get the original values
            const oriName = document.querySelector('#service-name');
            const oriMalePrice = document.querySelector('#service-male-price');
            const oriFemalePrice = document.querySelector('#service-female-price');
            const oriBenefit = document.querySelector('#service-benefit');
            const oriDescription = document.querySelector('#service-description');

            // Display all inputs and display all original values
            container.innerHTML = `
                <h1>Edit Service Info</h1>
                <div class="form-group">
                    <label for="new-service-name" class="form-label">Service Name</label>
                    <input id="new-service-name" class="form-control" value="${oriName.getAttribute('data-service_name')}">
                </div>
                <div class="form-group">
                    <label for="new-service-male-price" class="form-label">Male Price</label>
                    <input id="new-service-male-price" class="form-control" value="${oriMalePrice.getAttribute('data-service_male_price') === 'None' ? '' : oriMalePrice.getAttribute('data-service_male_price')}">
                </div>
                <div class="form-group">
                    <label for="new-service-female-price" class="form-label">Female Price</label>
                    <input id="new-service-female-price" class="form-control" value="${oriFemalePrice.getAttribute('data-service_female_price') === 'None' ? '' : oriFemalePrice.getAttribute('data-service_female_price')}">
                </div>
                <div class="form-group">
                    <label for="new-service-benefit" class="form-label">Benefit</label>
                    <input id="new-service-benefit" class="form-control" value="${oriBenefit.getAttribute('data-service_benefit')}">
                </div>
                <div class="form-group">
                    <label for="new-service-description" class="form-label">Description</label>
                    <input id="new-service-description" class="form-control" value="${oriDescription.getAttribute('data-service_description')}">
                </div>
                <button>Save Change</button>
            `
            // Effect for label to move from left to the the center of the form
            const formControls = container.querySelectorAll('.form-control');
            formControls.forEach(control => {
                control.onfocus = function() {
                    this.closest('.form-group').classList.add('focused');
                }
                control.onblur = function() {
                    this.closest('.form-group').classList.remove('focused');
                }
            })

            // When user submit form, send HTTP request to server
            editForm.onsubmit = function() {
                // Get the value from user input
                const newName = container.querySelector('#new-service-name').value;
                const newMalePrice = container.querySelector('#new-service-male-price').value;
                const newFemalePrice = container.querySelector('#new-service-female-price').value;
                const newBenefit = container.querySelector('#new-service-benefit').value;
                const newDescription = container.querySelector('#new-service-description').value;

                // If non-essential inputs were left blank, get the None value
                const displayMalePrice = newMalePrice === '' ? 'None' : newMalePrice;
                const displayFemalePrice = newFemalePrice === '' ? 'None': newFemalePrice;
                const displayBenefit = newBenefit === '' ? '' : newBenefit;
                const displayDescription = newDescription === '' ? '' : newDescription;

                // Send values to server via HTTP request
                fetch(`/service_detail/${document.querySelector('#original-value').getAttribute('data-service_id')}`, {
                    method: 'POST',
                    body: JSON.stringify({
                        'new-name': newName,
                        'new-male-price': newMalePrice,
                        'new-female-price': newFemalePrice,
                        'new-benefit': newBenefit,
                        'new-description': newDescription
                    })
                })
                .then(response => {
                    // If success, modify original value in the page
                    if (response.status === 200) {
                        oriName.innerHTML = `<strong>${newName}</strong>`;
                        oriName.setAttribute('data-service_name', newName);

                        oriMalePrice.innerHTML = `<strong>${displayMalePrice}</strong>`;
                        oriMalePrice.setAttribute('data-service_male_price', newMalePrice);

                        oriFemalePrice.innerHTML = `<strong>${displayFemalePrice}</strong>`;
                        oriFemalePrice.setAttribute('data-service_female_price', newFemalePrice);
                        
                        oriBenefit.innerHTML = `<strong>${displayBenefit}</strong>`;
                        oriBenefit.setAttribute('data-service_benefit', newBenefit);

                        oriDescription.innerHTML = `<strong>${displayDescription}</strong>`;
                        oriDescription.setAttribute('data-service_description', newDescription);

                        document.querySelector('#service-page-title').innerHTML = newName;

                        editContainer.remove();
                    } else if (response.status === 403) {
                        window.location.href = '/';
                    } else {
                        console.error(error);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                
                return false;
            }
            formContainer.style.opacity = '0';
            setTimeout(function() {
                formContainer.style.opacity = '1';
                formContainer.style.transform = 'translateY(50px)';
            }, 50);
        }
    }    
})