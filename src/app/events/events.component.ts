// import { Component, ViewChild } from '@angular/core';
// import { EventService } from '../../providers/events.service';
// import * as _ from 'jquery';

// declare let $: any;
// @Component({
//     selector: 'events',
//     templateUrl: 'events.component.html',
//     providers: [EventService]
// })
// export class EventComponent {

//     @ViewChild('audi') audience: any;
//     @ViewChild('img') image : any;
//     constructor(private es: EventService) {

//         var date = new Date();
//         this.today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
//     }

//     events: any[] = [];
//     today: any;
//     selectedEvent: any = {};
//     isModalLoader: boolean;
//     title: any = '';
//     description: any = '';
//     startDate: any;
//     endDate: any;
//     location: any;
//     startTime: any = '00:00';
//     endTime: any = '00:00';
//     dateInvalid: boolean = false;
//     timeInvalid: boolean = false;

//     calendarOptions: Object = {
//         fixedWeekCount: false,
//         defaultDate: this.today,
//         editable: true,
//         events: this.events,
//         eventLimit: true, // allow "more" link when too many events
//         eventClick: (event) => {
//             $('#openEvent').modal('show');
//             this.isModalLoader = true;
//             this.getEventById(event.id);
//         },
//         dayClick: (day) => {
//             var today = new Date();
//             // var date = `${day._d.getFullYear()}-${day._d.getMonth()+1}-${day._d.getDate()}`;
//             if (today < day._d) {
//                 $('#addEvent').modal('show');
//             }
//             this.startDate = `${day._d.getFullYear()}-${day._d.getMonth() + 1}-${day._d.getDate() < 10 ? '0' + day._d.getDate() : day._d.getDate()}`;
//             this.endDate = `${day._d.getFullYear()}-${day._d.getMonth() + 1}-${day._d.getDate() < 10 ? '0' + day._d.getDate() : day._d.getDate()}`;
//             this.startTime = '00:00';
//             this.endTime = '00:00';
//             this.title = '';
//             this.description = '';
//             this.audience.reset();
//             // this.audience.data.mainAudienceId = '';
//             console.log(today);
//             console.log(day._d);
//         },
//         viewRender: (view, element) => {
//             var date: any = _('#calendar').fullCalendar('getDate');
//             date = `${date._d.getFullYear()}-${date._d.getMonth() + 1}`;
//             console.log(date);
//             this.getEvents(date);
//         }
//     };

//     onCalendarInit(initialized: boolean) {
//         //   console.log(initialized);
//         console.log('Calendar initialized');
//     }


//     getEvents(month: any) {
//         this.es.getEventsByMonth(month).subscribe((res: any) => {
//             console.log(res);
//             _('#calendar').fullCalendar('removeEvents');
//             this.events = [];
//             for (let r of res) {
//                 var obj = {};

//                 obj['start'] = r.start.substring(0, r.start.indexOf('T'));
//                 obj['end'] = r.end.substring(0, r.end.indexOf('T'));
//                 obj['title'] = `${r.title}`;
//                 obj['id'] = r.id;

//                 this.events.push(obj);
//             }
//             _('#calendar').fullCalendar('addEventSource', this.events);
//             // console.log(this.events);
//         }, (err: any) => {

//         })
//     }

//     getEventById(id) {
//         this.es.getEventById(id).subscribe((res: any) => {
//             console.log(res);
//             this.selectedEvent = res;
//             this.isModalLoader = false;
//         }, (err: any) => {
//             this.isModalLoader = false;
//         })
//     }

//     submit() {

//         var obj: FormData = new FormData();
//         var obj1 = this.audience.sendData();
//         obj.append('title', this.title);
//         obj.append('description', this.description);
//         obj.append('start', `${this.startDate}T${this.startTime}:00`)
//         obj.append('end', `${this.endDate}T${this.endTime}:00`)
//         obj.append('mainAudienceId', obj1.mainAudienceId);
//         obj.append('location', `${this.location}`);
//         if (obj1.audienceIds) {
//             obj.append('audienceIds', obj1.audienceIds)
//         }
//         if (obj1.departmentIds) {
//             obj.append('departmentIds', obj1.departmentIds)
//         }
//         if (obj1.programIds) {
//             obj.append('programIds', obj1.programIds)
//         }
//         if (obj1.yearIds) {
//             obj.append('yearIds', obj1.yearIds)
//         }
//         if (obj1.moduleIds) {
//             obj.append('moduleIds', obj1.moduleIds)
//         }

//         for(let i=0;i<this.image.files.length;i++){
//             obj.append('files', this.image.files[i])
//         }

//         console.log(obj);
//         this.es.submitEvent(obj).subscribe((res: any) => {
//             console.log(res);
//             this.events.push(res);
//         }, (err: any) => {

//         })
//     }

//     check() {
//         // console.log("acsdc");
//         if (<Date>this.startDate > <Date>this.endDate) {
//             // console.log("dcssdcwee");
//             this.dateInvalid = true;
//         } else {
//             this.dateInvalid = false;
//         }

//         if (this.startDate == this.endDate && this.startTime > this.endTime) {

//             this.timeInvalid = true;
//         } else {
//             this.timeInvalid = false;
//         }
//     }
// }