import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  constructor(private userService: UserService,
          private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
      subject: new FormControl(null, Validators.required),
      message: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    if (this.contactForm.status === 'VALID') {
      const subject = this.contactForm.controls['subject'].value;
      const message = this.contactForm.controls['message'].value;
      const email = this.contactForm.controls['email'].value;

      this.userService.contact(subject, message, email).subscribe(
          result => {
            this.flashMessagesService.show('Message Sent! We Will Email You Soon.', {cssClass: 'alert alert-success', timeout: 4500});
            this.contactForm.reset();
          },
          error => {
            this.flashMessagesService.show('Could Not Send Message. Try Again Later.', {cssClass: 'alert alert-danger', timeout: 4500});
          }
      );

    } else {
      this.flashMessagesService.show('Invalid Input. Check your typing.', {cssClass: 'alert alert-danger', timeout: 4500});

    }
  }

}
