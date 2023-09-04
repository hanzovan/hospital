document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    // By default the form container should be hidden
    formContainer.style.opacity = '0';
    // When page load, move the form from the top to the center of the page
    setTimeout(function() {
        formContainer.style = 'opacity: 1; transform: translateY(0);';
    }, 50);

    // For every form control, when user click into the input, add a class named focused into the parent form-group, if user click to other form control, remove the class
    let formControls = document.querySelectorAll('.form-control');
    formControls.forEach(formControl => {
        formControl.onfocus = function() {
            formControl.closest('.form-group').classList.add('focused');
        }
        formControl.onblur = function() {
            formControl.closest('.form-group').classList.remove('focused');
        }
    })
})