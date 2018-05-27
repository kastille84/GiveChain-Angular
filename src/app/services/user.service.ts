import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { User } from '../models/user.model';

@Injectable()
export class UserService {
    url = 'https://fast-tundra-56510.herokuapp.com/api/';

    loggedInStatus = false;
    @Output() loggedInEvent = new EventEmitter<boolean>();
    @Output() cityStateChangedEvent = new EventEmitter<boolean>();
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
            // auth: 'my-token'
        })
    };

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
                this.setLogout();
                return false;
        }
        return true;
    }

    setLoggedIn() {
        this.loggedInStatus = true;
        this.loggedInEvent.emit(this.loggedInStatus);
    }

    setLogout() {
        // remove localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('verified');
        localStorage.removeItem('url');

        this.loggedInStatus = false;
        this.loggedInEvent.emit(this.loggedInStatus);
    }

    // city State changes
    cityStateChanged() {
        this.cityStateChangedEvent.emit(true);
    }
    // register user
    register(user: User) {

        return this.http.post(this.url + 'register', user, this.httpOptions);
    }

    login(username, password) {
        const credentials = {
            username: username,
            password: password
        };

        return this.http.post(this.url + 'login', credentials, this.httpOptions);
    }
    // pulls up change password form
    changePassword(email) {
        return this.http.post(this.url + 'changePassword', {email}, this.httpOptions);
    }
    // sets the password
    setNewPassword(id, hash, password) {
        return this.http.post(this.url + 'newPassword', {id, hash, password}, this.httpOptions);
    }

    contact(subject, message, email) {

        return this.http.post(this.url + 'contact', {subject, message, email}, this.httpOptions);
    }

}
