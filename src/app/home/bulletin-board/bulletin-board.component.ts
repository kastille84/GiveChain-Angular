import { Component, OnInit, Input, Output } from '@angular/core';

import { Sticky } from '../../models/sticky.model';
import { StickyService } from '../../services/sticky.service';
import { Subscription } from 'rxjs/Subscription';
import { EventEmitter } from 'events';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-bulletin-board',
  templateUrl: './bulletin-board.component.html',
  styleUrls: ['./bulletin-board.component.css']
})
export class BulletinBoardComponent implements OnInit {
  @Input() stickies: any[] = [];
  reservationWarning = false;
  canReserve = false;
  city = '';
  state = '';
  stickySubscription: Subscription;

  constructor(private stickyService: StickyService, private userService: UserService) { }

  ngOnInit() {    
    this.city = localStorage.getItem('city');
    this.state = localStorage.getItem('state');
    const lsStickyId = (localStorage.getItem('reserved_id'))? localStorage.getItem('reserved_id') : null;
    // set reservation warning
    if (lsStickyId) {
      this.reservationWarning = true;
      this.canReserve = false;
    } else {
      this.reservationWarning = false;
      this.canReserve = true;
    }

    this.stickyService.retrieveFromServer(this.city, this.state);
    this.stickyService.stickiesSet.subscribe( stickies => {
      let finalStickies = [];
      for (let i = 0; i < stickies.length; i++) {
        if (!stickies[i].reserved && !stickies[i].redeemed) {
          finalStickies.push(stickies[i]);
        }
        // check whether localStorage sticky matches any sticky
        if (stickies[i]._id === lsStickyId) {
          if (stickies[i].redeemed === true ) {
            // then remove from localStorage
            localStorage.removeItem('reserved_id');
            this.reservationWarning = false;
            this.regetStickies();
          }
        }
      }
      // check if it's even in the array
      if (lsStickyId) {
        const result = stickies.filter( sticky => sticky._id === lsStickyId);
        // if result is empty array
        if (result.length === 0) {
          // then remove from localStorage
          localStorage.removeItem('reserved_id');
          this.reservationWarning = false;
          this.regetStickies();
        }
      }
      this.stickies = finalStickies;
      // shuffle stickies    
      this.stickies = this.stickies.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
    });


  }

  regetStickies() {
    // grab it afterwards
    let tempStickies = this.stickyService.getStickies();
    let finalStickies = [];
      for (let i = 0; i < tempStickies.length; i++) {
        if (!tempStickies[i].reserved && !tempStickies[i].redeemed) {
          finalStickies.push(tempStickies[i]);
        }
      }
      this.stickies = finalStickies;
      this.stickies = this.stickies.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

      const lsStickyId = (localStorage.getItem('reserved_id'))? localStorage.getItem('reserved_id') : null;
      if (lsStickyId) {
        this.reservationWarning = true;
        this.canReserve = false;
      } else {
        this.reservationWarning = false;
        this.canReserve = true;
      }
  }

  onLocEdit() {
    localStorage.removeItem('city');
    localStorage.removeItem('state');
    this.userService.cityStateChanged();
  }

}
