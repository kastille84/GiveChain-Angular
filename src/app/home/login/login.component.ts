import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from './../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';

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
        private route: ActivatedRoute,
        private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    // create the form
    this.loginForm = new FormGroup({
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    // if NO validation errors, then SUBMIT
    if (this.loginForm.status === 'VALID'){
        this.userService.login(
            this.loginForm.value.username, 
            this.loginForm.value.password)
            .subscribe(
              (data) => {
                // im logged in .. AND Getting token
                localStorage.setItem('token', data['token']);
                localStorage.setItem('expiresAt', data['expiresAt']);
                localStorage.setItem('verified', 'true');

                //user userService to hold a login status
                this.userService.setLoggedIn();

                // redirect to DASHBOARD
                this.router.navigate(['/dashboard']);
              },
              (err) => {
                if (err.error.verify === false) {
                  this.flashMessagesService
                        .show('Cannot Log In Yet. You received an Email to verify yourself. Visit email and follow instructions.', 
                              {cssClass: 'alert alert-warning', timeout: 7000}
                        );
                        return;
                }

                this.flashMessagesService
                      .show('Incorrect Username/Password. Try Again.', 
                            {cssClass: 'alert alert-danger', timeout: 5000}
                      );
              }
            );
    }
    
  }

}
