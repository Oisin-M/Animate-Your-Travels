var animation_length = 7000;
var initial_timeout = 1000;

export function progBar() {
  if (document.getElementsByTagName("ion-progress-bar").length == 0) {
    var progBar = document.createElement("ion-progress-bar");
    progBar.value = 0;
    const toolbar = document.getElementById("bottom-toolbar");
    toolbar.insertBefore(progBar, toolbar.childNodes[0]);
  } else {
    progBar = document.getElementsByTagName("ion-progress-bar")[0];
    progBar.value = 0;
  }

  setTimeout(updateProgBar, initial_timeout, progBar);
}

function updateProgBar(progBar) {
  progBar.value += 1 / 50;
  if (progBar.value < 1) {
    setTimeout(updateProgBar, animation_length / 50, progBar);
  }
}
