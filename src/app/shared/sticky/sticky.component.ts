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
  reserveForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
  }

  onReserveShow() {
    this.reserveMode = true;
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
  onReserveCancel() {
    this.reserveMode = false;    
  }

}
