document.addEventListener('DOMContentLoaded', function() {
    //If meeting does not end yet, and user has editing permission, manipulate the form as follow
    if (isMeetingEnd === false && userHasPermission) {
        //Define form and button
        const addAgendaForm = document.querySelector('#add-agenda-container');
        const showAddAgendaFormBtn = document.querySelector('#show-add-meeting-agenda-form');
        const hideAddAgendaFormBtn = document.querySelector('#hide-add-agenda-form');
        const editMeetingForm = document.querySelector('#edit-meeting-form-container');
        const showEditMeetingBtn = document.querySelector('#show-edit-meeting-form');
        const hideEditMeetingBtn = document.querySelector('#hide-edit-meeting-form');
        const endMeetingForm = document.querySelector('#end-meeting-form-container');
        const showEndMeetingFormBtn = document.querySelector('#show-end-meeting-form');
        const hideEndMeetingFormBtn = document.querySelector('#hide-end-meeting-form');
        
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
        closingDiv(endMeetingForm);        

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
        showEndMeetingFormBtn.onclick = function() {
            // Remove old eventlistener
            document.removeEventListener('click', clickOutsideEndMeetingForm);

            endMeetingForm.style.display = 'block';
            setTimeout(function() {
                endMeetingForm.style.opacity = '1';
                endMeetingForm.style.height = '100%';
                endMeetingForm.style.transform = 'translateY(-500px)';
                document.addEventListener('click', clickOutsideEndMeetingForm);
            }, 50);
        }

        hideAddAgendaFormBtn.onclick = function() {
            closingDiv(addAgendaForm);
        }
        hideEditMeetingBtn.onclick = function() {
            closingDiv(editMeetingForm);
        }
        hideEndMeetingFormBtn.onclick = function() {
            closingDiv(endMeetingForm);
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
        const clickOutsideEndMeetingForm = (event) => {
            clickOutside(event, endMeetingForm);
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
    }    
})