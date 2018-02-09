import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/from';

import { RegisterComponent } from './register.component';
import { UserService } from './../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { User } from './../../models/user.model';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let de: DebugElement;
  let service;

  class UserServiceStub {
      register() {
        return Observable;
      }

  }
  class RouterStub {

    navigate(url) {
      return url;
    }
  }
  class ActivatedRouteStub {
  }
  class FlashMessagesServiceStub {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ RegisterComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: UserService, useClass: UserServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: FlashMessagesService, useClass: FlashMessagesServiceStub},
      
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    

    component.ngOnInit();
    fixture.detectChanges();
  });

  describe("Validation", () => {
    it('should be INVALID on ngOnInit', () => {
      expect(component.registerForm.status).toBe('INVALID');
    });
  
    it('should be INVALID if username is empty upon submission', () => {
      let el = de.query(By.css('button')); 
      el.triggerEventHandler('click', null);
      fixture.detectChanges();
  
      expect(component.registerForm.controls['username'].status).toBe('INVALID');
    });
  
    it('should be INVALID if email is NOT typed correctly', () => {
      component.registerForm.controls['email'].setValue("test");
      fixture.detectChanges();
  
      expect(component.registerForm.controls['email'].status).toBe('INVALID');
    });
  
    it('should be VALID if email is typed correctly', () => {
      component.registerForm.controls['email'].setValue("test@gmail.com");
      fixture.detectChanges();
  
      expect(component.registerForm.controls['email'].status).toBe('VALID');
    });

    it('should be INVALID if state is more than 2 chars', () => {
      component.registerForm.controls['state'].setValue('FLA');
      fixture.detectChanges();

      expect(component.registerForm.controls['state'].status).toBe('INVALID');
    });

  });

  it('should call register method on UserService when form is VALID', () => {
    service = TestBed.get(UserService);
    let spy = spyOn(service, 'register').and.returnValue(Observable.empty());

    component.registerForm.controls['username'].setValue('testname');
    component.registerForm.controls['email'].setValue('testemail@gmail.com');
    component.registerForm.controls['password'].setValue('testname345');
    component.registerForm.controls['name'].setValue('testname');
    component.registerForm.controls['url'].setValue('testurl');
    component.registerForm.controls['address'].setValue('125 Address st');
    component.registerForm.controls['city'].setValue('testcity');
    component.registerForm.controls['state'].setValue('NY');
    component.registerForm.controls['zipcode'].setValue('12550');
    component.registerForm.controls['phone'].setValue('8454013350');
    
    fixture.detectChanges();  
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
  });
});
