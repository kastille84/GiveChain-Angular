import { routing, routes } from './app.routing';
import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';

describe('Routing', () => {
    let location: Location;
    let router: Router;
    let fixture;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            declarations: [
                AppComponent,
                HomeComponent
            ]
        });

        router = TestBed.get(Router);
        location = TestBed.get(Location);
        fixture = TestBed.createComponent(AppComponent);
        router.initialNavigation();
    });

    // xit('should redirect to /home when empty path is passed', fakeAsync(() => {
    //     router.navigate(['']);

    //     tick();

    //     expect(location.path()).toBe('/home');
    // }));
});