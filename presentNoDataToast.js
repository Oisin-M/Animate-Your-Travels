export function presentNoDataToast() {
  const toast = document.createElement("ion-toast");
  toast.message = "No countries have been selected.";
  toast.duration = 2000;
  toast.position = "top";

  document.body.appendChild(toast);
  return toast.present();
}
