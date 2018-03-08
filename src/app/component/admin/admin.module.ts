import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CalendarModule } from 'ap-angular2-fullcalendar';
import { Urls } from '../../services/urls';
import { HttpModule } from '@angular/http';
import { StaticContentService } from '../../services/staticContent.service';
import { CalendarCustomInnerModule } from "../calendar/customCalendar/customCalendar.module";

@NgModule({
    declarations : [ 
        AdminComponent
    ],
    imports : [
        HttpModule,
        FormsModule,
        HeaderModule,
        ReactiveFormsModule,
        CommonModule,
        CalendarModule,
        CalendarCustomInnerModule,
        RouterModule.forChild([
            {
                path : '',
                component : AdminComponent
            }
        ])
    ],
    providers : [ Urls, StaticContentService ]
})
export class AdminModule{

}