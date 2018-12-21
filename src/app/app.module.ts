import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { NgModule } from '@angular/core';

const appRoutes: Routes = [
  {  path: '', component: MainComponent },
  { path: 'admin', component: AdminlistComponent },
  { path: 'admin/edit/:id', component: AdmineditComponent }
];


import { AppComponent } from './app.component';
import { LearnComponent } from './learn/learn.component';
import { ListComponent } from './list/list.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { AdminlistComponent } from './adminlist/adminlist.component';
import { AdmineditComponent } from './adminedit/adminedit.component';

@NgModule({
  declarations: [
    AppComponent,
    LearnComponent,
    ListComponent,
    MainComponent,
    AdminlistComponent,
    AdmineditComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
