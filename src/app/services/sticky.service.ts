import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Sticky } from './../models/sticky.model';

@Injectable()
export class StickyService {
  url = 'https://fast-tundra-56510.herokuapp.com/api/';
  stickies: Sticky[] = [];
  @Output() stickiesSet = new EventEmitter<Sticky[]>();
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
         'auth': localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) { }

  retrieveFromServer(city, state, search?) {
    let temp;
    if (!search) {
      temp = this.http.get(this.url + `sticky?city=${city}&state=${state}`);
    } else {
      temp = this.http.get(this.url + `sticky?city=${city}&state=${state}&restaurant=${search}`);
    }
    // have users, need to construct
    let tempStickyArray = [];
    temp.subscribe( result => {
      console.log('result', result);
      console.log('users', result.users);
        for(let i = 0; i < result.users.length; i++) {
          for(let g = 0; g < result.users[i].stickies.length; g++) {
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

  create(sticky) {
    return this.http.post(this.url + 'sticky', sticky, this.httpOptions);
  }

  edit(id, sticky) {
    return this.http.patch(this.url + 'sticky/edit/' + id, sticky, this.httpOptions);
  }

  reserve(id, name: string) {
    let tempSticky: Sticky;
    this.stickies.forEach(sticky => {
      if (sticky._id === id) {
        tempSticky = sticky;
      }
    });
    const tempStickyStr = JSON.stringify(tempSticky);
    const newSticky: Sticky = JSON.parse(tempStickyStr);
    
    if (name !== 'xunreservex') {
      // normal reserve
      newSticky.reserved = true;
      newSticky.reservedBy = name;
      //# TODO
      //newSticky.reservedDate = 
    } else {
      // a way to UNRESERVE
      newSticky.reserved = false;
      newSticky.reservedBy = name;
    }
    
    // reach out to the db, to update sticky
    const altHttpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    };
    return this.http.patch(this.url + 'sticky/reserve/' + id, newSticky, altHttpOptions);
  }

  redeem(id) {
    // set stckys redeem to true on front end
    this.stickies.forEach(sticky => {
      if (sticky._id === id) {
        sticky.redeemed = true;
      }
    });
    //set sticky redeem to true on back end
    return this.http.patch(this.url + 'sticky/redeem/' + id, null, this.httpOptions);
  }

  delete(id) {
    let tempStickies: Sticky[] = [];
    tempStickies = this.stickies.filter(sticky => sticky._id !== id);
    this.stickies = tempStickies;
    return this.http.delete(this.url + 'sticky/' + id, this.httpOptions);
  }

}
