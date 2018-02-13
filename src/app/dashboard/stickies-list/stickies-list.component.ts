import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from './../../services/sticky.service';

@Component({
  selector: 'app-stickies-list',
  templateUrl: './stickies-list.component.html',
  styleUrls: ['./stickies-list.component.css']
})
export class StickiesListComponent implements OnInit, OnDestroy {
  // #TODO - need property to hold stickies array
  stickies: Sticky[] = [];  
  stickySubscription: Subscription;

  constructor(
      private stickyService: StickyService) { }

  ngOnInit() {
    
    // initially get data from route
    this.stickySubscription = this.stickyService.stickiesSet.subscribe(stickies => {
      console.log('tempstickies', stickies);
      let finalStickies = [];
      for (let i = 0; i < stickies.length; i++) {
        if (!stickies[i].reserved && !stickies[i].redeemed) {
          finalStickies.push(stickies[i]);
        }
      }
      this.stickies = finalStickies;
    });
    
    // grab it afterwards
    let tempStickies = this.stickyService.getStickies();
    let finalStickies = [];
      for (let i = 0; i < tempStickies.length; i++) {
        if (!tempStickies[i].reserved && !tempStickies[i].redeemed) {
          finalStickies.push(tempStickies[i]);
        }
      }
      this.stickies = finalStickies;

    
  }


  ngOnDestroy() {
    this.stickySubscription.unsubscribe();
  }

}
