import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from '../../services/sticky.service';


@Component({
  selector: 'app-sticky-create',
  templateUrl: './sticky-create.component.html',
  styleUrls: ['./sticky-create.component.css']
})
export class StickyCreateComponent implements OnInit {
  createForm: FormGroup;

  constructor(private stickyService: StickyService,
          private router: Router) { }

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

          //navigate to available
          this.router.navigate(['/dashboard']);
        },
        error => {

        }
      );
    }
  }

}
