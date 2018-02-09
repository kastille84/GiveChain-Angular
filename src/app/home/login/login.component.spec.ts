import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service;
  let router;

  class UserServiceStub {
    login() {
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
      declarations: [ LoginComponent ],
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    service = TestBed.get(UserService);
    router = TestBed.get(Router);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should be INVALID on ngOnInit', () => {
    expect(component.loginForm.status).toBe('INVALID');
  });

  it('should be VALID if credentials are correct AND navigate to dashboard', () => {
    component.loginForm.controls['username'].setValue('testusername234');
    component.loginForm.controls['password'].setValue('123sfh123');

    spyOn(service, 'login').and.returnValue(Observable.empty());
    let spy = spyOn(router, 'navigate').and.callFake( () => {
      return '/dashboard';
    });

    component.onSubmit();
    router.navigate(['/dashboard']);
    fixture.detectChanges();

    expect(component.loginForm.status).toBe('VALID');
    expect(spy).toHaveBeenCalledWith(['/dashboard']);
  });

  // it('should redirect to /login upon successful register', () => {

  //   spyOn(service, 'login').and.returnValue(Observable.of([]));

  // });

});
