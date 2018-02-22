import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { StickyService } from '../services/sticky.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private flashMessagesService: FlashMessagesService, 
    private stickyService: StickyService) { }

  ngOnInit() {
    // get the stickies from server
    const city = localStorage.getItem('city');
    const state = localStorage.getItem('state');
    const url = localStorage.getItem('url')
    this.stickyService.retrieveFromServer(city, state, url);
  }

}
