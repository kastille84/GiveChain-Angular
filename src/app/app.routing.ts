import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];

export const routing = RouterModule.forRoot(appRoutes);
