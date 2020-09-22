var initial_timeout = 1000;

async function progBar() {
  let progbar = await import("./progBar.js");
  progbar.progBar();
}

function resetMap(initial_animation_data, mapChart) {
  for (var i = 0; i < initial_animation_data.length; i++) {
    var id = initial_animation_data[i][0];
    mapChart.series[0].data.filter((point) => point.code == id)[0].update(0);
  }
  return mapChart;
}

function playAnimation(data, index, mapChart) {
  var id = data[index][0];
  mapChart.series[0].data.filter((point) => point.code == id)[0].update(1);
  if (index < data.length - 1) {
    setTimeout(
      playAnimation,
      data[index + 1][1] - data[index][1],
      data,
      index + 1,
      mapChart
    );
  }
}

export async function animate(initial_animation_data, mapChart) {
  mapChart = resetMap(initial_animation_data, mapChart);
  let getAnimationData = await import("./getAnimationData.js");
  var animation_data = getAnimationData.getAnimationData(
    initial_animation_data
  );
  setTimeout(playAnimation, initial_timeout, animation_data, 0, mapChart);
  progBar();
}
