import { Component, OnInit, Input } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-display-inbound-breaks-assignations",
  templateUrl: "./display-inbound-breaks-assignations.component.html",
  styleUrls: ["./display-inbound-breaks-assignations.component.scss"]
})
export class DisplayInboundBreaksAssignationsComponent implements OnInit {
  @Input() rows;
  @Input() displayUserSelection;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  openModal(content) {
    this.modalService.open(content, {
      size: "lg",
      ariaLabelledBy: "modal-basic-title"
    });
  }

  selectLine(content, id) {
    this.displayUserSelection.selected_break = id;
    this.modalService.open(content, {
      size: "lg",
      ariaLabelledBy: "modal-basic-title"
    });

    // console.error('name',id, this.displayUserSelection);
  }
}
