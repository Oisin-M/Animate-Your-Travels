var animation_length = 7000;

export function getAnimationData(initial_animation_data) {
  var animation_data = [];
  var min = 10 ** 5;
  for (let i = 0; i < initial_animation_data.length; i++) {
    var months =
      initial_animation_data[i][1][0] * 12 +
      initial_animation_data[i][1][1] * 1;
    animation_data.push([
      initial_animation_data[i][0],
      months,
      initial_animation_data[i][1],
    ]);
    if (min > months) {
      min = months;
    }
  }
  animation_data = animation_data.sort(function (a, b) {
    return a[1] - b[1];
  });

  var offset_data = animation_data.map(function (point) {
    return [point[0], point[1] - animation_data[0][1], point[2]];
  });

  var normalised_data = offset_data.map(function (point) {
    return [
      point[0],
      (point[1] * animation_length) / offset_data[offset_data.length - 1][1],
      point[2],
    ];
  });

  return normalised_data;
}
