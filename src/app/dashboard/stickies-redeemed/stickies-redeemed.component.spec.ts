import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { StickiesRedeemedComponent } from './stickies-redeemed.component';
import { StickyService } from '../../services/sticky.service';
import { UserService } from '../../services/user.service';
import { Sticky } from '../../models/sticky.model';

describe('StickiesRedeemedComponent', () => {
  let component: StickiesRedeemedComponent;
  let fixture: ComponentFixture<StickiesRedeemedComponent>;
  let de: DebugElement;

  class StickyServiceStub {}
  class UserServiceStub {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickiesRedeemedComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StickyService, useClass: StickyServiceStub},
        {provide: UserService, useClass: UserServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickiesRedeemedComponent);
    component = fixture.componentInstance;
    let sticky1 = new Sticky('Strawbery Sunday', 'Hope you like it', 'Anonymous');
    sticky1.reserved = true;
    sticky1.reservedBy = "Thomas";
    sticky1.redeemed = true;
    sticky1.redeemedDate = new Date().getTime().toString();
    component.isLoggedIn = true;

    spyOn(component, 'ngOnInit').and.returnValue([sticky1]);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a sticky component', () => {
    de = fixture.debugElement.query(By.css('app-sticky'));
    let el = fixture.nativeElement;
    expect(el).toBeTruthy();
  });
});
