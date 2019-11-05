import { UserSelectionModel } from "shared/models";

export class DashboardInboundResponseModel {
  dashboardInboundCallsIndicators: [
    {
      now;
      day_name;
      week_day;
      start_date;
      start_time;
      end_time;
      idealResponseTime;
      shortTimeDef;
      inboundReceived;
      inboundAbandoned;
      inboundAttended;
      inboundShort;
      inboundBeforeTime;
      inboundAfterTime;
      inboundHungAgent;
      inboundServiceLevel;
      inboundAttentionLevel;
      inboundAbandonLevel;
      operation_seconds;
      operation_time;
      wait_seconds;
      wait_time;
      inboundTmo;
      inboundAsa;
    }
  ];
  dashboardInboundCurrentCallsIndicators: [
    {
      now;
      callsActive;
      callsOnQueue;
    }
  ];
  agentsPlannedTotal: [
    {
      now;
      agentsPlannedTotal;
    }
  ];
  agentsConnectedTotal: [
    {
      now;
      agentsConnectedTotal;
      agentsEffectiveTotal;
    }
  ];

  agentsLoggedTotal: [
    {
      now;
      agentsConnectedTotal;
      agentsEffectiveTotal;
    }
  ];

  agentsConnectedByGroup: [
    {
      now;
      name;
      color;
      value;
    }
  ];

  agentHistoricResume: [
    {
      now;
      concept;
      count_agents;
      duration_agents;
      average_agents;
    }
  ];

  agentsAuxiliarResume: [
    {
      now;
      name;
      id;
      value;
      duration;
    }
  ];
  agentsAssignationResume: [
    {
      now;
      name;
      id;
      value;
      duration;
    }
  ];
  scale: any;
  colors: any;
  userSelection: any;

  constructor() {
    this.dashboardInboundCallsIndicators = [
      {
        now: "",
        day_name: "",
        week_day: "",
        start_date: "",
        start_time: "",
        end_time: "",
        idealResponseTime: "",
        shortTimeDef: "",
        inboundReceived: "",
        inboundAbandoned: "",
        inboundAttended: "",
        inboundShort: "",
        inboundBeforeTime: "",
        inboundAfterTime: "",
        inboundHungAgent: "",
        inboundServiceLevel: "",
        inboundAttentionLevel: "",
        inboundAbandonLevel: "",
        operation_seconds: "",
        operation_time: "",
        wait_seconds: "",
        wait_time: "",
        inboundTmo: "",
        inboundAsa: ""
      }
    ];

    this.dashboardInboundCurrentCallsIndicators = [
      {
        now: "",
        callsActive: "",
        callsOnQueue: ""
      }
    ];

    this.agentsPlannedTotal = [
      {
        now: "",
        agentsPlannedTotal: ""
      }
    ];

    this.agentsConnectedTotal = [
      {
        now: "",
        agentsConnectedTotal: "",
        agentsEffectiveTotal: ""
      }
    ];

    this.agentsLoggedTotal = [
      {
        now: "",
        agentsConnectedTotal: "",
        agentsEffectiveTotal: ""
      }
    ];

    this.agentsConnectedByGroup = [
      {
        now: "",
        name: "",
        color: "",
        value: null
      }
    ];

    this.agentHistoricResume = [
      {
        now: "",
        concept: "",
        count_agents: "",
        duration_agents: "",
        average_agents: ""
      }
    ];

    this.agentsAuxiliarResume = [
      {
        now: "",
        name: "",
        id: "",
        value: "",
        duration: ""
      }
    ];

    this.agentsAssignationResume = [
      {
        now: "",
        name: "",
        id: "",
        value: "",
        duration: ""
      }
    ];

    this.userSelection = new UserSelectionModel("standard");
  }
}
