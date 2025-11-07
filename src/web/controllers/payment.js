
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("paymentForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    alert("Payment simulated successfully! Thank you for using Door2Door.");

    setTimeout(() => {
      window.location.href = "/home";
    }, 100);
  });
});
