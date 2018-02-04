import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
        private userService: UserService, 
        private router: Router,
        private route: ActivatedRoute) { }

  ngOnInit() {
    // create the form
    this.loginForm = new FormGroup({
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.userService.login(
        this.loginForm.value.username, 
        this.loginForm.value.password).subscribe(
           (data) => {
             // im logged in .. AND Getting token
             localStorage.setItem('token', data['token']);

             // redirect to DASHBOARD
            this.router.navigate(['/dashboard']);
           }
        );
  }

}
