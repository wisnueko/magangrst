"use strict";

var KTSigninGeneral = function () {
    var form, submitButton, validator;

    return {
        init: function () {
            // Get references to the form and submit button
            form = document.querySelector("#kt_sign_in_form");
            submitButton = document.querySelector("#kt_sign_in_submit");

            // Initialize form validation
            validator = FormValidation.formValidation(form, {
                fields: {
                    email: {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "The value is not a valid email address"
                            },
                            notEmpty: {
                                message: "Email address is required"
                            }
                        }
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "The password is required"
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: ""
                    })
                }
            });

            // Check if the form action is a valid URL
            var formAction = form.closest("form").getAttribute("action");
            var isValidUrl = function (url) {
                try {
                    new URL(url);
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (!isValidUrl(formAction)) {
                submitButton.addEventListener("click", function (event) {
                    event.preventDefault();

                    // Validate the form before submitting
                    validator.validate().then(function (status) {
                        if (status === "Valid") {
                            submitButton.setAttribute("data-kt-indicator", "on");
                            submitButton.disabled = true;

                            setTimeout(function () {
                                submitButton.removeAttribute("data-kt-indicator");
                                submitButton.disabled = false;

                                Swal.fire({
                                    text: "You have successfully logged in!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        form.querySelector('[name="email"]').value = "";
                                        form.querySelector('[name="password"]').value = "";

                                        var redirectUrl = form.getAttribute("data-kt-redirect-url");
                                        if (redirectUrl) {
                                            location.href = redirectUrl;
                                        }
                                    }
                                });
                            }, 2000);
                        } else {
                            Swal.fire({
                                text: "Sorry, looks like there are some errors detected, please try again.",
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
            } else {
                submitButton.addEventListener("click", function (event) {
                    event.preventDefault();

                    // Validate the form before submitting
                    validator.validate().then(function (status) {
                        if (status === "Valid") {
                            submitButton.setAttribute("data-kt-indicator", "on");
                            submitButton.disabled = true;

                            axios.post(formAction, new FormData(form))
                                .then(function (response) {
                                    if (response.data) {
                                        form.reset();
                                        Swal.fire({
                                            text: "You have successfully logged in!",
                                            icon: "success",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        });

                                        var redirectUrl = form.getAttribute("data-kt-redirect-url");
                                        if (redirectUrl) {
                                            location.href = redirectUrl;
                                        }
                                    } else {
                                        Swal.fire({
                                            text: "Sorry, the email or password is incorrect, please try again.",
                                            icon: "error",
                                            buttonsStyling: false,
                                            confirmButtonText: "Ok, got it!",
                                            customClass: {
                                                confirmButton: "btn btn-primary"
                                            }
                                        });
                                    }
                                })
                                .catch(function () {
                                    Swal.fire({
                                        text: "Sorry, looks like there are some errors detected, please try again.",
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });
                                })
                                .finally(function () {
                                    submitButton.removeAttribute("data-kt-indicator");
                                    submitButton.disabled = false;
                                });
                        } else {
                            Swal.fire({
                                text: "Sorry, looks like there are some errors detected, please try again.",
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
            }
        }
    };
}();

// Initialize when the DOM content is loaded
KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
});
