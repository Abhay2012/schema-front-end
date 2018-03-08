import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { CommonModule } from '@angular/common';
import { Urls } from '../../services/urls';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { StaticContentService } from '../../services/staticContent.service';
import { CalendarCustomInnerModule } from '../calendar/customCalendar/customCalendar.module';

@NgModule({
    imports : [ CommonModule,ReactiveFormsModule,CalendarCustomInnerModule,FormsModule, RouterModule.forChild([
        {
            path : '',
            component : UserComponent 
        }
    ]), 
    HttpModule,
    HeaderModule ],
    declarations : [ UserComponent, 
     ],
    providers : [ Urls,StaticContentService ]
})
export class UserModule{

}