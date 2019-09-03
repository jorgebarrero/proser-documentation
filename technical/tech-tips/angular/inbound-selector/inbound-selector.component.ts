import { Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


import { AuthService } from 'src/app/shared/services/pages/auth.service';
import { AlertService } from 'src/app/shared/services/helpers/alert.service';


import { Router } from '@angular/router';
import { AlertModel } from 'src/app/shared/models/Alert';
import { MenuOptions } from 'src/app/shared/models/filter/MenuOptions';
import { UserSelection } from 'src/app/shared/models/filter/Selection';

import { datePickerToText } from 'src/app/shared/functions/dates';
import { dateToDatePicker } from 'src/app/shared/functions/dates';
import { MenuNewService } from 'src/app/shared/services/filter/menu-new.service';

@Component({
  selector: 'app-inbound-selector',
  templateUrl: './inbound-selector.component.html',
  styleUrls: ['./inbound-selector.component.scss']
})
export class InboundSelectorComponent implements OnInit, OnDestroy {

  @Output() selectedOptions =  new EventEmitter;

// @Input() menuOptions: MenuOptions;
@Input() userSelection: MenuOptions;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private menuNewService: MenuNewService,

  ) {

    // this.userSelection === {} ? this.userSelection = new MenuOptions : this.userSelection;

  }

  selectorForm: FormGroup;
  submitted = false;
  alertMessage = new AlertModel;
  menuOptions = new MenuOptions;


  ngOnInit() {

    this.getList(this.userSelection);

    this.selectorForm = this.formBuilder.group({

      start_date: [dateToDatePicker(this.userSelection.start_date), Validators.required ],
      end_date: [dateToDatePicker(this.userSelection.end_date), Validators.required],
      start_time: [this.userSelection.start_time, Validators.required],
      end_time: [this.userSelection.end_time, Validators.required],
      interval: [this.userSelection.interval, Validators.required],
      last_minutes: [this.userSelection.last_minutes, Validators.required],

      client: [this.userSelection.client, Validators.required],
      queue: [this.userSelection.queue, Validators.required],
      service: [this.userSelection.service, Validators.required],
      campaign: [this.userSelection.campaign, Validators.required],
      supervisor: [this.userSelection.supervisor, Validators.required],
      agent: [this.userSelection.agent, Validators.required],
      schedule: [this.userSelection.schedule, Validators.required],

      reportlines: [this.userSelection.reportlines, Validators.required],

    });
  }

  ngOnDestroy() {

    const selection = this.extend(this.userSelection, this.selectorForm.value);

    console.log('selection before', selection);

    selection.start_date = (this.selectorForm.value.start_date);
    selection.end_date = (this.selectorForm.value.end_date) ;

    this.selectedOptions.emit(selection);

    console.log('selection after', selection);

  }

  // convenience getter for easy access to form fields
  get f() { return this.selectorForm.controls; }

  onResetForm() {
    this.alertMessage = new AlertModel;
    this.submitted = false;
    this.selectorForm.reset();
  }

  onChange() {

  }

  onChangeDate() {
    this.onChange();
    const selection = this.extend(this.userSelection, this.selectorForm.value);
    selection.start_date = datePickerToText(this.selectorForm.value.start_date);
    selection.end_date = datePickerToText(this.selectorForm.value.end_date) ;
     this.getList(selection);
  }

  extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}


getList(userSelection) {
  this.menuNewService.getSelectionMenu(userSelection)
  .subscribe( data => {
    // console.log('Menu', data);
    this.menuOptions = data;
  });
}

onSubmit() {
  this.selectedOptions.emit(this.userSelection);
}

}
