document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("kt_modal_add_gaji_form");
    const submitButton = document.getElementById("submit_button");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting normally (page refresh)

        // Show spinner on the button while waiting
        submitButton.disabled = true;
        submitButton.querySelector(".indicator-label").style.display = "none"; // Hide label
        submitButton.querySelector(".indicator-progress").style.display = "inline-block"; // Show spinner

        const formData = new FormData(form);

        // Use AJAX to send data to the server
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Expecting JSON response
        .then(data => {
            submitButton.disabled = false; // Disable spinner after response
            submitButton.querySelector(".indicator-label").style.display = "inline-block"; // Show label again
            submitButton.querySelector(".indicator-progress").style.display = "none"; // Hide spinner

            if (data.success) {
                // Show SweetAlert success if successful
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Gaji berhasil ditambahkan!',
                }).then(() => {
                    location.reload(); // Reload page after successfully adding the data
                });
            } else {
                // Show SweetAlert error if failed
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Gaji gagal ditambahkan!',
                });
            }
        })
        .catch(error => {
            submitButton.disabled = false; // Disable spinner if error occurs
            submitButton.querySelector(".indicator-label").style.display = "inline-block"; // Show label again
            submitButton.querySelector(".indicator-progress").style.display = "none"; // Hide spinner

            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan',
                text: 'Terjadi kesalahan saat mengirim data.',
            });
        });
    });
});


//modal edit
document.addEventListener("DOMContentLoaded", function () {
    const editModal = document.getElementById('kt_modal_edit_gaji');

    editModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Button that triggered the modal

        // Get data attributes from the button
        const gajiId = button.getAttribute('data-id');
        const tanggal = button.getAttribute('data-tanggal');
        const uraianId = button.getAttribute('data-uraian-id');  
        const jabatanId = button.getAttribute('data-jabatan-id');
        const qty = button.getAttribute('data-qty');
        const satuan = button.getAttribute('data-satuan');
        const nilai = button.getAttribute('data-nilai');
        const statusGaji = button.getAttribute('data-status-gaji');

        // Populate the modal fields with the retrieved data
        const modalIdField = editModal.querySelector('#edit_gaji_id');
        const modalTanggalField = editModal.querySelector('#edit_tanggal');
        const modalUraianField = editModal.querySelector('#edit_uraian');
        const modalJabatanField = editModal.querySelector('#edit_jabatan');
        const modalQtyField = editModal.querySelector('#edit_qty');
        const modalSatuanField = editModal.querySelector('#edit_satuan');
        const modalNilaiField = editModal.querySelector('#edit_nilai');
        const modalStatusGajiField = editModal.querySelector('#edit_status_gaji');

        modalIdField.value = gajiId;
        modalTanggalField.value = tanggal;
        modalUraianField.value = uraianId;
        modalJabatanField.value = jabatanId;
        modalQtyField.value = qty;
        modalSatuanField.value = satuan;
        modalNilaiField.value = nilai;
        modalStatusGajiField.value = statusGaji;
    });

    // Submit form with AJAX
    const form = document.getElementById("kt_modal_edit_gaji_form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.querySelector(".indicator-label").style.display = "none";
        submitButton.querySelector(".indicator-progress").style.display = "inline-block";

        const formData = new FormData(form); // Create a FormData object from the form

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                submitButton.disabled = false;
                submitButton.querySelector(".indicator-label").style.display = "inline-block";
                submitButton.querySelector(".indicator-progress").style.display = "none";

                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: data.message,
                    }).then(() => {
                        location.reload();  // Reload page after success
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    });
                }
            })
            .catch(error => {
                submitButton.disabled = false;
                submitButton.querySelector(".indicator-label").style.display = "inline-block";
                submitButton.querySelector(".indicator-progress").style.display = "none";

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Terjadi kesalahan saat mengupdate data gaji. Silakan coba lagi.',
                });
                console.error('Update error:', error);
            });
    });
});





// delete
document.addEventListener("DOMContentLoaded", function () {
    window.confirmDelete = function(gajiId) {
        Swal.fire({
            title: 'Apa kamu yakin?',
            text: "Ini akan menghapus data gaji tersebut!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                // Get the form for deletion
                const form = document.getElementById("deleteForm" + gajiId);
                const formData = new FormData(form); // Prepare form data for CSRF and ID
                formData.append('gaji_id', gajiId); // Manually add the 'gaji_id' to the form data

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

document.addEventListener('DOMContentLoaded', function () {
    const statusSelect = document.getElementById('edit_status_gaji');

    // Loop through all the options inside the select dropdown
    Array.from(statusSelect.options).forEach(option => {
        // Check the value of each option and apply colors based on that
        if (option.value === 'PENDING') {
            option.style.color = 'orange';  // Apply orange color for PENDING
        } else if (option.value === 'APPROVED') {
            option.style.color = 'green';   // Apply green color for APPROVED
        } else if (option.value === 'REJECTED') {
            option.style.color = 'red';     // Apply red color for REJECTED
        }
    });
});


$(document).ready(function() {
    $('#edit_status_gaji').select2({
        templateResult: function(state) {
            if (!state.id) { return state.text; }
            var $state = $('<span class="status-' + state.id.toLowerCase() + '">' + state.text + '</span>');
            return $state;
        }
    });
});
