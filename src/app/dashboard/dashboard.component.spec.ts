import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { StickyService } from '../services/sticky.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  class FlashMessagesServiceStub {
  }
  class StickyServiceStub {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: FlashMessagesService, useClass: FlashMessagesServiceStub},
        {provide: StickyService, useClass: StickyServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    //component.ngOnInit();
    fixture.detectChanges();
  });

});
