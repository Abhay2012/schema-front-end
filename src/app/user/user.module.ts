import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { Urls } from '../services/urls';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'ap-angular2-fullcalendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports : [ CommonModule,CalendarModule,ReactiveFormsModule, FormsModule, RouterModule.forChild([
        {
            path : '',
            component : UserComponent 
        }
    ]), HttpModule ],
    declarations : [ UserComponent ],
    providers : [ Urls ]
})
export class UserModule{

}