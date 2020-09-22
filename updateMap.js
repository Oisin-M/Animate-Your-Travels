export async function updateMap(id, mapChart) {
  let toast = await import("./presentUpdatedToast.js");

  var point = mapChart.series[0].data.filter((point) => point.code == id)[0];
  var visit;
  if (point.value == 0) {
    visit = "visited";
    toast.presentUpdatedToast(point.name, point.code, visit);
    point.update(1);
    window.dataLayer.push({
      event: "dropdownMarkAsVisited",
      country: point.name,
    });
  } else {
    visit = "unvisited";
    toast.presentUpdatedToast(point.name, point.code, visit);
    point.update(0);
    window.dataLayer.push({
      event: "dropdownMarkAsUnvisited",
      country: point.name,
    });
  }
}
