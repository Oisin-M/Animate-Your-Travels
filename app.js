var animation_base_data = [];

import "./highcharts/highcharts.js";
import "./highcharts/map.js";
import "./highcharts/world-palestine-highres.js";

window.presentDropdownModal = presentDropdownModal;
window.presentAnimateModal = presentAnimateModal;

// <MAP CODE>
var codes =
  "GL,SH,BU,LK,AS,DK,FO,GU,MP,UM,US,VI,CA,ST,JP,CV,DM,SC,NZ,YE,JM,WS,OM,IN,VC,BD,SB,LC,FR,NR,NO,FM,KN,CN,BH,TO,FI,ID,MU,SE,TT,SW,BR,BS,PW,EC,AU,TV,MH,CL,KI,PH,GD,EE,AG,ES,BB,IT,MT,MV,SP,PG,VU,SG,GB,CY,GR,KM,FJ,RU,VA,SM,AM,AZ,LS,TJ,ML,DZ,TW,UZ,TZ,AR,SA,NL,AE,CH,PT,MY,PA,TR,IR,HT,DO,GW,HR,TH,MX,KW,DE,GQ,CNM,NC,IE,KZ,GE,PL,LT,UG,CD,MK,AL,NG,CM,BJ,TL,TM,KH,PE,MW,MN,AO,MZ,ZA,CR,SV,BZ,CO,KP,KR,GY,HN,GA,NI,ET,SD,SO,GH,CI,SI,GT,BA,JO,SY,WE,IL,EG,ZM,MC,UY,RW,BO,CG,EH,RS,ME,TG,MM,LA,AF,JK,PK,BG,UA,RO,QA,LI,AT,SK,SZ,HU,LY,NE,LU,AD,LR,SL,BN,MR,BE,IQ,GM,MA,TD,KV,LB,SX,DJ,ER,BI,SN,GN,ZW,PY,BY,LV,BT,NA,BF,SS,CF,MD,GZ,KE,BW,CZ,PR,TN,CU,VN,MG,VE,IS,NP,SR,KG";

var data = codes.split(",").map(function (code) {
  return { code: code, value: 0 };
});

var mapChart = Highcharts.mapChart("mapcontainer", {
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

Highcharts.wrap(Highcharts.Point.prototype, "select", async function (proceed) {
  proceed.apply(this, Array.prototype.slice.call(arguments, 1));

  var point = mapChart.getSelectedPoints()[0];
  point.selected = false;
  console.log(point.name);

  let test = await import("./clickMap.js");
  test.clickMap(proceed, point);
});

window.onresize = sizeChart;
// </MAP CODE>

// <DROPDOWN MODAL>
async function updatemap(id) {
  let updateMap = await import("./updateMap.js");
  updateMap.updateMap(id, mapChart);
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

      var mapData = mapChart.series[0].data;
      const [visited, unvisited] = mapData.reduce(
        ([p, f], e) => (e.value == 1 ? [[...p, e], f] : [p, [...f, e]]),
        [[], []]
      );

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
    // countriesSelected: mapChart.series[0].data.filter(
    //   (point) => point.value == 1
    // ).length,
  });

  if (!window.dismissDropdownModal) {
    window.dismissDropdownModal = dismissDropdownModal;
    window.updatemap = updatemap;
  }

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
  window.dataLayer.push({
    event: "DropdownCloseModalClick",
    // countriesSelected: mapChart.series[0].data.filter(
    //   (point) => point.value == 1
    // ).length,
  });

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

async function presentAnimateModal() {
  let noCountries = mapChart.series[0].data.filter((point) => point.value == 1)
    .length;

  window.dataLayer.push({
    event: "AnimationOpenModalClick",
    // countriesSelected: noCountries,
  });

  if (noCountries == 0) {
    let nodatattoast = await import("./presentNoDataToast.js");
    nodatattoast.presentNoDataToast();
  } else {
    if (!window.closeAnimateModal) {
      let closeAnimateModal = await import("./closeAnimateModal.js");
      window.closeAnimateModal = closeAnimateModal.closeAnimateModal;
      window.animateButtonOnClick = animateButtonOnClick;
    }

    const modalElement = document.createElement("ion-modal");
    modalElement.setAttribute("id", "modal");
    modalElement.component = "modal-animation-page";
    modalElement.cssClass = "my-modal";

    document.body.appendChild(modalElement);

    return modalElement.present();
  }
}

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

async function animateButtonOnClick() {
  window.dataLayer.push({
    event: "AnimationClicked",
    countriesSelected: mapChart.series[0].data.filter(
      (point) => point.value == 1
    ).length,
  });

  const modalElement = document.getElementById("modal");
  animation_base_data = [];
  const dates = modalElement.getElementsByTagName("input");
  const vals = modalElement.getElementsByClassName("animate_labels");
  var all_submitted = true;
  for (var i = 0; i < dates.length; i++) {
    var date = dates[i].value.substring(0, 7).split("-");
    if (date.length == 1) {
      if (all_submitted == true) {
        let invalidtoast = await import("./presentInvalidToast.js");
        invalidtoast.presentInvalidToast();
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
    dismissAnimateModal(modalElement, false);
    let anim = await import("./animate.js");
    anim.animate(animation_base_data, mapChart);
  }
}
// </ANIMATE MODAL>

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
