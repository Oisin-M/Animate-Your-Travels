export function presentInvalidToast() {
  const toast = document.createElement("ion-toast");
  toast.message = "Invalid data submitted. Please give each country a date.";
  toast.duration = 2000;
  toast.position = "top";

  document.body.appendChild(toast);
  return toast.present();
}
