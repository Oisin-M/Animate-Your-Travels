async function dismissAnimateModal(modalElement, send_data = true) {
  if (send_data) {
    window.dataLayer.push({
      event: "AnimationCloseModalClick",
      // countriesSelected: mapChart.series[0].data.filter(
      //   (point) => point.value == 1
      // ).length,
    });
  }

  await modalElement.dismiss({
    dismissed: true,
  });
}

export async function closeAnimateModal() {
  const modalElement = document.getElementById("modal");
  var animation_base_data = [];
  const dates = modalElement.getElementsByTagName("input");
  const vals = modalElement.getElementsByClassName("animate_labels");
  for (var i = 0; i < dates.length; i++) {
    var date = dates[i].value.substring(0, 7).split("-");
    if (date.length == 1) {
    } else {
      animation_base_data.push([
        vals[i].textContent.split("(")[1].substring(0, 2),
        date,
      ]);
    }
  }
  dismissAnimateModal(modalElement);
}
