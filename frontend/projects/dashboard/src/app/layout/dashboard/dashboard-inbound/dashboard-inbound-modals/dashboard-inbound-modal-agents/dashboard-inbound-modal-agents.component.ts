// Angular import
import { Component, OnInit, Input } from "@angular/core";

// Global shared services
import {
  AlertService,
  EnvService,
  UserSelectionService
} from "shared/services";

// Global shared models
import { AlertModel } from "shared/models/helpers/Alert";
import { UserSelectionModel } from "shared/models";

import { DashboardSelectionModel } from "projects/dashboard/src/app/shared/models";
import { DashboardInboundListsService } from "projects/dashboard/src/app/shared/services";

@Component({
  selector: "app-dashboard-dashboard-inbound-modal-agents",
  templateUrl: "./dashboard-inbound-modal-agents.component.html",
  styleUrls: ["./dashboard-inbound-modal-agents.component.scss"]
})
export class DashboardInboundModalAgentsComponent implements OnInit {
  @Input() userSelection;
  @Input() modalView: string;

  // Component variables
  alertMessage = new AlertModel();
  show;
  rows;
  dashboardSelection = new DashboardSelectionModel();
  local_store;
  title;

  constructor(
    private dashboardInboundListsService: DashboardInboundListsService,
    private alertService: AlertService,
    private envService: EnvService,
    private userSelectionService: UserSelectionService
  ) {}

  ngOnInit() {
    this.userSelection = this.userSelectionService.readUserSelection(
      this.local_store
    );

    this.title = this.onAddTitle(this.modalView);
    this.dashboardInboundListCurrentAgents(this.userSelection);
  }

  dashboardInboundListCurrentAgents(userSelection: UserSelectionModel) {
    this.dashboardSelection = {
      userSelection: userSelection,
      modalView: this.modalView
    };

    if (this.dashboardSelection) {
      this.dashboardInboundListsService
        .dashboardInboundListCurrentAgents(this.dashboardSelection)
        .subscribe(
          res => {
            if (res) {
              this.rows = res;
              console.log("res", res);
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
  }

  onActivate() {}

  onSelect() {}

  onAddTitle(modalView) {
    let result = "Lista de agentes";
    if (modalView === "efectivo") {
      result = "Lista de agentes efectivos";
    }

    if (modalView === "logueado") {
      result = "Lista de agentes logueados";
    }

    if (modalView === "conectado") {
      result = "Lista de agentes conectados";
    }

    if (modalView === "disponible") {
      result = "Lista de agentes disponibles";
    }

    if (modalView === "ocupado") {
      result = "Lista de agentes ocupados";
    }

    if (modalView === "auxiliar") {
      result = "Lista de agentes en auxiliares";
    }

    if (modalView === "asignado") {
      result = "Lista de agentes asignados";
    }

    return result;
  }
}
