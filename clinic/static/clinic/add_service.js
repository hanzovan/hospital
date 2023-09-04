document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    // By default hide the formContainer
    formContainer.style.opacity = '0';

    // Right after the page, load, start to move the form container to the center of the page
    setTimeout(function() {
        formContainer.style = 'opacity: 1; transform: translateY(0);';
    }, 50)

    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(formControl => {
        formControl.onfocus = function() {
            formControl.closest('.form-group').classList.add('focused');
        }
        formControl.onblur = function() {
            formControl.closest('.form-group').classList.remove('focused');
        }
    })
})