document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#edit-btn').onclick = function() {
        if (document.querySelector('.edit-container')) {
            document.querySelector('.edit-container').remove();
        } else {
            // Create a form that populated by the original information
            // 1st, create a container div
            const editContainer = document.createElement('div');
            editContainer.className = 'edit-container';
            document.querySelector('main').appendChild(editContainer);

            // 1.5, create a form
            const editForm = document.createElement('form');
            editForm.className = 'my-edit-form';

            editContainer.appendChild(editForm);

            // 2nd, create 2 divs, 1 for field name and 1 for field value input
            const fieldNameDiv = document.createElement('div');
            fieldNameDiv.className = 'field-name';

            const fieldValueDiv = document.createElement('div');
            fieldValueDiv.className = 'field-value';
            editForm.append(fieldNameDiv, fieldValueDiv)

            // 3rd, give the field name
            const fieldNameList = document.createElement('ul');
            fieldNameList.className = 'no-bullet';
            fieldNameList.innerHTML = `
                <li><i class="i-left">Service's name</i></li>
                <li><i class="i-left">Male price</i></li>
                <li><i class="i-left">Female price</i></li>
                <li><i class="i-left">Benefit</i></li>
                <li><i class="i-left">Description</i></li>
            `
            fieldNameDiv.appendChild(fieldNameList);

            // 4th, create the value field, and set variable for the element that contain value
            const oriName = document.querySelector('#service-name');
            const oriMalePrice = document.querySelector('#service-male-price');
            const oriFemalePrice = document.querySelector('#service-female-price');
            const oriBenefit = document.querySelector('#service-benefit');
            const oriDescription = document.querySelector('#service-description');

            const fieldValueList = document.createElement('ul');
            fieldValueList.className = 'no-bullet';
            fieldValueList.innerHTML = `
                <li><input class="service-input" id="new-service-name" type="text" value="${oriName.getAttribute('data-service_name')}"></li>
                <li><input class="service-input" id="new-service-male-price" type="number" value="${oriMalePrice.getAttribute('data-service_male_price')}"></li>
                <li><input class="service-input" id="new-service-female-price" type="number" value="${oriFemalePrice.getAttribute('data-service_female_price')}"></li>
                <li><input class="service-input" id="new-service-benefit" value="${oriBenefit.getAttribute('data-service_benefit')}"></li>
                <li><input class="service-input" id="new-service-description" value="${oriDescription.getAttribute('data-service_description')}"></li>
            `;
            fieldValueDiv.appendChild(fieldValueList);

            // 5th, create submit button for the form
            const saveBtn = document.createElement('button');
            saveBtn.className = 'btn btn-primary';
            saveBtn.innerHTML = 'Save';
            editForm.appendChild(saveBtn);

            // 6th, add Eventlistener to the form
            editForm.onsubmit = function() {
                // Get the user input
                const newName = fieldValueList.querySelector('#new-service-name').value;
                const newMalePrice = fieldValueList.querySelector('#new-service-male-price').value;
                const newFemalePrice = fieldValueList.querySelector('#new-service-female-price').value;
                const newBenefit = fieldValueList.querySelector('#new-service-benefit').value;
                const newDescription = fieldValueList.querySelector('#new-service-description').value;
                
                // send user input to the server
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
                .then(response => response.json())
                .then(() => {
                    // Modify value field in the original div as well as the appropriate data-information
                    oriName.innerHTML = newName;
                    oriMalePrice.innerHTML = newMalePrice;
                    oriFemalePrice.innerHTML = newFemalePrice;
                    oriBenefit.innerHTML = newBenefit;
                    oriDescription.innerHTML = newDescription;

                    oriName.setAttribute('data-service_name', newName);
                    oriMalePrice.setAttribute('data-service_male_price', newMalePrice);
                    oriFemalePrice.setAttribute('data-service_female_price', newFemalePrice);
                    oriBenefit.setAttribute('data-service_benefit', newBenefit);
                    oriDescription.setAttribute('data-service_description', newDescription);

                    editContainer.remove();
                })
                .catch(error => {
                    console.log(error);
                })

                return false;
            }
        }
    }
})