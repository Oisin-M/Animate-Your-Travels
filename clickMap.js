export async function clickMap(proceed, point) {
  let toast = await import("./presentUpdatedToast.js");

  var visit;
  if (point.value == 0) {
    visit = "visited";
    toast.presentUpdatedToast(point.name, point.code, visit);
    point.update(1);
    window.dataLayer.push({
      event: "clickMarkAsVisited",
      country: point.name,
    });
  } else {
    visit = "unvisited";
    toast.presentUpdatedToast(point.name, point.code, visit);
    point.update(0);
    window.dataLayer.push({
      event: "clickMarkAsUnvisited",
      country: point.name,
    });
  }
}
