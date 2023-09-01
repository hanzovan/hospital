// Using JQuery which was shorter, but unreliable execution (when first load the website, the class focused was not added)
// $(function() {
//     $(".form-control").on("focus", function() {
//         $(this).parents(".form-group").addClass("focused");
//     })
//     $(".form-control").on("blur", function() {
//         $(this).parents(".form-group").removeClass("focused");
//     })
// })

// Using JavaScript, longer but more reliable
document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    // Be default the formContainer should be hidden
    formContainer.style.opacity = '0';

    setTimeout(function() {
        formContainer.style = 'opacity: 1; transform: translateY(0);';
    }, 50);


    const formControl = document.querySelectorAll('.form-control');
    formControl.forEach(control => {
        control.onfocus = function() {
            this.closest('.form-group').classList.add("focused");
        }
        control.onblur = function() {
            this.closest('.form-group').classList.remove("focused");
        }
    })
})