import { Component, OnInit } from "@angular/core";
import { UserSelectionModel, AlertModel } from "shared/models";

import { DashboardInboundIndicatorsRealTimeService } from "projects/dashboard/src/app/shared/services";
import { DashboardInboundResponseModel } from "projects/dashboard/src/app/shared/models";

// Installed modules
import { Observable, Subscription, timer } from "rxjs";
import { AlertService, UserSelectionService } from "shared/services";
import * as moment from "moment";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import {
  selectionToText,
  optionsToText,
  dateToDatePicker
} from "shared/functions";

@Component({
  selector: "app-dashboard-dashboard-inbound-realtime",
  templateUrl: "./dashboard-inbound-realtime.component.html",
  styleUrls: ["./dashboard-inbound-realtime.component.scss"]
})
export class DashboardInboundRealtimeComponent implements OnInit {
  // Subscription
  private subscription: Subscription = new Subscription();

  alertMessage;
  show;

  // User selection
  userSelection;
  selectorVisibleFields;
  old_start_date;
  old_end_date;

  dashboardOptions;
  local_store;

  // data
  rows: DashboardInboundResponseModel;

  // Timer
  timerConnected;

  // Icon
  faClock = faClock;

  // fake
  historic;

  constructor(
    private dashboardInboundIndicatorsRealTimeService: DashboardInboundIndicatorsRealTimeService,

    private userSelectionService: UserSelectionService,
    private alertService: AlertService
  ) {
    this.userSelection = new UserSelectionModel("standard");
    this.selectorVisibleFields = new UserSelectionModel("menuOptions");
    this.selectorVisibleFields.start_date = false;
    this.selectorVisibleFields.end_date = false;
    this.rows = new DashboardInboundResponseModel();
    this.alertMessage = new AlertModel();
    this.timerConnected = 0;
    // this.dashboardOptions = [
    //   {
    //     id: 1,
    //     name: "Supervisores"
    //   },
    //   {
    //     id: 1,
    //     name: "Agentes"
    //   }
    // ];
  }

  ngOnInit() {
    this.userSelection = this.userSelectionService.readUserSelection(
      this.local_store
    );

    this.userSelection.mode.name = "Actual";
    this.old_end_date = this.userSelection.end_date;
    this.old_start_date = this.userSelection.start_date;



    this.getReportListDashboard(this.userSelection);
    this.setReportTitles("Entrantes en tiempo real");
    this.onRepeat();
  }

  // Finish
  ngOnDestroy() {
    this.userSelection.end_date = this.old_end_date;
    this.userSelection.start_date = this.old_start_date;

    this.userSelectionService.writeUserSelection(
      this.userSelection,
      this.local_store
    );
    this.subscription.unsubscribe();
  }

  // Get records from backend
  getReportListDashboard(userSelection: UserSelectionModel) {
    this.userSelection.mode.name = "Actual";
    this.userSelection.start_date = this.userSelection.current_date;
    this.userSelection.end_date = this.userSelection.current_date;
    this.dashboardInboundIndicatorsRealTimeService
      .getReportList(userSelection)
      .subscribe(
        (res: DashboardInboundResponseModel) => {
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

  // Real time repeat
  onRepeat() {
    let timerComponent = timer(1000, 5000);
    let timerClock = timer(1000, 1000);

    this.getReportListDashboard(this.userSelection);

    this.subscription.add(
      timerComponent.subscribe(() => {
        this.getReportListDashboard(this.userSelection);
      })
    );

    timerClock.subscribe(() => {
      this.timerConnected = this.timerConnected + 1;
    });
  }

  setReportTitles(title) {
    this.userSelection.title = title;

    this.userSelectionService.writeUserSelection(this.userSelection);

    this.selectorVisibleFields.assignation = false;
    this.selectorVisibleFields.auxiliar = false;
  }
}
