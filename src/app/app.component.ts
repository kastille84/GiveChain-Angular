import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private userService: UserService) {}

  ngOnInit() {
    // check if locastorage holds a token
    if (localStorage.getItem('token')) {
      this.userService.setLoggedIn();
    }
  }
}
