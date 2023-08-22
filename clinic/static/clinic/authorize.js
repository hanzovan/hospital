document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.user-info').forEach(info => {

        info.querySelector('.level').onchange = function() {
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
        }
    
    })
})

// Add confirm before change select