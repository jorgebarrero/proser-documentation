# Proser workplan


# Tuesday, August 27th 2019
- Install git-flow tools
- Learn to use new gitflow structure
- Create documentation repo
- Migrate documentation


# Friday, August 23th 2019
## Plan
- Fix: backend Inbound Display for default selection and multiple scales
- Add: process variables override
- Fix: frontend Inbound Display scales parameter
- Fix: frontend inbound Display graph, higligt component, historic view


## Wednesday, July 31th 2019
- Partial: userSelectionMenu



## Saturday, July 27th 2019
- Add: System & Command Model

## Friday, July 26th 2019
- Fix: DB
- Partial: Selector

## Tuesday, July 16th 2019
- Fix: crud-aux-hour missign fields


## Thursday, July 10th 2019
- Fix: Cleanup names in databases in loopback

## Wednedsday, July 10th 2019
- Add: Fix locale to decimal numbers
  

## Monday, July 8th 2019
- fix: cdr queries

## Sunday, July 7th 2019
- Partial: inbound dashboard lists
- Add: Database models imported from loopback
- Partial: Inbound dashboard error managment

## Saturday, July 6th 2019
- Fix: Extract data from  origin
- Fix: Transform Inv tables
- Add: Update-Audit para actualizar registros sin terminar
- Add: Update-Callentry para actualizar registros sin terminar
- Partial: Transform cdr & audit
- Fix: Load scripts in sync/etl

## Friday, July 5th 2019
- With leo


## Thursday, June 27th 2019
- Add: Display for inbound calls
- Add: Agent reports select detail
- Partial: CRUD Colors
- Fix: Inv from InvQueConfig to InvSupervisor models
- Fix: MainCdrClasif to RealCurrenAgents models

# Wednesday, June 26th 2019
- Fix: Table filter in dashboard & reports


## Thursday, June 20th 2019
- Add: Schedule Days into HCA files
	hca_agent_schedule_day (key: schedule_id + week_day)
  hca_agent_guard: (date + key hca_agent_id)
- Add: Display functionality to select views

## Wednesday, June 19th 2019
- Remove: reports
- Add: Outbound Higligths & Automatic structure



## Tuesday, June 18th 2019

- Add: checkbox to see historic agent data today in dashboard selector
- Add: list of agents in historic breaks
- Fix: call lists at inbound levels
- Fix: include wait time in abandoned list
- Fix: Connected agents login time
- Fix: Connected Agent Pie inicators
- Fix: list of agents in breaks by type
- Fix: Change pointer in cliclable items inbound dashboard
- Fix: Agent break columns css
- Add: Call inbound lists
- Fix: Break and Asignation find field
- Add: Dayly graph



## Features
- fixHighligts
  Create a class model with elements that prevent the array undefiend error

- filterBreadcrumbs
  Line with breadcrums that represent the filter. They will be stores in the filter in a property called filterBreadcrums
  It will be an independant function
