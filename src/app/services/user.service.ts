import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { User } from '../models/user.model';

@Injectable()
export class UserService {
    url = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) {}

    isAuthenticated() {
        // he is authenticated if he has a token
        // if (localStorage.getItem('token')) {
        //     return true;
        // } else {
        //     return false;
        // }
        const expiresAt = localStorage.getItem('expiresAt');
        if (!expiresAt 
            || +expiresAt < new Date().getTime()) {
                return false;
            };
        return true;
    }

    // register user
    register(user: User) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
                // auth: 'my-token'
            })
        };
        return this.http.post(this.url + 'register', user, httpOptions);       
    }

    login(username, password) {
        const credentials = {
            username: username,
            password: password
        };

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
                // auth: 'my-token'
            })
        };

        return this.http.post(this.url + 'login', credentials, httpOptions);
    }

}
