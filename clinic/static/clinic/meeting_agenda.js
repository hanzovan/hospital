document.addEventListener('DOMContentLoaded', function() {
    //Define form and button
    const addAgendaForm = document.querySelector('#add-agenda-container');
    const showAddAgendaFormBtn = document.querySelector('#show-add-meeting-agenda-form');
    const hideAddAgendaFormBtn = document.querySelector('#hide-add-agenda-form');
    const editMeetingForm = document.querySelector('#edit-meeting-form-container');
    const showEditMeetingBtn = document.querySelector('#show-edit-meeting-form');
    const hideEditMeetingBtn = document.querySelector('#hide-edit-meeting-form');
    
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
    closingDiv(editMeetingForm);

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
    showEditMeetingBtn.onclick = function() {
        //remove old eventlistener
        document.removeEventListener('click', clickOutsideEditMeetingForm);

        editMeetingForm.style.display = 'block';
        setTimeout(function() {
            editMeetingForm.style.opacity = '1';
            editMeetingForm.style.height = '100%';
            editMeetingForm.style.transform = 'translateY(-500px)';
            document.addEventListener('click', clickOutsideEditMeetingForm);
        }, 50);
    }

    hideAddAgendaFormBtn.onclick = function() {
        closingDiv(addAgendaForm);
    }
    hideEditMeetingBtn.onclick = function() {
        closingDiv(editMeetingForm);
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
    const clickOutsideEditMeetingForm = (event) => {
        clickOutside(event, editMeetingForm);
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