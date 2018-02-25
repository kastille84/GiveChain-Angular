import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  createPasswordForm: FormGroup;
  constructor(private userService: UserService,
              private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    this.createPasswordForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    if (this.createPasswordForm.status === 'VALID') {
      const email = this.createPasswordForm.controls['email'].value;
      this.userService.changePassword(email).subscribe(result => {
        this.flashMessagesService.show('We sent you an email with instructions. Please check your email.', 
                        {cssClass: 'alert alert-success', timeout: 8000});
        
      });
    } else {
      this.flashMessagesService.show('Could not submit. Please check your email.', {cssClass: 'alert alet-danger', timeout: 3500});
    }
  }

}
