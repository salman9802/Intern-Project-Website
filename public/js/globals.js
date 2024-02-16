const notificationAlerts = document.querySelectorAll(".notification-alert");

notificationAlerts?.forEach(notificationAlert => {
    setTimeout(() => {
        notificationAlert.remove();
    }, 2500);
});