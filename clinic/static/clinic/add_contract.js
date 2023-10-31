document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    formContainer.style.opacity = '0';
    setTimeout(function() {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 50);
})