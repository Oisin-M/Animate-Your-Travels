var animation_length = 7000;
var initial_timeout = 1000;
var animation_base_data = [];

// <MAP CODE>
var codes =
  "GL,SH,BU,LK,AS,DK,FO,GU,MP,UM,US,VI,CA,ST,JP,CV,DM,SC,NZ,YE,JM,WS,OM,IN,VC,BD,SB,LC,FR,NR,NO,FM,KN,CN,BH,TO,FI,ID,MU,SE,TT,SW,BR,BS,PW,EC,AU,TV,MH,CL,KI,PH,GD,EE,AG,ES,BB,IT,MT,MV,SP,PG,VU,SG,GB,CY,GR,KM,FJ,RU,VA,SM,AM,AZ,LS,TJ,ML,DZ,TW,UZ,TZ,AR,SA,NL,AE,CH,PT,MY,PA,TR,IR,HT,DO,GW,HR,TH,MX,KW,DE,GQ,CNM,NC,IE,KZ,GE,PL,LT,UG,CD,MK,AL,NG,CM,BJ,TL,TM,KH,PE,MW,MN,AO,MZ,ZA,CR,SV,BZ,CO,KP,KR,GY,HN,GA,NI,ET,SD,SO,GH,CI,SI,GT,BA,JO,SY,WE,IL,EG,ZM,MC,UY,RW,BO,CG,EH,RS,ME,TG,MM,LA,AF,JK,PK,BG,UA,RO,QA,LI,AT,SK,SZ,HU,LY,NE,LU,AD,LR,SL,BN,MR,BE,IQ,GM,MA,TD,KV,LB,SX,DJ,ER,BI,SN,GN,ZW,PY,BY,LV,BT,NA,BF,SS,CF,MD,GZ,KE,BW,CZ,PR,TN,CU,VN,MG,VE,IS,NP,SR,KG";

var data = codes
  .split(",")
  .sort()
  .map(function (code) {
    return { code: code, value: 0 };
  });

const plot = () => {
  mapChart = Highcharts.mapChart("mapcontainer", {
    chart: {
      scrollablePlotArea: {
        minWidth: 700,
        minHeight: 500,
      },
    },
    title: {
      text: "",
    },
    legend: {
      itemDistance: 100,
      align: "left",
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "middle",
      },
    },
    colorAxis: {
      dataClasses: [
        {
          from: 0,
          to: 0,
          name: "Unvisited",
          color: "#0099ff",
        },
        {
          from: 1,
          to: 1,
          name: "Visited",
          color: "#000099",
        },
      ],
    },
    series: [
      {
        data: data,
        mapData: Highcharts.maps["custom/world-palestine-highres"],
        joinBy: ["iso-a2", "code"],
        name: "ScratchMap",
        allowPointSelect: true,
        cursor: "pointer",
        tooltip: {
          headerFormat: "",
          pointFormat: "<h3><b>{point.name} ({point.code})</b></h3>",
        },
      },
    ],
    plotOptions: {
      series: {
        states: {
          hover: {
            enabled: "#99ff99",
          },
          select: {
            color: "#00FFFFFF",
          },
        },
      },
    },
  });
  return mapChart;
};

mapChart = plot();

function sizeChart() {
  if (window.innerHeight > window.innerWidth) {
    mapChart.setSize(
      ((window.innerHeight - 120 - 65) * 813) / 388.29,
      window.innerHeight - 120 - 65,
      true
    );
    mapChart.xAxis[0].setExtremes(4558.68, 4558.68 + 3000, false);
    mapChart.yAxis[0].setExtremes(-8200.36 - 750, -8200.36 + 1250);
  } else {
    mapChart.setSize(window.innerWidth, window.innerHeight - 70 - 80, true);
  }
}
sizeChart();

Highcharts.wrap(Highcharts.Point.prototype, "select", function (proceed) {
  proceed.apply(this, Array.prototype.slice.call(arguments, 1));

  var point = mapChart.getSelectedPoints()[0];
  point.selected = false;
  console.log(point.selected);

  var visit = "";
  if (point.value == 0) {
    visit = "visited";
    point.update(1);
  } else {
    visit = "unvisited";
    point.update(0);
  }
  presentUpdatedToast(point.name, point.code, visit);
});

window.onresize = sizeChart;
// </MAP CODE>

// <DOWNLOAD MAP CODE>
function downloadMap() {}
// </DOWNLOAD MAP CODE>

