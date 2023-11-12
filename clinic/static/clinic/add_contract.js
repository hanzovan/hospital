document.addEventListener('DOMContentLoaded', function() {
    // When page load, start to move the form from top to center
    const formContainer = document.querySelector('.form-container');
    formContainer.style.opacity = '0';
    setTimeout(function() {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 50);

    // When user click on an input field, show the label
    const Controls = document.querySelectorAll('.form-control');
    Controls.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })
})