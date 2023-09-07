document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.user-info').forEach(info => {
        // Store the original level
        const originalLevel = info.querySelector('.level').value;        
        localStorage.setItem(`oriLevel-${info.id}`, originalLevel);

        info.querySelector('.level').onchange = function() {
            // Send a request to the server to check if the user has the right
            fetch('/check_right', {
                method: 'POST',
                body: JSON.stringify({
                    'right': 'modify_user_right'
                })
            })
            .then(response => response.json())
            .then(data => {
                const result = data.check_result;

                // If user has the right
                if (result) {
                    // Confirm that if user really want to set new level for that user
                    const confirmMessage = 'Are you really want to set new level for this user?';
                    const isConfirmed = confirm(confirmMessage);            

                    // If user confirm to change
                    if (isConfirmed) {
                        const newLevel = this.value;
                        const chosenUserID = info.id.slice(4);

                        fetch('authorize', {
                            method: 'POST',
                            body: JSON.stringify({
                                'new_level': newLevel,
                                'chosen_user_id': chosenUserID
                            })
                        })
                        .then(response => response.json())                       
                        .then(() => {
                            info.querySelector('.current-level').innerHTML = newLevel;
                            
                            // Set originalLevel to the new value
                            localStorage.setItem(`oriLevel-${info.id}`, newLevel)
                        })                    
                        .catch(error => {
                            console.log(error);
                        })
                    
                    // If user confirm not to change
                    } else {
                        this.value = localStorage.getItem(`oriLevel-${info.id}`);
                    } 
                // If user does not have right         
                } else {
                    this.value = localStorage.getItem(`oriLevel-${info.id}`);                    
                    alert('You do not have the right to modify this');
                }
            })       
        }    
    })
})