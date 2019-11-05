import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-display-outbound-agents",
  templateUrl: "./display-outbound-agents.component.html",
  styleUrls: ["./display-outbound-agents.component.scss"]
})
export class DisplayOutboundAgentsComponent implements OnInit {
  @Input() displayUserSelection;
  @Input() rows;

  constructor() {}

  ngOnInit() {}
}
