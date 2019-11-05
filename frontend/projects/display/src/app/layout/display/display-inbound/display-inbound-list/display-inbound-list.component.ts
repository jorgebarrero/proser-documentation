// Angular import
import { Component, OnInit, Input, ViewChild } from "@angular/core";

// Installed modules
import { Observable, Subscription, timer } from "rxjs";
import * as moment from "moment";
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";

// Global shared functions import
import { getUpdateFilter } from "shared/functions";
import { objectDateToTextDate, textDateToObjectDate } from "shared/functions";

// Global shared models
import { AlertModel } from "shared/models/helpers/Alert";
import { UserSelectionModel } from "shared/models";

// Global shared services
import { AlertService, EnvService } from "shared/services";
import { UserSelectionService } from "shared/services/crud/system/user-selection.service";

// Local models
import { DisplayInboundResponseModel } from "projects/display/src/app/shared/models/display-inbound/DisplayInboundResponse.model";

// Local shared
import { DisplayInboundGraphComponent } from "../display-inbound-graph/display-inbound-graph.component";

import { DisplayInboundModel } from "projects/display/src/app/shared/models/display-inbound/DisplayInbound.model";
import { DisplayInboundIndicatorsService } from "projects/display/src/app/shared/services/display-inbound/display-inbound-indicators.service";
import { DisplayInboundHighlightsComponent } from "../display-inbound-highlights/display-inbound-highlights.component";

import { faIdBadge, faClock } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-display-display-inbound-list",
  templateUrl: "./display-inbound-list.component.html",
  styleUrls: ["./display-inbound-list.component.scss"]
})
export class DisplayInboundListComponent implements OnInit {
  // Subscription
  private subscription: Subscription = new Subscription();
  // Child components
  @ViewChild(DisplayInboundGraphComponent, { static: false })
  private childGraph: DisplayInboundGraphComponent;

  @ViewChild(DisplayInboundHighlightsComponent, { static: false })
  private highligthts: DisplayInboundHighlightsComponent;

  timerComponent;
  timerClock;

  // Variables that come from main component
  displayUserSelection: UserSelectionModel;
  selectorVisibleFields: UserSelectionModel;

  // Icon
  faIdBadge = faIdBadge;
  faClock = faClock;

  // Component variables
  alertMessage = new AlertModel();
  env;

  // Selector variables
  local_store;

  // Realtime variables
  timerConnected;
  currentDate;

  // Show variables
  show_columns = false; // shows or hides a colum
  show = false; // shows or hides the table
  selected = [];
  idealResponseTime;
  historic = false;

  // Filter variables
  numberOfRowsInTable;
  filterFieldList;
  initialSelectedFilterField;
  findInList;

  // Variable to display values
  model: DisplayInboundModel;
  rows: DisplayInboundResponseModel;
  rows_original: DisplayInboundResponseModel;
  rows_total;
  rows_detail;
  rows_detail_original;
  rows_detail_total;
  row_selection;
  exportName;

  // Modal window variables
  activeModal: NgbActiveModal;

  // Graph variables
  graph = false;
  show_graph_or_table_button = false;

  // Init
  constructor(
    private displayInboundIndicatorsService: DisplayInboundIndicatorsService,
    private alertService: AlertService,
    private envService: EnvService,
    private modalService: NgbModal,
    private userSelectionService: UserSelectionService
  ) {
    this.env = envService;
    this.model = new DisplayInboundModel();

    this.currentDate = moment(new Date()).format("YYYY-MM-DD");
    this.rows = new DisplayInboundResponseModel();
    this.rows_original = new DisplayInboundResponseModel();

    this.displayUserSelection = new UserSelectionModel("standard");
    this.selectorVisibleFields = new UserSelectionModel("visible");

    this.selectorVisibleFields.assignation = false;
    this.selectorVisibleFields.auxiliar = false;
  }

  // Start
  ngOnInit() {
    this.getReportList();
    this.filterFieldList = this.model.fieldList();
    this.numberOfRowsInTable = { id: 10, value: 10 };
    this.exportName = "reporte-conexión";

    this.initialSelectedFilterField = {
      field_name: "start_date",
      name: "fecha_inicio",
      text: "Fecha desde"
    };
    this.onRepeat();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // this.timerComponent.unsubscribe();
    // this.timerClock.unsubscribe();
  }

