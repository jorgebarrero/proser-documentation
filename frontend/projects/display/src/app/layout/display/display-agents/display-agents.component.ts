import { Component, OnInit, EventEmitter, Output } from "@angular/core";

import { AlertModel } from "shared/models/helpers/Alert";
import {
  AlertService,
  EnvService,
  UserSelectionService
} from "shared/services";
import { UserSelectionModel } from "shared/models";

@Component({
  selector: "app-display-display-agents",
  templateUrl: "./display-agents.component.html",
  styleUrls: ["./display-agents.component.scss"]
})
export class DisplayAgentsComponent implements OnInit {
  displayUserSelection: UserSelectionModel;
  selectorVisibleFields: UserSelectionModel;
  title;

  constructor(
    private alertService: AlertService,
    private envService: EnvService,
    private userSelectionService: UserSelectionService
  ) {
    this.displayUserSelection =  new UserSelectionModel('standard');
    this.selectorVisibleFields = new UserSelectionModel("visible");
    this.title = "Display agentes";
  }

  ngOnInit() {
    if (this.displayUserSelection.title !== this.title) {
      this.setReportTitles();
    }
  }

  setReportTitles() {
    // this.displayUserSelection = new UserSelectionModel("standard");
    this.displayUserSelection.title = this.title;
    // //
    // //
    this.userSelectionService.writeUserSelection(this.displayUserSelection);

    this.selectorVisibleFields.assignation = false;
    this.selectorVisibleFields.auxiliar = false;
  }
}
