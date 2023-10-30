document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    // form was hide by default
    formContainer.style.opacity = '0';

    // After 50 misec, the form appear and move to center
    setTimeout(function() {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 50);

    // Get the all the form controls
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        // When a control was on focus, add a class to that control named focused
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }

        // When user focus on other control, remove that class
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })
})