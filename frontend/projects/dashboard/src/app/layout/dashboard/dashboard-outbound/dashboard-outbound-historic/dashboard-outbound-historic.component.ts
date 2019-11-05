import { Component, OnInit } from "@angular/core";
import { UserSelectionModel, AlertModel } from "shared/models";

import { DashboardOutboundIndicatorsService } from "projects/dashboard/src/app/shared/services";
import { DashboardOutboundResponseModel } from "projects/dashboard/src/app/shared/models";

// Installed modules
import { Observable, Subscription, timer } from "rxjs";
import { AlertService, UserSelectionService } from "shared/services";
import * as moment from "moment";
import { faClock } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-dashboard-dashboard-outbound-historic',
  templateUrl: './dashboard-outbound-historic.component.html',
  styleUrls: ['./dashboard-outbound-historic.component.scss']
})
export class DashboardOutboundHistoricComponent implements OnInit {
// Subscription
private subscription: Subscription = new Subscription();

alertMessage;
show;

// User selection
userSelection;
selectorVisibleFields;

dashboardOptions;
local_store;

// data
rows: DashboardOutboundResponseModel;

// Timer
timerConnected;
// Icon
faClock = faClock;

// fake
historic;

constructor(
  private dashboardOutboundIndicatorsService: DashboardOutboundIndicatorsService,
  private userSelectionService: UserSelectionService,
  private alertService: AlertService
) {
  this.userSelection = new UserSelectionModel("standard");
  this.selectorVisibleFields = new UserSelectionModel("menuOptions");
  this.rows = new DashboardOutboundResponseModel();
  this.alertMessage = new AlertModel();
  this.timerConnected = 0;
  this.dashboardOptions = [
    {
      id: 1,
      name: "Supervisores"
    },
    {
      id: 1,
      name: "Agentes"
    }
  ];
}

ngOnInit() {
  this.userSelection = this.userSelectionService.readUserSelection(
    this.local_store
  );

  this.userSelection.mode.name = "Historic";
    this.setReportTitles('Salientes histórico')
  this.getReportListDashboard(this.userSelection);
}

// Finish
ngOnDestroy() {
  this.userSelectionService.writeUserSelection(
    this.userSelection,
    this.local_store
  );
  this.subscription.unsubscribe();
}

// Get records from backend
getReportListDashboard(userSelection: UserSelectionModel) {
  this.dashboardOutboundIndicatorsService
    .getReportList(userSelection)
    .subscribe(
      (res: DashboardOutboundResponseModel) => {
        this.timerConnected = 0;
        if (res) {
          this.rows = res;
          this.show = true;
        } else {
          console.error("Error", res);
        }
        this.alertMessage = new AlertModel();
      },
      error => {
        console.error("Error", error);
        this.show = false;
        this.alertService.error(error.status);
        this.alertMessage.alertTitle = "Error del servidor";
        this.alertMessage.alertText = error.statusText;
        this.alertMessage.alertShow = true;
        this.alertMessage.alertClass =
          "alert alert-danger alert-dismissible fade show";
      }
    );
}

// Update on return of selector in header
onReturnHeaderResult(event) {
  this.show = false;
  this.userSelection = this.userSelectionService.readUserSelection(
    this.local_store
  );

  this.getReportListDashboard(this.userSelection);
}

setReportTitles(title) {

  this.userSelection.title = title;

  this.userSelectionService.writeUserSelection(this.userSelection);

  this.selectorVisibleFields.assignation = false;
  this.selectorVisibleFields.auxiliar = false;
}
}
