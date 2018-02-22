import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { StickiesReservedComponent } from './stickies-reserved.component';
import { StickyService } from '../../services/sticky.service';
import { Sticky } from '../../models/sticky.model';

describe('StickiesReservedComponent', () => {
  let component: StickiesReservedComponent;
  let fixture: ComponentFixture<StickiesReservedComponent>;
  let de: DebugElement;

  class StickyServiceStub {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickiesReservedComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StickyService, useClass: StickyServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickiesReservedComponent);
    component = fixture.componentInstance;
    let sticky1 = new Sticky('Strawbery Sunday', 'Hope you like it', 'Anonymous');
    sticky1.reserved = true;
    sticky1.reservedBy = "Thomas";

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
