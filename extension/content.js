// Inject a floating VoidSay button
const button = document.createElement("button");
button.id = "voidsay-floating-btn";
button.innerText = "💬 VoidSay";

button.addEventListener("click", () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.open(`https://voidsay.com/?url=${currentUrl}`, "_blank");
});

document.body.appendChild(button);
