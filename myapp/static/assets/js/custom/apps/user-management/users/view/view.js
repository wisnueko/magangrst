"use strict";

var KTUsersViewMain = {
    init: function() {
        // Sign Out All Sessions
        document.getElementById("kt_modal_sign_out_sesions").addEventListener("click", (event) => {
            event.preventDefault();
            Swal.fire({
                text: "Are you sure you would like to sign out all sessions?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, sign out!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then((result) => {
                if (result.value) {
                    Swal.fire({
                        text: "You have signed out all sessions!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                } else if (result.dismiss === "cancel") {
                    Swal.fire({
                        text: "Your sessions are still preserved!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });

        // Sign Out Single User
        document.querySelectorAll('[data-kt-users-sign-out="single_user"]').forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                const userName = button.closest("tr").querySelectorAll("td")[1].innerText;
                Swal.fire({
                    text: `Are you sure you would like to sign out ${userName}?`,
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, sign out!",
                    cancelButtonText: "No, return",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then((result) => {
                    if (result.value) {
                        Swal.fire({
                            text: `You have signed out ${userName}!`,
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(() => {
                            button.closest("tr").remove();
                        });
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: `${userName}'s session is still preserved!`,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            });
        });

        // Remove Two-Step Authentication
        document.getElementById("kt_users_delete_two_step").addEventListener("click", (event) => {
            event.preventDefault();
            Swal.fire({
                text: "Are you sure you would like to remove this two-step authentication?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, remove it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then((result) => {
                if (result.value) {
                    Swal.fire({
                        text: "You have removed this two-step authentication!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                } else if (result.dismiss === "cancel") {
                    Swal.fire({
                        text: "Your two-step authentication is still valid!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
        });

        // Email Notification Form
        (() => {
            const form = document.getElementById("kt_users_email_notification_form");
            const submitButton = form.querySelector("#kt_users_email_notification_submit");
            const cancelButton = form.querySelector("#kt_users_email_notification_cancel");

            submitButton.addEventListener("click", (event) => {
                event.preventDefault();
                submitButton.setAttribute("data-kt-indicator", "on");
                submitButton.disabled = true;

                setTimeout(() => {
                    submitButton.removeAttribute("data-kt-indicator");
                    submitButton.disabled = false;
                    Swal.fire({
                        text: "Form has been successfully submitted!",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }, 2000);
            });

            cancelButton.addEventListener("click", (event) => {
                event.preventDefault();
                Swal.fire({
                    text: "Are you sure you would like to cancel?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, cancel it!",
                    cancelButtonText: "No, return",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then((result) => {
                    if (result.value) {
                        form.reset();
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: "Your form has not been cancelled!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    }
                });
            });
        })();
    }
};

// Initialize on DOMContentLoaded
KTUtil.onDOMContentLoaded(() => {
    KTUsersViewMain.init();
});
