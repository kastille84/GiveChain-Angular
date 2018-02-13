import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Sticky } from './../../models/sticky.model';
import { StickyService } from './../../services/sticky.service';

@Component({
  selector: 'app-stickies-reserved',
  templateUrl: './stickies-reserved.component.html',
  styleUrls: ['./stickies-reserved.component.css']
})
export class StickiesReservedComponent implements OnInit {
// #TODO - need property to hold stickies array
stickies: Sticky[] = [];
stickySubscription: Subscription;
constructor(
    private stickyService: StickyService) { }

  ngOnInit() {
    let tempStickies = this.stickyService.getStickies();
    let finalStickies = [];       
      for (let i = 0; i < tempStickies.length; i++) {
        if (tempStickies[i].reserved && !tempStickies[i].redeemed) {
          finalStickies.push(tempStickies[i]);
        }
      }       
      this.stickies = finalStickies;

  }

}
