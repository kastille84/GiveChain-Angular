import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlashMessagesModule } from 'angular2-flash-messages';

// Routes from app.routing.ts
import { routing } from './app.routing';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { SearchComponent } from './home/search/search.component';
import { BulletinBoardComponent } from './home/bulletin-board/bulletin-board.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './home/register/register.component';

// services
import { UserService } from './services/user.service';
import { LoginComponent } from './home/login/login.component';
import { AuthGuard } from './services/auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NavComponent,
    SearchComponent,
    BulletinBoardComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlashMessagesModule.forRoot(),
    routing
  ],
  providers: [
      UserService,
      AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
