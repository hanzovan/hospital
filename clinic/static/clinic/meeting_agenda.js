document.addEventListener('DOMContentLoaded', function() {
    //Define form and button
    const addAgendaForm = document.querySelector('#add-agenda-container');
    const showAddAgendaFormBtn = document.querySelector('#show-add-meeting-agenda-form');
    const hideAddAgendaFormBtn = document.querySelector('#hide-add-agenda-form');
    
    //By default, the form was hidden
    function closingDiv(targetDiv) {
        targetDiv.style.opacity = '0';
        targetDiv.style.transform = 'translateY(-200px)';
        targetDiv.style.height = '0';
        setTimeout(function() {
            targetDiv.style.display = 'none';
        }, 1000);
    }
    closingDiv(addAgendaForm);

    showAddAgendaFormBtn.onclick = function() {
        //Remove eventlistener
        document.removeEventListener('click', clickOutsideAddAgendaForm);

        addAgendaForm.style.display = 'block';
        setTimeout(function() {
            addAgendaForm.style.opacity = '1';
            addAgendaForm.style.height = '100%';
            addAgendaForm.style.transform = 'translateY(-500px)';
            document.addEventListener('click', clickOutsideAddAgendaForm);
        }, 50);
    }

    hideAddAgendaFormBtn.onclick = function() {
        closingDiv(addAgendaForm);
    }

    //Define function that hide the form when user click outside
    function clickOutside(event, targetDiv) {
        if (!targetDiv.contains(event.target)) {
            closingDiv(targetDiv);
        }
    }
    //Event delegation
    const clickOutsideAddAgendaForm = (event) => {
        clickOutside(event, addAgendaForm);
    }

    //Add effect to label of add agenda form
    addAgendaForm.querySelectorAll('.form-control').forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })
})