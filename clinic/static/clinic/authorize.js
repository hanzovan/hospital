document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.user-info').forEach(info => {

        // Store the original level
        const originalLevel = info.querySelector('.level').value;

        info.querySelector('.level').onchange = function() {
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
        }
    
    })
})