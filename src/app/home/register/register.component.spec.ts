import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core/src/debug/debug_node';
import { By } from '@angular/platform-browser';

import { RegisterComponent } from './register.component';
import { UserService } from './../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FILE } from 'dns';


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let de: DebugElement;

  class UserServiceStub extends UserService {

  }
  class RouterStub {
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
        {provide: UserService, userClass: UserServiceStub},
        {provide: Router, userClass: RouterStub},
        {provide: ActivatedRoute, userClass: ActivatedRouteStub},
        {provide: FlashMessagesService, userClass: FlashMessagesServiceStub},
      
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

  })


});
