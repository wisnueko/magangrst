





//edit modal
document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll("button[data-bs-target='#kt_modal_edit_user']");
    editButtons.forEach(button => {
        button.addEventListener("click", function () {
            const kategoryId = button.getAttribute("data-id");
            const kategoryNama = button.getAttribute("data-nama");
            const departementId = button.getAttribute("data-department-id");

            // Set the values in the modal form fields
            document.getElementById("edit-user-id").value = kategoryId;
            document.getElementById("edit-nama").value = kategoryNama;
            document.getElementById("edit-department").value = departementId;
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Select all forms with the class 'delete-kategory-form'
    const deleteForms = document.querySelectorAll(".delete-kategory-form");

    deleteForms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();  // Prevent immediate form submission

            // Show SweetAlert confirmation dialog
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit();  // Submit the form if user confirms
                }
            });
        });
    });
});
