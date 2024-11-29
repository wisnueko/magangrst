"use strict";

var KTUsersList = (function () {
    var dataTable, baseToolbar, selectedToolbar, selectedCount;
    var usersTable = document.getElementById("kt_table_users");

    // Delete row functionality
    var handleDeleteRow = () => {
        usersTable.querySelectorAll('[data-kt-users-table-filter="delete_row"]').forEach((deleteButton) => {
            deleteButton.addEventListener("click", function (event) {
                event.preventDefault();
                const row = event.target.closest("tr");
                const userName = row.querySelectorAll("td")[1].querySelectorAll("a")[1].innerText;

                Swal.fire({
                    text: "Are you sure you want to delete " + userName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary",
                    },
                }).then((result) => {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + userName + "!",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn fw-bold btn-primary" },
                        }).then(() => {
                            dataTable.row($(row)).remove().draw();
                        }).then(() => {
                            updateSelectedCount();
                        });
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: userName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn fw-bold btn-primary" },
                        });
                    }
                });
            });
        });
    };

    // Handle toolbar and selected rows
    var handleSelection = () => {
        const checkboxes = usersTable.querySelectorAll('[type="checkbox"]');
        baseToolbar = document.querySelector('[data-kt-user-table-toolbar="base"]');
        selectedToolbar = document.querySelector('[data-kt-user-table-toolbar="selected"]');
        selectedCount = document.querySelector('[data-kt-user-table-select="selected_count"]');
        const deleteSelectedButton = document.querySelector('[data-kt-user-table-select="delete_selected"]');

        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("click", function () {
                setTimeout(() => updateSelectedCount(), 50);
            });
        });

        deleteSelectedButton.addEventListener("click", function () {
            Swal.fire({
                text: "Are you sure you want to delete selected customers?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, delete!",
                cancelButtonText: "No, cancel",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary",
                },
            }).then((result) => {
                if (result.value) {
                    Swal.fire({
                        text: "You have deleted all selected customers!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn fw-bold btn-primary" },
                    }).then(() => {
                        checkboxes.forEach((checkbox) => {
                            if (checkbox.checked) {
                                dataTable.row($(checkbox.closest("tbody tr"))).remove().draw();
                            }
                        });
                        usersTable.querySelectorAll('[type="checkbox"]')[0].checked = false;
                    }).then(() => {
                        updateSelectedCount();
                        handleSelection();
                    });
                } else if (result.dismiss === "cancel") {
                    Swal.fire({
                        text: "Selected customers were not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn fw-bold btn-primary" },
                    });
                }
            });
        });
    };

    // Update selected count
    const updateSelectedCount = () => {
        const checkboxes = usersTable.querySelectorAll('tbody [type="checkbox"]');
        let selected = 0;
        let anyChecked = false;

        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selected++;
                anyChecked = true;
            }
        });

        if (anyChecked) {
            selectedCount.innerHTML = selected;
            baseToolbar.classList.add("d-none");
            selectedToolbar.classList.remove("d-none");
        } else {
            baseToolbar.classList.remove("d-none");
            selectedToolbar.classList.add("d-none");
        }
    };

    // Initialize DataTable and add event listeners
    return {
        init: function () {
            if (usersTable) {
                // Process table rows
                usersTable.querySelectorAll("tbody tr").forEach((row) => {
                    const cells = row.querySelectorAll("td");
                    const timeCell = cells[3].innerText.toLowerCase();
                    let timeAgo = 0;
                    let timeUnit = "minutes";

                    if (timeCell.includes("yesterday")) {
                        timeAgo = 1;
                        timeUnit = "days";
                    } else if (timeCell.includes("mins")) {
                        timeAgo = parseInt(timeCell.replace(/\D/g, ""));
                        timeUnit = "minutes";
                    } else if (timeCell.includes("hours")) {
                        timeAgo = parseInt(timeCell.replace(/\D/g, ""));
                        timeUnit = "hours";
                    } else if (timeCell.includes("days")) {
                        timeAgo = parseInt(timeCell.replace(/\D/g, ""));
                        timeUnit = "days";
                    } else if (timeCell.includes("weeks")) {
                        timeAgo = parseInt(timeCell.replace(/\D/g, ""));
                        timeUnit = "weeks";
                    }

                    const formattedDate = moment().subtract(timeAgo, timeUnit).format();
                    cells[3].setAttribute("data-order", formattedDate);

                    const dateCell = moment(cells[5].innerHTML, "DD MMM YYYY, LT").format();
                    cells[5].setAttribute("data-order", dateCell);
                });

                // Initialize DataTable
                dataTable = $(usersTable).DataTable({
                    info: false,
                    order: [],
                    pageLength: 10,
                    lengthChange: false,
                    columnDefs: [
                        { orderable: false, targets: 0 },  // Checkbox or actions
                        { orderable: false, targets: 4 },  // Actions
                        { orderable: false, targets: 5 },  // Created column
                        { orderable: false, targets: 6 },  // Last login
                    ],
                }).on("draw", function () {
                    handleSelection();
                    handleDeleteRow();
                    updateSelectedCount();
                });

                // Search filter
                document.querySelector('[data-kt-user-table-filter="search"]').addEventListener("keyup", function (event) {
                    dataTable.search(event.target.value).draw();
                });

                // Reset filter
                document.querySelector('[data-kt-user-table-filter="reset"]').addEventListener("click", function () {
                    document.querySelector('[data-kt-user-table-filter="form"]').querySelectorAll("select").forEach((select) => {
                        $(select).val("").trigger("change");
                    });
                    dataTable.search("").draw();
                });

                handleDeleteRow();

                // Filter form submission
                (() => {
                    const filterForm = document.querySelector('[data-kt-user-table-filter="form"]');
                    const filterButton = filterForm.querySelector('[data-kt-user-table-filter="filter"]');
                    const selectFilters = filterForm.querySelectorAll("select");

                    filterButton.addEventListener("click", function () {
                        let filterValue = "";
                        selectFilters.forEach((select, index) => {
                            if (select.value && select.value !== "") {
                                if (index !== 0) filterValue += " ";
                                filterValue += select.value;
                            }
                        });
                        dataTable.search(filterValue).draw();
                    });
                })();
            }
        },
    };
})();

KTUtil.onDOMContentLoaded(function () {
    KTUsersList.init();
});
