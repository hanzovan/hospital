document.addEventListener('DOMContentLoaded', function() {
    const editFormContainer = document.querySelector('#edit-form-container');
    editFormContainer.style.opacity = 0;
    setTimeout(function() {
        editFormContainer.style.opacity = 1;
        editFormContainer.style.transform = "translateY(0px)";
    }, 50)
})