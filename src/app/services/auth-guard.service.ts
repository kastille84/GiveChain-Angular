import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate,
        ActivatedRouteSnapshot,
        RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {

         if (!this.userService.isAuthenticated() ) {
            this.router.navigate(['login']);
            return false;
         }
         return true;
    }
}
