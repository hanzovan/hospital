document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.user-info').forEach(info => {

        // Store the original level
        const originalLevel = info.querySelector('.level').value;

        info.querySelector('.level').onchange = function() {
            // if user does have right, confirm then change the selection option with the user interface
            if (modify_right) {
                const confirmMessage = 'Are you really want to set new level for this user?';
                const isConfirmed = confirm(confirmMessage);            

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
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    
                } else {
                    this.value = originalLevel;
                }          
            } else {
                this.value = originalLevel;
                alert('You do not have the right to modify this');
            }              
        }    
    })
})