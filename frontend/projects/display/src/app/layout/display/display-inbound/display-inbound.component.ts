import { Component, OnInit, EventEmitter, Output } from "@angular/core";

import { AlertModel } from "shared/models/helpers/Alert";
import {
  AlertService,
  EnvService,
  UserSelectionService
} from "shared/services";
import { UserSelectionModel } from "shared/models";

@Component({
  selector: "app-display-display-inbound",
  templateUrl: "./display-inbound.component.html",
  styleUrls: ["./display-inbound.component.scss"]
})
export class DisplayInboundComponent implements OnInit {
  displayUserSelection: UserSelectionModel;
  selectorVisibleFields: UserSelectionModel;
  title;

  constructor(
    private alertService: AlertService,
    private envService: EnvService,
    private userSelectionService: UserSelectionService
  ) {
    // this.displayUserSelection = new UserSelectionModel("standard");
    // // this.selectorVisibleFields = new UserSelectionModel("visible");
    // this.title = "Display llamadas entrantes";
  }

  ngOnInit() {
    // if (this.displayUserSelection.title !== this.title) {
    //   this.setReportTitles();
    // }
    // this.displayUserSelection.title = this.title;
    // console.log("this.title", this.title);
  }

  setReportTitles() {
    // this.displayUserSelection = new UserSelectionModel("standard");
    // this.displayUserSelection.title = this.title;
    // this.selectorVisibleFields.assignation = false;
    // this.selectorVisibleFields.auxiliar = false;
  }
}
