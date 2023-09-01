// Using JQuery, inconsistently create a class that make form-label to move, but it won't have effect when the page first load
// $(function() {
//     $(".form-control").on("focus", function() {
//         $(this).parents(".form-group").addClass("focused");
//     })
//     $(".form-control").on("blur", function() {
//         $(this).parents(".form-group").removeClass("focused");
//     })
// }) 

// When DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Move the form from top to center
    let formContainer = document.querySelector('.form-container');
    // By default the formContainer should be hidden
    formContainer.style.opacity = '0';

    setTimeout(function() {
        formContainer.style = 'opacity: 1; transform: translateY(0);';
    }, 50)

    // Using pure JavaScript, When user click on a input, move the label from left to right
    let formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add('focused');
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove('focused');
        }
    })
})
