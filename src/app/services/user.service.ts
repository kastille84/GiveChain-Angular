import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../models/user.model';

@Injectable()
export class UserService {
    url = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) {}

    // register user
    register(user: User) {
        //const userString = JSON.stringify(user);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
                // auth: 'my-token'
            })
        };

        return this.http.post(this.url + 'register', user, httpOptions);
       
    }

}
