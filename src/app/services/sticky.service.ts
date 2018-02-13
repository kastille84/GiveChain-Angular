import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Sticky } from './../models/sticky.model';

@Injectable()
export class StickyService {
  url = 'http://localhost:3000/api/';
  stickies: Sticky[] = [];
  @Output() stickiesSet = new EventEmitter<Sticky[]>();

  constructor(private http: HttpClient) { }

  retrieveFromServer(city, state, url?) {
    let temp;
    if (!url) {
      temp = this.http.get(this.url + `sticky?city=${city}&state=${state}`);
    } else {
      temp = this.http.get(this.url + `sticky?city=${city}&state=${state}&restaurant=${url}`);
    }
    // have users, need to construct
    let tempStickyArray = [];
    temp.subscribe( result => {
      console.log('users', result.users);
        for(let i = 0; i < result.users.length; i++) {
          for(let g = 0; g< result.users[i].stickies.length; g++) {
             let obj = result.users[i].stickies[g];
              obj.user = {
                _id: result.users[i]._id,
                name: result.users[i].name,
                address: result.users[i].address,
                city: result.users[i].city,
                state: result.users[i].state,
                phone: result.users[i].phone,
              };
            tempStickyArray.push(obj);
          }
        }
        this.stickies = tempStickyArray;
        console.log('service stickies', this.stickies);
        this.stickiesSet.emit(this.getStickies());
    });
  }

  getStickies() {
    return this.stickies;
  }
  

