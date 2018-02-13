import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from './../../services/sticky.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-stickies-reserved',
  templateUrl: './stickies-reserved.component.html',
  styleUrls: ['./stickies-reserved.component.css']
})
export class StickiesReservedComponent implements OnInit {
// #TODO - need property to hold stickies array
stickies: Sticky[] = [];
isLoggedIn = false;
stickySubscription: Subscription;
routeSubscription: Subscription;
data;

constructor(
    private stickyService: StickyService, 
    private userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let tempStickies = this.stickyService.getStickies();
    let finalStickies = [];       
      for (let i = 0; i < tempStickies.length; i++) {
        if (tempStickies[i].reserved && !tempStickies[i].redeemed) {
          finalStickies.push(tempStickies[i]);
        }
      }       
      this.stickies = finalStickies;

    // // initially get data from route
    // this.stickySubscription = this.stickyService.stickiesSet.subscribe(stickies => {
    //   console.log('tempstickies', stickies);
    //   let finalStickies = [];       
    //   for (let i = 0; i < stickies.length; i++) {
    //     if (stickies[i].reserved && !stickies[i].redeemed) {
    //       finalStickies.push(stickies[i]);
    //     }
    //   }       
    //   this.stickies = finalStickies;
    // });
    // // get data from route asynchronously
    // this.routeSubscription = this.route.params.subscribe(data => {
    //   this.data = data['link'];
    //   console.log("data", data.link);
    //   // get stickies from service
    //   this.stickySubscription = this.stickyService.stickiesSet.subscribe(stickies => {
    //     let finalStickies = [];
    //     // available stickies
    //     if (data['link'] === undefined) {
    //       for (let i = 0; i < stickies.length; i++) {
    //         if (!stickies[i].reserved && !stickies[i].redeemed) {
    //           finalStickies.push(stickies[i]);
    //         }
    //       }
    //     } else if (data['link'] === 'reserved') {
    //       // reserved stickies
    //       for (let i = 0; i < stickies.length; i++) {
    //         if (stickies[i].reserved && !stickies[i].redeemed) {
    //           finalStickies.push(stickies[i]);
    //         }
    //       }
    //     } else if (data['link'] === 'redeemed') {
    //       //redeemed stickies
    //       for (let i = 0; i < stickies.length; i++) {
    //         if (stickies[i].reserved && stickies[i].redeemed) {
    //           finalStickies.push(stickies[i]);
    //         }
    //       }
    //     }
    //     this.stickies = finalStickies;
    //     console.log('stickies-list', this.stickies);
    //   });
    // });
    // get Logged In status
    this.isLoggedIn = this.userService.isAuthenticated();
  }

}
