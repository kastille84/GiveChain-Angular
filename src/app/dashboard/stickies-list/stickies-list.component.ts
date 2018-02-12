import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from './../../services/sticky.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-stickies-list',
  templateUrl: './stickies-list.component.html',
  styleUrls: ['./stickies-list.component.css']
})
export class StickiesListComponent implements OnInit, OnDestroy {
  // #TODO - need property to hold stickies array
  stickies: Sticky[] = [];
  isLoggedIn = false;
  stickySubscription: Subscription;

  constructor(private stickyService: StickyService, private userService: UserService) { }

  ngOnInit() {
    // get stickies from service
    this.stickySubscription = this.stickyService.stickiesSet.subscribe(stickies => {
      this.stickies = stickies;
      console.log('stickies-list', this.stickies);
    });
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
  }

  ngOnDestroy() {

  }

}
