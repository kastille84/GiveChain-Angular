import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isCityStateSet = false;
  csSubscription: Subscription;
  constructor(private userService: UserService) { }

  ngOnInit() {
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

  ngOnDestroy() {
    this.csSubscription.unsubscribe();
  }

}
