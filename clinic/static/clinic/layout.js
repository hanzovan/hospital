document.addEventListener('DOMContentLoaded', function() {
    // If there's message in alert bar, hide it after a short time
    hideMessage();
    function hideMessage() {
        const yay_message = document.querySelector('.alert-success');
        const nay_message = document.querySelector('.alert-danger');
        if (yay_message || nay_message) {
            setTimeout(function() {
                document.querySelector('header').style.animationPlayState = 'running';
            }, 2000)            
            document.querySelector('header').addEventListener('animationend', function() {
                document.querySelector('header').innerHTML = '';
            })
        }
    }
    // Check the user right, if he/she is legit for read user management page, create a link in the dropdown menu
    fetch('/check_right', {
        method: 'POST',
        body: JSON.stringify({
            'right': 'read_user_right'
        })
    })
    .then(response => response.json())
    .then(data => {
        const result = data.check_result;

        // If user has the right, create the link
        if (result) {
            let i = document.createElement('li');
            let j = document.createElement('a');
            j.className = 'dropdown-item';
            j.onclick = function() {
                window.location.href = '/authorize';
            }
            j.style.cursor = 'pointer';
            j.innerHTML = 'Manage users';
            i.append(j);

            // Insert to the first row inside of the menu
            const menu = document.querySelector('#user-dropdown-menu');
            menu.insertBefore(i, menu.firstChild);
        }
    })
    .catch(error => {
        console.log(error);
    })
})