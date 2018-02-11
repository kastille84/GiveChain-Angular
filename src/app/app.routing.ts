import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { StickiesListComponent } from './dashboard/stickies-list/stickies-list.component';

import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
        {path: '', component: StickiesListComponent}
    ]},
];

export const routing = RouterModule.forRoot(appRoutes);
export const routes = appRoutes;
