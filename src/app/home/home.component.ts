import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCityStateSet = false;

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
  }

}
