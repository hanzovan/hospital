document.addEventListener('DOMContentLoaded', function() {
    // Define form and button
    const editForm = document.querySelector('#edit-contract-form-container');
    const showEditingBtn = document.querySelector('#show-editing');
    const hideEditingBtn = document.querySelector('#hide-editing');

    // By default, the form should be hidden
    editForm.style.opacity = '0';

    // When user click the showEditing button, the form should appear, clicking it again should hide it again
    showEditingBtn.onclick = function() {
        if (editForm.style.opacity === '0') {
            editForm.style.opacity = '1';
            editForm.style.transform = 'translateY(50px)';
        } else {
            editForm.style.opacity = '0';
            editForm.style.transform = 'translateY(0)';
        }
    }
    
    hideEditingBtn.onclick = function() {
        editForm.style.opacity = '0';
        editForm.style.transform = 'translateY(0)';
    }
})