import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { Sticky } from './../../models/sticky.model';
import { StickyComponent } from './sticky.component';
import { UserService } from './../../services/user.service';
import { StickyService } from './../../services/sticky.service';
import { FlashMessagesService } from 'angular2-flash-messages';

describe('StickyComponent', () => {
  let component: StickyComponent;
  let fixture: ComponentFixture<StickyComponent>;
  let de;
  let el;

  class UserServiceStub {
    isAuthenticated() {
      return true;
    }
  }
  class StickyServiceStub {

  }
  class FlashMessagesServiceStub {
  }
  class RouterStub {

  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ StickyComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: UserService, useClass: UserServiceStub},
        {provide: StickyService, useClass: StickyServiceStub},
        {provide: FlashMessagesService, useClass: FlashMessagesServiceStub},
        {provide: Router, useClass: RouterStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StickyComponent);
    component = fixture.componentInstance;
    component.cardType = 'available';
    // component.sticky = {
    //   _id: "5a8b551c6a4c9326c48575f2",
    //   created_at: "2018-02-19T22:52:12.864Z",
    //   from : 'Anonymous',
    //   message : "I give you this food item as an act of Kindness. May you also spread love and kindness to others.",
    //   redeemed: false,
    //   redeemedDate: null,
    //   reserved: false,
    //   reservedBy: null,
    //   reservedDate: null,
    //   title: "Strawberry Crepes",
    //   updatedAt: "2018-02-19T22:52:12.864Z"
    // };
    component.sticky = new Sticky('Strawberry Crepes', 'Hope you enjoy it.', 'Anonymous');
    component.sticky.user = {
        name: 'Rosas Pizza',
        address: '75 Liberty st w.h',
        city: 'Newburgh',
        state: "NY"};
    component.isLoggedIn = true;
    // component.reserveMode = false;
    // component.editMode = false;
    // component.errorMode = false;
    // component.errorMessage = '';
    // component.deletePrompt = false;
    
      component.ngOnInit();
      fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 
  describe('AVAILABLE & LOGGED IN', () => {
    //Corrrect sticky template is shown
    it('should display correct template', () => {
      
      de = fixture.debugElement.query(By.css('.card-title'));
      el = de.nativeElement;
      expect(el.textContent).toContain('Strawberry Crepes');
      // user info
      de = fixture.debugElement.query(By.css('small.card-text'));
      el = de.nativeElement;
      expect(el.textContent).toContain('75 Liberty st');
    });

    // Reserve Form
    it('should display Reserve Form', () => {
      component.reserveMode = true;
      fixture.detectChanges();
      // checking for existence of #reserveControl on input
      de = fixture.debugElement.query(By.css('input#reserveControl'));
      el = de.nativeElement;
      expect(el).toBeTruthy();
    });
    //Edit Form
      it('should display Edit Form', () => {
        component.editMode = true;
        fixture.detectChanges();
        // checking for existence of #reserveControl on input
        de = fixture.debugElement.query(By.css('input#editControl'));
        el = de.nativeElement;
        expect(el).toBeTruthy();
      });

  });
  describe('RESERVED & LOGGED IN', () => {
    //correct sticky template is shown
    it('should display correct template', () => {
      component.cardType = 'reserved';
      component.sticky.reserved = true;
      component.sticky.reservedBy = "Thomas";
      fixture.detectChanges();
      de = fixture.debugElement.query(By.css('small.card-text'));
      el = de.nativeElement;
      expect(el.textContent).toContain('Thomas');
      
    });
  });
  describe('REDEEMED & LOGGED IN', () => {
    //correct sticky template is shown
    it('should display correct template', () => {
      component.cardType = 'redeemed';
      component.sticky.reserved = true;
      component.sticky.reservedBy = "Thomas";
      fixture.detectChanges();
      de = fixture.debugElement.query(By.css('small.card-text'));
      el = de.nativeElement;
      expect(el.textContent).toContain('Thomas');
      
    });
  });
  describe('AVAILABLE & NOT LOGGED IN', () => {
    //correct sticky template is shown
    it('should display correct template', () => {
      component.isLoggedIn = false;
      fixture.detectChanges();
      de = fixture.debugElement.query(By.css('#loggedOut'));
      el = de.nativeElement;
      expect(el).toBeTruthy();      
    });
  });
});
