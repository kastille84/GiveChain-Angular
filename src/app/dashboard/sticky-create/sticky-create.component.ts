import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from '../../services/sticky.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';


@Component({
  selector: 'app-sticky-create',
  templateUrl: './sticky-create.component.html',
  styleUrls: ['./sticky-create.component.css']
})
export class StickyCreateComponent implements OnInit {
  createForm: FormGroup;

  constructor(private stickyService: StickyService,
          private router: Router, 
          private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    this.createForm = new FormGroup({
      'title': new FormControl(null, [
                Validators.required,
                Validators.maxLength(40)
              ]),
      'message': new FormControl(null,
                Validators.maxLength(130)
              ),
      'from': new FormControl(null,
                Validators.maxLength(40)
              )
    });

  }

  onSubmit() {
    if (this.createForm.status !== 'INVALID') {
      // create sticky 
      const newSticky = new Sticky(
        this.createForm.controls['title'].value,
        this.createForm.controls['message'].value,        
        this.createForm.controls['from'].value
      );
      console.log(this.createForm);     

      this.stickyService.create(newSticky).subscribe(
        (resp: any) => {
          const sticky = resp.sticky;
          const stickyList = this.stickyService.getStickies();         
          stickyList.unshift(sticky);

          this.flashMessagesService.show('Sticky Created Successfully', {cssClass: 'alert alert-success', timeout: 2000});
          setTimeout(() => {
            //navigate to available
            this.router.navigate(['/dashboard']);
          }, 2000);
        },
        error => {

        }
      );
    }
  }

}
