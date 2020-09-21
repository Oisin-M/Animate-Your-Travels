// <DROPDOWN MODAL>
function updatemap(id) {
  var point = mapChart.series[0].data.filter((point) => point.code == id)[0];
  if (point.value == 0) {
    visit = "visited";
    presentUpdatedToast(point.name, point.code, visit);
    point.update(1);
    window.dataLayer.push({
      event: "dropdownMarkAsVisited",
      country: point.name,
    });
  } else {
    visit = "unvisited";
    presentUpdatedToast(point.name, point.code, visit);
    point.update(0);
    window.dataLayer.push({
      event: "dropdownMarkAsUnvisited",
      country: point.name,
    });
  }
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
      var unvisited = mapData.filter((point) => point.value == 0);
      var visited = mapData.filter((point) => point.value == 1);

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

export function openDropdownModal() {
  window.dataLayer.push({
    event: "DropdownOpenModalClick",
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

export function dismissDropdownModal() {
  window.dataLayer.push({
    event: "DropdownCloseModalClick",
  });

  const modalElement = document.getElementById("modal");
  await modalElement.dismiss({
    dismissed: true,
  });
}
// </DROPDOWN MODAL>
