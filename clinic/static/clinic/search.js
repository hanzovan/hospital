document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.form-container');
    setTimeout(function() {
        searchForm.style.transform = 'translateY(0px)';
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