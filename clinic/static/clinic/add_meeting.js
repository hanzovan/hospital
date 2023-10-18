document.addEventListener('DOMContentLoaded', function() {
    const theForm = document.querySelector('.form-container');
    theForm.style.opacity = '0';

    setTimeout(function() {
        theForm.style.opacity = '1';
        theForm.style.transform = 'translateY(0)';
    }, 50);
})