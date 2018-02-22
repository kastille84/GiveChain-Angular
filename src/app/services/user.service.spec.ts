import { async } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { fakeAsync, tick } from '@angular/core/testing';

import { User } from './../models/user.model';


describe('SERVICE: UserService', () => {
    let service: UserService;
    let http: HttpClient;

    beforeEach( () => {
        http = new HttpClient(null);
        service = new UserService(http);
    });

    describe('isAuthenticated', () => {
        beforeEach(() => {
            localStorage.setItem('token', '');
            localStorage.setItem('expiresAt', '');
        });
        afterEach(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('expiresAt');
        });
    
        it('should return False if No token is present in isAuthenticated ', () => {        
            let bool = service.isAuthenticated();
            expect(bool).toBeFalsy();
        });
        it('should return False if token has expired in isAuthenticated ', fakeAsync(() => {
            localStorage.setItem('expiresAt', new Date().getTime().toString());
            // let now = new Date().getTime().toString();
            tick();
            
            let bool = service.isAuthenticated();
            expect(bool).toBeFalsy();
        }));
        it('should return true if token has not expired in isAuthenticated ', fakeAsync(() => {
            localStorage.setItem('expiresAt', (new Date().getTime() + 7200000).toString());
            // let now = new Date().getTime().toString();
            tick();
    
            let bool = service.isAuthenticated();
            expect(bool).toBeTruthy();
        }));
    });

    describe('register', () => {
        it('returns an Observable when called', fakeAsync( () => {
            let obs: Observable<any>;
            let user = new User(
                    'testname',
                    'test@gmail.com',
                    '123dhfsl32',
                    'testname',
                    'testPizza',
                    '125 Address st',
                    'Newburgh',
                    'NY',
                    '12550',
                    '554323234');
                spyOn(http, 'post').and.returnValue(Observable.empty());
            
            obs = service.register(user);
            expect(obs).toBeTruthy();
        }));
    });
    describe('login', () => {
        it('returns an Observable when called', fakeAsync( () => {
            let obs: Observable<any>;
                spyOn(http, 'post').and.returnValue(Observable.empty());
            
            obs = service.login('testname', '234leasdfj23');
            expect(obs).toBeTruthy();
        }));
    });

});