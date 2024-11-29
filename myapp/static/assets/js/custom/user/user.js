// Menambahkan validasi password di sisi client dengan SweetAlert
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    const password = document.getElementById('add-password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (password !== confirmPassword) {
        e.preventDefault(); // Mencegah form untuk submit
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password dan Confirm Password tidak cocok!',
        });
    }
});

// Menangani ketika tombol edit ditekan
document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', function () {
        // Retrieve data attributes from the clicked button
        const userId = this.getAttribute('data-user-id');
        const email = this.getAttribute('data-email');
        const username = this.getAttribute('data-username');
        const firstName = this.getAttribute('data-first-name');
        const lastName = this.getAttribute('data-last-name');
        const phone = this.getAttribute('data-phone');
        const departmentId = this.getAttribute('data-department-id');
        const role = this.getAttribute('data-role');

        // Populate modal form fields with the retrieved data
        document.getElementById('edit-user-id').value = userId;
        document.getElementById('edit-email').value = email;
        document.getElementById('edit-username').value = username;
        document.getElementById('edit-first-name').value = firstName;
        document.getElementById('edit-last-name').value = lastName;
        document.getElementById('edit-phone').value = phone;
        document.getElementById('edit-department').value = departmentId;
        document.getElementById('edit-role').value = role;
    });
});

// Fungsi pencarian dengan SweetAlert feedback
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('[data-kt-user-table-filter="search"]');
    const tableRows = document.querySelectorAll('#kt_table_users tbody tr');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        let found = false;

        tableRows.forEach(row => {
            const username = row.getAttribute('data-username').toLowerCase();
            const email = row.getAttribute('data-email').toLowerCase();
            const role = row.getAttribute('data-role').toLowerCase();

            // Check if any of the fields contain the search term
            if (username.includes(searchTerm) || email.includes(searchTerm) || role.includes(searchTerm)) {
                row.style.display = '';  // Show row
                found = true;
            } else {
                row.style.display = 'none';  // Hide row
            }
        });

        // Tampilkan SweetAlert jika tidak ditemukan hasil
        if (!found && searchTerm !== '') {
            Swal.fire({
                icon: 'info',
                title: 'Not Found',
                text: 'No matching results for your search.',
            });
        }
    });
});
