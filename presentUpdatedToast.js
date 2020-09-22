// <UPDATE TOAST CODE>
export function presentUpdatedToast(name, id, visited_string) {
  const toast = document.createElement("ion-toast");
  toast.message = "Marked " + name + " (" + id + ") as " + visited_string;
  toast.duration = 2000;
  toast.position = "top";

  document.body.appendChild(toast);
  return toast.present();
}
// </UPDATE TOAST CODE>