// <UPDATE TOAST CODE>
async function presentUpdatedToast(name, id, visited_string) {
  const toast = document.createElement("ion-toast");
  toast.message = "Marked " + name + " (" + id + ") as " + visited_string;
  toast.duration = 2000;
  toast.position = "top";

  document.body.appendChild(toast);
  return toast.present();
}
// </UPDATE TOAST CODE>

// <DROPDOWN MODAL>
function updatemap(id) {
  var point = mapChart.series[0].data.filter((point) => point.code == id)[0];
  if (point.value == 0) {
    visit = "visited";
    point.update(1);
  } else {
    visit = "unvisited";
    point.update(0);
  }
  presentUpdatedToast(point.name, point.code, visit);
}

customElements.define(
  "modal-dropdown-page",
  class extends HTMLElement {
    connectedCallback() {
      //get EU, SA, NA etc. arrays here if wanted
      var html_string = "";
      var html_string = `
<ion-header>
    <ion-toolbar>
      <ion-title></ion-title>
      <ion-buttons slot="primary">
        <ion-button onClick="dismissDropdownModal()">
          <ion-icon slot="icon-only" name="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">

  <ion-grid>
  <ion-searchbar show-cancel-button="always" placeholder='Search Countries'></ion-searchbar>
      <ion-row>`;

      html_string += `<ion-col>`;
      html_string += `
  <ion-item-group>
    <ion-item-divider>
      <ion-label>Countries</ion-label>
    </ion-item-divider>`;

      var unvisited = mapChart.series[0].data.filter(
        (point) => point.value == 0
      );
      var visited = mapChart.series[0].data.filter((point) => point.value == 1);

      //visited dropdown
      for (var i = 0; i < visited.length; i++) {
        html_string +=
          `<ion-item class="dropdown_list_item" onClick=` +
          "updatemap('" +
          visited[i].code +
          `')>
    <ion-label>`;
        html_string += visited[i].name + " (" + visited[i].code + ")";
        html_string += `</ion-label>
  <ion-checkbox slot="end" checked></ion-checkbox>
</ion-item>`;
      }

      //unvisited dropdown
      for (var i = 0; i < unvisited.length; i++) {
        html_string +=
          `<ion-item class="dropdown_list_item" onClick=` +
          "updatemap('" +
          unvisited[i].code +
          `')>
    <ion-label>`;
        html_string += unvisited[i].name + " (" + unvisited[i].code + ")";
        html_string += `</ion-label>
  <ion-checkbox slot="end"></ion-checkbox>
</ion-item>`;
      }

      html_string += `
            </ion-item-group>
          </ion-col>

        </ion-row>
      </ion-grid>

</ion-content>`;

      this.innerHTML = html_string;

      const searchbar = document.querySelector("ion-searchbar");
      const items = Array.from(
        document.getElementsByClassName("dropdown_list_item")
      );

      searchbar.addEventListener("ionInput", handleInput);

      function handleInput(event) {
        const query = event.target.value.toLowerCase();
        requestAnimationFrame(() => {
          items.forEach((item) => {
            const shouldShow =
              item.textContent.toLowerCase().indexOf(query) > -1;
            item.style.display = shouldShow ? "block" : "none";
          });
        });
      }
    }
  }
);

function presentDropdownModal() {
  window.dataLayer.push({
    event: "DropdownOpenModalClick",
    countriesSelected: mapChart.series[0].data.filter(
      (point) => point.value == 1
    ).length,
  });

  // create the modal with the `modal-page` component
  const modalElement = document.createElement("ion-modal");
  modalElement.setAttribute("id", "modal");
  modalElement.component = "modal-dropdown-page";
  modalElement.cssClass = "my-modal";

  // present the modal
  document.body.appendChild(modalElement);

  return modalElement.present();
}

async function dismissDropdownModal() {
  const modalElement = document.getElementById("modal");
  await modalElement.dismiss({
    dismissed: true,
  });
}
// </DROPDOWN MODAL>