  onRepeat() {
    if (true) {
      this.timerComponent = timer(1000, 5000);
      this.timerClock = timer(1000, 1000);

      this.getReportList();
      this.subscription.add(
        this.timerComponent.subscribe(() => {
          if (
            objectDateToTextDate(this.displayUserSelection.start_date) ===
            this.currentDate
          ) {
            this.getReportList();
          } else {
          }
        })
      );

      this.timerClock.subscribe(() => {
        this.timerConnected = this.timerConnected + 1;
      });
    } else {
      this.subscription.unsubscribe();
      // this.timerComponent.unsubscribe();
      // this.timerClock.unsubscribe();
    }
  }

  setHeaderInfo(displayUserSelection) {
    displayUserSelection.title = "Display de llamadas entrantes";
    displayUserSelection.options = "-";
    displayUserSelection.legend = "-";
    return displayUserSelection;
  }

  // Get records from backend
  getReportList() {
    let userSelectionTemp = new UserSelectionModel("standard");
    this.displayUserSelection = this.setHeaderInfo(userSelectionTemp);

    this.displayInboundIndicatorsService
      .getReportList(this.displayUserSelection)
      .subscribe(
        (res: DisplayInboundResponseModel) => {
          this.timerConnected = 0;

          if (res) {
            // res.colors = res.colors[0];
            this.rows = res;
            this.displayUserSelection = res.userSelection;
            // console.log("res", res.userSelection);
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

  // Get records from backend
  getDisplayShow(displayUserSelection) {
    if (displayUserSelection) {
      this.displayInboundIndicatorsService
        .getDisplayShow(displayUserSelection)
        .subscribe(
          res => {
            if (res) {
              let temp = res[0].pro_show_display_selection;
              let temp2 = JSON.parse(temp);
              return temp2;
            } else {
              return this.displayUserSelection;
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

  // Show modal detail window
  openDetailModal(content, selected) {
    this.activeModal = this.modalService.open(content, {
      windowClass: "my-class",
      keyboard: false
    });
  }

  // Show or hide graph or table buttons
  onShowHideGraphButtons() {
    this.graph = !this.graph;
    this.show_graph_or_table_button = !this.show_graph_or_table_button;
  }
  // Data table activate
  onActivate(event) {
    this.row_selection = event.row;
    if (event.type === "dblclick") {
    }
  }
  // Datatable select
  onSelect(event) {
    this.selected = event.selected;
  }

  // Update on return of selector in header
  onReturnHeaderResult(event) {
    this.displayUserSelection = new UserSelectionModel("standard");
    this.getReportList();
    this.show_graph_or_table_button = false;
    this.childGraph ? this.childGraph.generateGraph("header", this.rows) : "";
  }

  // Activated by button
  onRecalculate(event) {
    this.displayUserSelection = new UserSelectionModel("standard");
    this.getReportList();
    this.show_graph_or_table_button = false;
    console.error("this.rows", this.rows);

    this.childGraph ? this.childGraph.generateGraph("button", this.rows) : "";
  }

  // Response report finder to display number of rows in table
  onReturnNumberOfRowsInTable(event) {
    console.error("event", event);
    this.numberOfRowsInTable = event;
  }

  // Response report finder
  onReturnRowsForTable(event) {
    this.rows = event;
  }

  // Helper function to expose detail fields from a row
  onObjectToArray(data) {
    let obj = data[0];

    let output;
    if (obj !== undefined) {
      output = Object.entries(obj).map(([key, value]) => ({
        key,
        value
      }));
    }
    return output;
  }

  // temporary method to generate excel map for exporting model
  onCreateModel(model?) {
    model = new DisplayInboundModel().fieldList();

    console.error("model", model);

    let obj = {};

    model.map(x => {
      obj[`${x.name}`] = "x." + x.field_name;
    });

    let newModel = JSON.stringify(obj);
    let newModel2 = JSON.stringify(
      newModel
        .replace(/\"/g, "")
        .replace(/:/g, ": ")
        .replace(/,/g, ",\n ")
    );
    let model3 = eval(newModel2);

    console.error("model", model3);
  }

  //Test function for modal
  openModal(content) {
    // this.rows_detail = this.rows_detail_original.filter(x => {
    //   return x.agent_id === this.row_selection.agent_id;
    // });
    // this.rows_detail_total = this.rows_original.filter(x => {
    //   return x.agent_id === this.row_selection.agent_id;
    // });
    // this.activeModal = this.modalService.open(content, {
    //   windowClass: "my-class",
    //   keyboard: false
    // });
  }
}
