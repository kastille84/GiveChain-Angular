import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  cityForm: FormGroup;
  isCityStateSet = false;
  csSubscription: Subscription;
  constructor(private userService: UserService) { }

  ngOnInit() {
    // set up form
    this.cityForm = new FormGroup({
        'city': new FormControl(null, Validators.required),
        'state': new FormControl(null, [
          Validators.required,
          Validators.maxLength(2)
        ])
    });

    // check authenticated status
    if (!this.userService.isAuthenticated()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('url');
    }

    // check if city and state are set in local storage
    if (localStorage.getItem('city') && localStorage.getItem('state')) {
      this.isCityStateSet = true;
    }

    this.csSubscription = this.userService.cityStateChangedEvent.subscribe(bool => {
      this.setCityStateChange();
    });
  }

  setCityStateChange() {
    // check if city and state are set in local storage
    if (localStorage.getItem('city') && localStorage.getItem('state')) {
      this.isCityStateSet = true;
    } else {
      this.isCityStateSet = false;
    }
  }

  onSubmit() {
    if (this.cityForm.status !== 'INVALID') {
      // set city and state in localstorage
      localStorage.setItem('city', this.cityForm.controls['city'].value);
      localStorage.setItem('state', this.cityForm.controls['state'].value);

      this.isCityStateSet = true;
    }
  }

  ngOnDestroy() {
    this.csSubscription.unsubscribe();
  }

}
