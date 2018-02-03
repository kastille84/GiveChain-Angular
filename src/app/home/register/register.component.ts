import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor( private userService: UserService) { }

  ngOnInit() {    
    this.registerForm = new FormGroup({
        'username': new FormControl(null, Validators.required),
        'email': new FormControl(null, [
                  Validators.required,
                  Validators.email]),
        'password': new FormControl(null, Validators.required),
        'name': new FormControl(null, Validators.required),
        'url': new FormControl(null, Validators.required),
        'address': new FormControl(null, Validators.required),
        'city': new FormControl(null, Validators.required),
        'state': new FormControl(null, [
                  Validators.required,
                  Validators.maxLength(2)]),
        'zipcode': new FormControl(null, Validators.required),
        'phone': new FormControl(null),
    });
  }

  onSubmit() {
    // #TODO - validation - this.registerForm.
      // if (this.registerForm.status == 'INVALID'){

      // }
      
    const newUser = new User(
      this.registerForm.value.username,
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.name,
      this.registerForm.value.url,
      this.registerForm.value.address,
      this.registerForm.value.city,
      this.registerForm.value.state,
      this.registerForm.value.zipcode,
      this.registerForm.value.phone
    );
    
    this.userService.register(newUser)
        .subscribe(
          (response) => {
           
            console.log("response", response);
          },
          () => {}
        );
  }

}