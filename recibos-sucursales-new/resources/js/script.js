window.addEventListener('load', function () {
    const dialog = document.getElementById("Details");
    //const openDialog = document.querySelector("dialog#Details");
    const closeDialog = document.querySelector("dialog#Details .btn-close");


    closeDialog.addEventListener("click", () => {
        alert("cerrando");
        dialog.close();
    });

    const _check_payments = document.querySelectorAll(".checkbox-boton");
    if (_check_payments) {
        _check_payments.forEach(function (contentCheck) {

            const check = contentCheck.querySelector("input[type='checkbox']");
            check.addEventListener("click", function () {
                const isChecked = check.checked || false;
                const ID = check.id;
                let idDialog = null;

                const _allDialogs = document.querySelectorAll("dialog");
                if (_allDialogs) {
                    _allDialogs.forEach(function (dialog) {
                        dialog.close();
                    });
                }

                console.log("isChecked", (isChecked), "ID", ID);
                if (isChecked) {
                    switch (ID) {
                        case "txt_efectivo":
                            idDialog = "Details";
                            break;
                        default:
                            break;
                    }
                    if (idDialog) {

                        const dialog = document.getElementById(idDialog);
                        dialog.showModal();
                    }
                }

            });
        });
        console.log("Encontró los pagos");
    } else {
        console.log("No encontro los pagos");
    }


});