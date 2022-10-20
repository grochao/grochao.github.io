"use strict";
// Registering Service Worker
/*
if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
    navigator.serviceWorker.register('service-worker.js');
}*/


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