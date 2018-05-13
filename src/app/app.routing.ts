import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './home/register/register.component';
import { LoginComponent } from './home/login/login.component';
import { StickiesListComponent } from './dashboard/stickies-list/stickies-list.component';
import { StickiesReservedComponent } from './dashboard/stickies-reserved/stickies-reserved.component';
import { StickiesRedeemedComponent } from './dashboard/stickies-redeemed/stickies-redeemed.component';
import { StickyCreateComponent } from './dashboard/sticky-create/sticky-create.component';
import { ChangePasswordComponent } from './home/change-password/change-password.component';
import { NewPasswordComponent } from './home/new-password/new-password.component';
import { ContactComponent } from './home/contact/contact.component';
import { AboutComponent } from './home/about/about.component';

import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'changePassword', component: ChangePasswordComponent},
    {path: 'newPassword/:t1/:id/:t2/:hash', component: NewPasswordComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
        {path: '', component: StickiesListComponent},
        {path: 'reserved', component: StickiesReservedComponent},
        {path: 'redeemed', component: StickiesRedeemedComponent},
        {path: 'create', component: StickyCreateComponent}
    ]},
];

export const routing = RouterModule.forRoot(appRoutes);
export const routes = appRoutes;
