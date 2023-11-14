document.addEventListener('DOMContentLoaded', function() {
    // By default hide the form, then slowly let it appear and moving to center
    const theForm = document.querySelector('.form-container');
    theForm.style.opacity = '0';

    // After a timer, the form reappear
    setTimeout(function() {
        theForm.style.opacity = '1';
        theForm.style.transform = 'translateY(0)';
    }, 50);

    // Get all form control
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })

    // Get the add representative method select
    const addRepMethod = document.querySelector('#add_representative_method');

    // Get the div of 2 methods
    const createNewDiv = document.querySelector('#create-new-method');
    const chooseFromListDiv = document.querySelector('#choose-from-list-method');

    // By default both of the divs were hidden
    createNewDiv.style.display = 'none';
    chooseFromListDiv.style.display = 'none';

    // When user choose a method, show the appropriate div
    addRepMethod.onchange = function() {
        if (this.value === 'create_new') {
            createNewDiv.style.display = 'block';
            chooseFromListDiv.style.display = 'none';
        } else if (this.value === 'choose_from_list') {
            chooseFromListDiv.style.display = 'block';
            createNewDiv.style.display = 'none';
        } else {
            chooseFromListDiv.style.display = 'none';
            createNewDiv.style.display = 'none';
        }
    }
})