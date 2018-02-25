import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  id;
  hash;
  newPassForm: FormGroup;

  constructor(private route: ActivatedRoute, 
          private flashMessagesService: FlashMessagesService,
          private userService: UserService,
          private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.hash = this.route.snapshot.params['hash'];
    
    this.newPassForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      passwordAgain: new FormControl(null, Validators.required),
      id: new FormControl(this.id),
      hash: new FormControl(this.hash)
    });
  }
  
  onSubmit() {
    if (this.newPassForm.status === 'VALID') {
      // make sure both passwords match
      if (this.newPassForm.controls['password'].value 
              === this.newPassForm.controls['passwordAgain'].value) {
          this.userService.setNewPassword(this.id, this.hash, this.newPassForm.controls['password'].value)
                    .subscribe(
                      result => {
                        this.flashMessagesService.show('Password Changed. Now Log In with New Password.', 
                              {cssClass: 'alert alert-success', timeout: 4000});

                        setTimeout(() => {
                          this.router.navigate(['/login']);
                        }, 4500)
                      }
                    );
          
      } else {
        //flash
        this.flashMessagesService.show('Passwords Do Not Match. Please check your typing.', 
                          {cssClass: 'alert alert-danger', timeout: 4500});

      } 
    } else {
      // flash
      this.flashMessagesService.show('Form is Invalid. Please retry submitting.', {cssClass: 'alert alert-danger', timeout: 4500});
    }
  }

}
