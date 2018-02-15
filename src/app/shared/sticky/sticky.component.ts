import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  reserveForm: FormGroup;
  editForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
  }
//  R E S E R V E 
  onReserveShow() {
    this.reserveMode = true;
    this.editMode = false;
    // set up reactive Form
    this.reserveForm = new FormGroup({
      'reserveBy': new FormControl(null, Validators.required)
    });

  }
  // change reserve sticky from db & frontend sticky list
  onReserveSet() {
    const id = this.sticky._id;
    console.log(id);

    // # TODO - reach out to server
    // # TODO - set sticky.reserved to true & reservedBy to "name"
    // # TODO , in localStorage, have a reserved & sticky id - keys to keep track

  }  

// E D I T 
  onEditShow() {
    this.editMode = true;
    this.reserveMode = false;
    // set up reactive Form
    this.editForm = new FormGroup({
      'title': new FormControl(this.sticky.title, Validators.required),
      'message': new FormControl(this.sticky.message, Validators.required),
      'from': new FormControl(this.sticky.from, Validators.required)
    });
  }

  onEditSet() {
    const id = this.sticky._id;
    console.log(id);
  }

  
// R E D E E M
  onRedeemSet(){
    
  }
  
// D E L E T E 
  onDeleteSet() {
    
  }

// Cancel
  onReserveEditModeCancel() {
    this.reserveMode = false;
    this.editMode = false;
  }
}
