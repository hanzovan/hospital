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
})