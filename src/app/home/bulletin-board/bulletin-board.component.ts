import { Component, OnInit, Input } from '@angular/core';

import { Sticky } from '../../models/sticky.model';
import { StickyService } from '../../services/sticky.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bulletin-board',
  templateUrl: './bulletin-board.component.html',
  styleUrls: ['./bulletin-board.component.css']
})
export class BulletinBoardComponent implements OnInit {
  @Input() stickies: Sticky[] = [];
  reservationWarning = false;
  canReserve = false;
  stickySubscription: Subscription;

  constructor(private stickyService: StickyService) { }

  ngOnInit() {    
    const city = localStorage.getItem('city');
    const state = localStorage.getItem('state');
    const lsStickyId = (localStorage.getItem('reserved_id')? localStorage.getItem('reserved_id') : null;
    // set reservation warning
    if (lsStickyId) {
      this.reservationWarning = true;
      this.canReserve = false;
    } else {
      this.reservationWarning = false;
      this.canReserve = true;
    }
    
    this.stickyService.retrieveFromServer(city, state);
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
      const lsStickyId = (localStorage.getItem('reserved_id')? localStorage.getItem('reserved_id') : null;
      if (lsStickyId) {
        this.reservationWarning = true;
        this.canReserve = false;
      } else {
        this.reservationWarning = false;
        this.canReserve = true;
      }
  }

}
