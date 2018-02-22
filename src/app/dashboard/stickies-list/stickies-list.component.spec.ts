import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { StickiesListComponent } from './stickies-list.component';
import { StickyService } from './../../services/sticky.service';
import { StickyComponent } from '../../shared/sticky/sticky.component';
import { Sticky } from './../../models/sticky.model';

describe('StickiesListComponent', () => {
  let component: StickiesListComponent;
  let fixture: ComponentFixture<StickiesListComponent>;
  let de: DebugElement;
  // Stubs
  class StickyServiceStub {

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickiesListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: StickyService, useClass: StickyServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickiesListComponent);
    component = fixture.componentInstance;
    let sticky1 = new Sticky('Strawbery Sunday', 'Hope you like it', 'Anonymous');
    
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
