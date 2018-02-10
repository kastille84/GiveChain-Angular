import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, DoCheck {
  isLoggedIn = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    // check to see if you are logged in
    this.userService.loggedInEvent.subscribe( (status) => {
      this.isLoggedIn = status;
    });
  }
  
  ngDoCheck() {
    this.isLoggedIn = this.userService.loggedInStatus;
  }

  onLogout() {
    this.userService.setLogout();
    // redirect to Login page
    this.router.navigate(['/login']);
  }

}
