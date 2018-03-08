import { NgModule } from '@angular/core';
import { CalendarCustomComponent } from '../calendar.component';
import { CalendarModule } from 'ap-angular2-fullcalendar';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports : [ CalendarModule, CommonModule, FormsModule,ReactiveFormsModule ],
    declarations : [ CalendarCustomComponent, 
        // HeaderComponent, CalendarComponent
     ],
    exports : [ CalendarCustomComponent ]
})
export class CalendarCustomInnerModule{

}