// <ANIMATE MODAL>
customElements.define(
  "modal-animation-page",
  class extends HTMLElement {
    connectedCallback() {
      var visited = mapChart.series[0].data.filter((point) => point.value == 1);
      var html_string = "";
      html_string = `
<ion-header>
  <ion-toolbar>
    <ion-title></ion-title>
    <ion-buttons slot="primary">
      <ion-button onClick="closeAnimateModal()">
        <ion-icon slot="icon-only" name="close"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen class="ion-padding">

<ion-item-group>
  <ion-item-divider>
    <ion-title>Insert Dates of Visits</ion-title>
  </ion-item-divider>`;

      for (var i = 0; i < visited.length; i++) {
        html_string +=
          `
    <ion-item class="font_up">
      <ion-label class='animate_labels'>` +
          visited[i].name +
          " (" +
          visited[i].code +
          `)</ion-label>
      <ion-datetime id="test" value="`;
        var pts = animation_base_data.filter(
          (point) => point[0] == visited[i].code
        );
        if (pts.length > 0) {
          html_string += pts[0][1][0] + "-" + pts[0][1][1] + "-" + "04";
        }
        html_string += `" placeholder="Select date" display-format="MMMM YYYY" min="1920-01-04"></ion-datetime>
    </ion-item>`;
      }

      html_string += `</ion-item-group>
<ion-row>
<ion-button onClick="animateButtonOnClick()">
  <ion-label>Animate!</ion-label>
</ion-button>
</ion-row>
</ion-content>`;

      this.innerHTML = html_string;
    }
  }
);

function presentAnimateModal() {
  let noCountries = mapChart.series[0].data.filter((point) => point.value == 1)
    .length;

  window.dataLayer.push({
    event: "AnimationOpenModalClick",
    countriesSelected: noCountries,
  });

  if (noCountries == 0) {
    presentNoDataToast();
  } else {
    const modalElement = document.createElement("ion-modal");
    modalElement.setAttribute("id", "modal");
    modalElement.component = "modal-animation-page";
    modalElement.cssClass = "my-modal";

    document.body.appendChild(modalElement);

    return modalElement.present();
  }
}

async function dismissAnimateModal(modalElement) {
  await modalElement.dismiss({
    dismissed: true,
  });
}

function closeAnimateModal() {
  const modalElement = document.getElementById("modal");
  animation_base_data = [];
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

function animateButtonOnClick() {
  const modalElement = document.getElementById("modal");
  animation_base_data = [];
  const dates = modalElement.getElementsByTagName("input");
  const vals = modalElement.getElementsByClassName("animate_labels");
  var all_submitted = true;
  for (var i = 0; i < dates.length; i++) {
    var date = dates[i].value.substring(0, 7).split("-");
    if (date.length == 1) {
      if (all_submitted == true) {
        presentInvalidToast();
        all_submitted = false;
      }
    } else {
      animation_base_data.push([
        vals[i].textContent.split("(")[1].substring(0, 2),
        date,
      ]);
    }
  }
  if (all_submitted == true) {
    dismissAnimateModal(modalElement);
    animate(animation_base_data);
  }
}
// </ANIMATE MODAL>

// <INVALID DATE TOAST>
async function presentInvalidToast() {
  const toast = document.createElement("ion-toast");
  toast.message = "Invalid data submitted. Please give each country a date.";
  toast.duration = 2000;
  toast.position = "top";

  document.body.appendChild(toast);
  return toast.present();
}

async function presentNoDataToast() {
  const toast = document.createElement("ion-toast");
  toast.message = "No countries have been selected.";
  toast.duration = 2000;
  toast.position = "top";

  document.body.appendChild(toast);
  return toast.present();
}
// </INVALID DATE TOAST>

// <ANIMATION CODE>
function animate(initial_animation_data) {
  resetMap(initial_animation_data);
  animation_data = getAnimationData(initial_animation_data);
  setTimeout(playAnimation, initial_timeout, animation_data, 0);
  progBar();
}

function progBar() {
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

function resetMap(initial_animation_data) {
  for (var i = 0; i < initial_animation_data.length; i++) {
    var id = initial_animation_data[i][0];
    mapChart.series[0].data.filter((point) => point.code == id)[0].update(0);
  }
}

function playAnimation(data, index) {
  var id = data[index][0];
  mapChart.series[0].data.filter((point) => point.code == id)[0].update(1);
  if (index < data.length - 1) {
    setTimeout(
      playAnimation,
      data[index + 1][1] - data[index][1],
      data,
      index + 1
    );
  }
}

function getAnimationData(initial_animation_data) {
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
// </ANIMATION CODE>

// <SHAREBAR>
function openShareBar() {
  if (document.getElementById("links-header").style.display === "none") {
    document.getElementById("links-header").style.display = "inline";
    document.getElementById("links").style.display = "inline";
  } else {
    document.getElementById("links-header").style.display = "none";
    document.getElementById("links").style.display = "none";
  }
}
// </SHAREBAR>
