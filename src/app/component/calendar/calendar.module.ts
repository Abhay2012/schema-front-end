import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Urls } from '../../services/urls';
import { HttpModule } from '@angular/http';
import { CalendarCustomInnerModule } from "./customCalendar/customCalendar.module";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HeaderComponent } from '../header/header.component';
// import { CalendarComponent } from '../calendar/calendar.component';
import { StaticContentService } from '../../services/staticContent.service';
// import { CalendarCustomModule } from "../calendar/calendar.module";

@NgModule({
    imports : [ CommonModule,ReactiveFormsModule,CalendarCustomInnerModule,FormsModule, HttpModule ],
    declarations : [  
        // HeaderComponent, CalendarComponent
     ],
    providers : [ Urls,StaticContentService ],
    exports : [CalendarCustomInnerModule]
})
export class CalendarCustomModule{

}