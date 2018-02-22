import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { StickyCreateComponent } from './sticky-create.component';
import { StickyService } from '../../services/sticky.service';
import { Sticky } from '../../models/sticky.model';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('StickyCreateComponent', () => {
  let component: StickyCreateComponent;
  let fixture: ComponentFixture<StickyCreateComponent>;
  let de: DebugElement;

  class StickyServiceStub {
    create() {}
    getStickies() {}
  }
  class RouterStub {}
  class FlashMessagesServiceStub {
    show() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ StickyCreateComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StickyService, useClass: StickyServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: FlashMessagesService, userClass: FlashMessagesServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyCreateComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should configure form',() => {
    expect(component.createForm).toBeTruthy();
    expect(component.createForm.status).toBe('INVALID');
  });
  // Should call stickyservice.create
  // it('should call Create method on StickyService', () => {
  //   component.createForm.controls['title'].setValue("Mango Smoothie");
  //   component.createForm.controls['message'].setValue("Hope you enjoy it");        
  //   component.createForm.controls['from'].setValue("Anonymous");
  //   let sticky1 = new Sticky('Strawbery Sunday', 'Hope you like it', 'Anonymous');

  //   // const spy = spyOn(TestBed.get(StickyService), 'create').and.returnValue(Observable.of([sticky1]));
  //   // spyOn(TestBed.get(StickyService), 'getStickies').and.returnValue([sticky1]);
  //   //spyOn(TestBed.get(FlashMessagesService), 'show').and.callFake(() => {});
  //   component.onSubmit();
  //   fixture.detectChanges();
  //   expect(spy).toHaveBeenCalled();

  // });

});
