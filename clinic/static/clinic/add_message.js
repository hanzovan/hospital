document.addEventListener('DOMContentLoaded', function() {
    // Get the form container, then let it move from the top to the center of the page
    const formContainer = document.querySelector('.form-container');

    // By default, hide the formContainer
    formContainer.style.opacity = '0';

    // When the page load, start a short timer then move it to the center of the page
    setTimeout(function() {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 50);


    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })
})
