"use strict";
// Registering Service Worker
/*
if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
    navigator.serviceWorker.register('service-worker.js');
}*/

const notificationButton = document.getElementById("enableNotifications");
let swRegistration = null;

initializeApp();

function initializeApp() {
    if ("serviceWorker" in navigator && "PushManager" in window && ['localhost', '127'].indexOf(location.hostname) === -1) {
        console.log("Service Worker and Push is supported");

        //Register the service worker
        navigator.serviceWorker
            .register("service-worker.js")
            .then(swReg => {
                console.log("Service Worker is registered", swReg);

                swRegistration = swReg;

                //displayNotification2();
                //initializeUi();
            })
            .catch(error => {
                console.error("Service Worker Error", error);
            });
    } else {
        if (['localhost', '127'].indexOf(location.hostname) !== -1) {
            console.info("Sistema de Cache no está abilitado para localhost");
        }
        console.warn("Push messaging is not supported");
        //notificationButton.textContent = "Push Not Supported";
    }
}



function displayNotification2() {
    if (window.Notification && Notification.permission === "granted") {
        notification();
    }
    // If the user hasn't told if he wants to be notified or not
    // Note: because of Chrome, we are not sure the permission property
    // is set, therefore it's unsafe to check for the "default" value.
    else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(status => {
            if (status === "granted") {
                notification2();
            } else {
                alert("You denied or dismissed permissions to notifications.");
            }
        });
    } else {
        // If the user refuses to get notified
        alert(
            "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
        );
    }
}
/*
function notification2() {
    const options = {
        body: "Sistema de automaticación de recargas para puntos de venta",
        icon: "img/information.png",
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        image: "img/banner.png",
        requireInteraction: true,
    };
    swRegistration.showNotification("Recargas Claro/Tigo", options);
}*/