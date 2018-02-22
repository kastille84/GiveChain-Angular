import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from './../../services/sticky.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-stickies-redeemed',
  templateUrl: './stickies-redeemed.component.html',
  styleUrls: ['./stickies-redeemed.component.css']
})
export class StickiesRedeemedComponent implements OnInit {
// #TODO - need property to hold stickies array
stickies: Sticky[] = [];
isLoggedIn = false;
stickySubscription: Subscription;
routeSubscription: Subscription;
data;

constructor(
    private stickyService: StickyService, 
    private userService: UserService) { }

  ngOnInit() {
    let tempStickies = this.stickyService.getStickies();
    let finalStickies = [];       
      for (let i = 0; i < tempStickies.length; i++) {
        if (tempStickies[i].reserved && tempStickies[i].redeemed) {
          finalStickies.push(tempStickies[i]);
        }
      }       
      this.stickies = finalStickies;
    
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
  }

}
