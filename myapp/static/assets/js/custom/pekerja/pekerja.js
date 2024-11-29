document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("kt_modal_add_pegawai_form");
    const submitButton = document.getElementById("submit_button");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Mencegah form submit biasa (refresh halaman)

        // Menampilkan spinner pada tombol saat menunggu
        submitButton.disabled = true;

        const formData = new FormData(form);

        // Menggunakan AJAX untuk mengirim data ke server
        fetch(form.action, {
            method: 'POST',
            body: formDataa
        })
        .then(response => response.json()) // Mengharapkan response JSON
        .then(data => {
            submitButton.disabled = false; // Menonaktifkan spinner setelah response

            if (data.success) {
                // Menampilkan SweetAlert success jika berhasil
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Pegawai berhasil ditambahkan!',
                }).then(() => {
                    location.reload(); // Reload halaman setelah berhasil menambah data
                });
            } else {
                // Menampilkan SweetAlert error jika gagal
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Pegawai gagal ditambahkan!',
                });
            }
        })
        .catch(error => {
            submitButton.disabled = false; // Menonaktifkan spinner jika ada error
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Terjadi kesalahan saat mengirim data.',
            });
        });
    });
});

//modal edit
document.addEventListener("DOMContentLoaded", function() {
    // Listen for when the Edit Pegawai modal is shown
    const editModal = document.getElementById('kt_modal_edit_pegawai');

    // Populate the modal fields when the modal is triggered by the Edit button
    editModal.addEventListener('show.bs.modal', function(event) {
        // Get the button that triggered the modal
        const button = event.relatedTarget;

        // Extract the data attributes from the button
        const pegawaiId = button.getAttribute('data-id');
        const pegawaiName = button.getAttribute('data-name');
        const pegawaiJabatan = button.getAttribute('data-jabatan');
        
        // Populate the modal fields with the data
        const modalIdField = editModal.querySelector('#edit_pegawai_id');
        const modalNameField = editModal.querySelector('#edit_pegawai_name');
        const modalJabatanField = editModal.querySelector('#edit_jabatan');

        modalIdField.value = pegawaiId;  // Set the hidden input for pegawai ID
        modalNameField.value = pegawaiName;  // Set the input for pegawai name
        modalJabatanField.value = pegawaiJabatan;  // Set the select for jabatan
    });

    // Handle the form submission via AJAX
    const form = document.getElementById("kt_modal_edit_pegawai_form");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();  // Prevent the default form submission

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;  // Disable the button to prevent multiple submissions

        submitButton.querySelector(".indicator-label").style.display = "none"; // Hide the label
        submitButton.querySelector(".indicator-progress").style.display = "inline-block"; // Show the spinner

        const formData = new FormData(form);  // Prepare form data for AJAX request

        // Send the AJAX request
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())  // Parse JSON response from the server
        .then(data => {
            submitButton.disabled = false;  // Re-enable the button after response
            submitButton.querySelector(".indicator-label").style.display = "inline-block"; // Show label again
            submitButton.querySelector(".indicator-progress").style.display = "none"; // Hide spinner

            // Display SweetAlert based on the response
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: data.message,  // Message from the server response
                }).then(() => {
                    location.reload(); // Reload the page after success
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: data.message,  // Error message from the server response
                });
            }
        })
        .catch(error => {
            submitButton.disabled = false;
            submitButton.querySelector(".indicator-label").style.display = "inline-block";
            submitButton.querySelector(".indicator-progress").style.display = "none";

            // Handle network or other errors
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Terjadi kesalahan saat mengupdate pegawai. Silakan coba lagi.',
            });
            console.error('Update error:', error); // Log error to console
        });
    });
});




document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function(pegawaiId) {
        Swal.fire({
            title: 'Apa kamu yakin?',
            text: "Ini akan menghapus karyawan tersebut!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                // Get the form for deletion
                const form = document.getElementById("deleteForm" + pegawaiId);
                const formData = new FormData(form); // Prepare form data for CSRF and ID

                // Optional: Disable the button and show a spinner
                const deleteButton = form.querySelector('button[type="button"]');
                deleteButton.disabled = true;

                // Send the AJAX request
                fetch(form.action, {
                    method: 'POST', // Ensure POST method to handle CSRF token correctly
                    body: formData
                })
                .then(response => response.json()) // Parse the JSON response from the server
                .then(data => {
                    deleteButton.disabled = false; // Re-enable button after response

                    if (data.success) {
                        // Show success SweetAlert and reload
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: data.message,  // Show the message from the response
                        }).then(() => {
                            location.reload(); // Reload page on success
                        });
                    } else {
                        // Show error SweetAlert
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message,  // Show the error message from the response
                        });
                    }
                })
                .catch(error => {
                    deleteButton.disabled = false; // Re-enable button if there was an error

                    // Handle network or other errors
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Terjadi kesalahan saat menghapus data. Silakan coba lagi.',
                    });
                    console.error('Delete error:', error); // Log error to console
                });
            }
        });
    };
});



// search
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('[data-kt-user-table-filter="search"]');
    const tableRows = document.querySelectorAll('#kt_table_users tbody tr');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        let found = false;

        tableRows.forEach(row => {
            const name = row.getAttribute('data-name') ? row.getAttribute('data-name').toLowerCase() : '';
            const jabatan = row.getAttribute('data-jabatan') ? row.getAttribute('data-jabatan').toLowerCase() : '';

            // Check if any of the fields contain the search term
            if (name.includes(searchTerm) || jabatan.includes(searchTerm)) {
                row.style.display = '';  // Show row
                found = true;
            } else {
                row.style.display = 'none';  // Hide row
            }
        });

        // Display SweetAlert if no results are found
        if (!found && searchTerm !== '') {
            Swal.fire({
                icon: 'info',
                title: 'Not Found',
                text: 'No matching results for your search.',
            });
        }
    });
});

