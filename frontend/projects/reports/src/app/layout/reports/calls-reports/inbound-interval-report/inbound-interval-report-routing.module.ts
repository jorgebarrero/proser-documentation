import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InboundIntervalReportComponent } from './inbound-interval-report.component';




const routes: Routes = [
  {
    path: "",
    component: InboundIntervalReportComponent,
    children: [
      // { path: "", redirectTo: "list" },
      // { path: "list", component: AuditReportListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InboundIntervalReportRoutingModule { }
