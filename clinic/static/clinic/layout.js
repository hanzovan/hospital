document.addEventListener('DOMContentLoaded', function() {
    hideMessage();
    function hideMessage() {
        const yay_message = document.querySelector('.alert-success');
        const nay_message = document.querySelector('.alert-danger');
        if (yay_message || nay_message) {
            setTimeout(function() {
                document.querySelector('header').style.animationPlayState = 'running';
            }, 1000)            
            document.querySelector('header').addEventListener('animationend', function() {
                document.querySelector('header').innerHTML = '';
            })
        }
    }
})