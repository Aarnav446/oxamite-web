// Countdown Timer targeting 10 July 2026, 00:00:00 IST
document.addEventListener("DOMContentLoaded", () => {
    const targetDate = new Date("2026-07-10T00:00:00+05:30").getTime();
    
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    // If countdown doesn't exist on page, abort
    if (!daysEl) return;

    const updateCountdown = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format with leading zero if needed
        daysEl.innerText = days < 10 ? `0${days}` : days;
        hoursEl.innerText = hours < 10 ? `0${hours}` : hours;
        minutesEl.innerText = minutes < 10 ? `0${minutes}` : minutes;
        secondsEl.innerText = seconds < 10 ? `0${seconds}` : seconds;
    };

    // Initial call
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
});
