import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StickyService } from '../../services/sticky.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sticky',
  templateUrl: './sticky.component.html',
  styleUrls: ['./sticky.component.css']
})
export class StickyComponent implements OnInit {
  @Input() cardType;
  @Input() sticky;
  isLoggedIn = false;
  reserveMode = false;
  editMode = false;
  errorMode = false;
  errorMessage = '';

  reserveForm: FormGroup;
  editForm: FormGroup;

  constructor(private userService: UserService, 
    private stickyService: StickyService,
    private flashMessagesService: FlashMessagesService,
    private router: Router) { }

  ngOnInit() {
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
    // set up reactive Form
    this.reserveForm = new FormGroup({
      'reserveBy': new FormControl(null, Validators.required)
    });
    // set up reactive Form
    this.editForm = new FormGroup({
      'title': new FormControl(this.sticky.title, Validators.required),
      'message': new FormControl(this.sticky.message, Validators.required),
      'from': new FormControl(this.sticky.from, Validators.required)
    });
  }

//  R E S E R V E 
  onReserveShow() {
    this.reserveMode = true;
    this.editMode = false;
    this.errorMode = false;
  }
  // change reserve sticky from db & frontend sticky list
  onReserveSet() {
    //validate
    if (this.reserveForm.status !== 'INVALID') {
      const id = this.sticky._id;
      // update sticky on frontend & backend
      console.log(this.reserveForm);
      const name = this.reserveForm.controls['reserveBy'].value;
      this.stickyService.reserve(id, name).subscribe(
        sticky => {
          const stickyList = this.stickyService.getStickies();
          stickyList.forEach(stickyItem => {
            if (stickyItem._id === id) {
              stickyItem.reserved = true;
              stickyItem.reservedBy = name;
            }
          });
          
          // navigate away
          this.router.navigate(['/dashboard/reserved']);

        },
        error => {
          console.log('im error')
          const stickyList = this.stickyService.getStickies();
          stickyList.forEach(stickyItem => {
            if (stickyItem._id === this.sticky._id) {
              stickyItem.reserved = false;
              stickyItem.reservedBy = '';
            }
          });          
          // flash message
          this.errorMode = true;
          this.errorMessage = 'Sorry could not reserve at this time. Try another item.';
          this.flashMessagesService.show(this.errorMessage, {cssClass: 'alert alert-danger', timeout: 5000});
          // navigate away
          this.router.navigate(['/dashboard']);
        }
      );

      //navigate to same url
      
    }
    // # TODO - reach out to server
    // # TODO - set sticky.reserved to true & reservedBy to "name"
    // # TODO , in localStorage, have a reserved & sticky id - keys to keep track

  }  

// E D I T 
  onEditShow() {
    this.editMode = true;
    this.reserveMode = false;
    this.errorMode = false;
    
  }

  onEditSet() {
    const id = this.sticky._id;
    console.log(id);
  }

  
// R E D E E M
  onRedeemSet(){
    // validate
  }
  
// D E L E T E 
  onDeleteSet() {
    
  }

// Cancel
  onReserveEditModeCancel() {
    this.reserveMode = false;
    this.editMode = false;
    this.errorMode = false;
  }
}
