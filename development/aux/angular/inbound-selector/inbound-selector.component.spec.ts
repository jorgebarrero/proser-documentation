import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundSelectorComponent } from './inbound-selector.component';

describe('InboundSelectorComponent', () => {
  let component: InboundSelectorComponent;
  let fixture: ComponentFixture<InboundSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
