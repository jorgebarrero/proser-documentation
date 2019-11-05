import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DisplayMonitorRoutingModule } from "./display-monitor-routing.module";
import { DisplayMonitorComponent } from "./display-monitor.component";

import { DisplayMonitorCallsComponent } from "./display-monitor-calls/display-monitor-calls.component";
import { DisplayMonitorAgentsComponent } from "./display-monitor-agents/display-monitor-agents.component";
import { DisplayMonitorIndicatorsComponent } from "./display-monitor-indicators/display-monitor-indicators.component";

@NgModule({
  declarations: [
    DisplayMonitorComponent,
    DisplayMonitorCallsComponent,
    DisplayMonitorAgentsComponent,
    DisplayMonitorIndicatorsComponent
  ],
  imports: [CommonModule, DisplayMonitorRoutingModule]
})
export class DisplayMonitorModule {}
