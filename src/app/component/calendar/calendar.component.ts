import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CalendarService } from './calendar.service';
import { StaticContentService } from "../../services/staticContent.service";
import { EventObject } from 'fullcalendar';
import * as _ from 'jquery';
import { CalendarComponent } from 'ap-angular2-fullcalendar';

declare let $: any;
@Component({
  selector: "calendar",
  templateUrl: 'calendar.component.html',
  providers: [CalendarService],
  inputs: ["events", "templates", "timeRemain", "weekId"],
  outputs: ["getSelectedWeek"]
})
export class CalendarCustomComponent implements OnInit {

  selectedEvent: any = {};
  responseMessage: string;
  responseColor: string;
  localStorage;
  admin: boolean;
  @Input() events: any[] = [];
  @Input() templates: any[] = [];
  @Input() timeRemain: any[] = [];
  @Input() weekId: any;
  @Output() getSelectedWeek = new EventEmitter();
  newEvent: EventObject;
  updateEvents: any[] = [];
  editEvent: boolean = false;
  eventDate : string = "2018-01-01";
  constructor(private cs: CalendarService, public scs: StaticContentService) {
    this.localStorage = localStorage;
  }

  calendarOptions: any = {
    fixedWeekCount: false,
    defaultDate: '2018-01-01',
    editable: true,
    allDaySlot: false,
    eventTextColor: 'black',
    eventOverlap: false,
    weekends: false,
    minTime: '08:00:00',
    maxTime: '17:00:00',
    weekNumbers: true,
    eventRender: function (event, element) {
      element.find('.fc-event-title').html(event.data.title);
    },
    dayClick: (date, jsEvent, view, resourceObj) => {
      console.log(date._d.toISOString());
      this.eventDate = (date._d.toISOString()).substring(0,date._d.toISOString().indexOf('T'));
      console.log(this.eventDate);
      if (!this.scs.lock) this.openModal('#createEvent');
    },
    eventClick: (event, jsEvent, view) => {
      this.selectedEvent = event;
      console.log(this.selectedEvent);
      this.openModal('#openEvent');
    },
    eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => {
      var start = new Date(event.start._d.toISOString());
      var end = new Date(event.end._d.toISOString());
      console.log(start, 'sdc', end)
      if (start.getUTCHours() < 8 || end.getUTCHours() > 17 || (end.getUTCHours() == 17 && end.getUTCMinutes() > 1)) {
        revertFunc();
        return;
      }
      this.onDropEvent(event);
    },
    eventResize: (event, delta, revertFunc, jsEvent, ui, view) => {
      this.onEventResize(event, delta, revertFunc);
    },
    slotLabelFormat: "HH:mm",
    header: {
      left: '',
      center: '',
      right: ''
    },
    views: {
      agendaWeek: {
        columnFormat: 'dddd'
      }
    },
    defaultView: 'agendaWeek',
    events: [],
    timeFormat: 'H(:mm)',
    eventLimit: true, // allow "more" link when too many events
    droppable: !this.scs.lock
  };

  ngOnInit() {
    if (this.localStorage.username != 'admin') {
      this.calendarOptions['defaultDate'] = new Date();
      this.admin = false;
      this.calendarOptions.header = {
        left: 'today, prev, next',
        center: 'title',
        right: 'month,agendaWeek,agendaDay, listMonth'
      }
    }

    $('body').on('click', 'button.fc-prev-button', () => {
      if (this.scs.selectedWeek.week > 1) {
        this.scs.selectedWeek['week']--;
        this.getSelectedWeek.emit();
      }
    });

    $('body').on('click', 'button.fc-next-button', () => {
      if (this.scs.selectedWeek.week < 52) {
        this.scs.selectedWeek['week']++;
        this.getSelectedWeek.emit();
      }
    });
  }

  renderEvents() {
    this.events.map((event) => {
      return event.title = `${event.data.title}${event.data.role ? '\n' + event.data.role : ''}\nAnteckningar : ${event.data.notes}`
    })
    _('#calendar').fullCalendar('removeEvents');
    _('#calendar').fullCalendar('addEventSource', this.events);
  }

  openModal(id) {
    this.responseMessage = '';
    this.responseColor = 'transparent';
    $(id).modal('show');
  }

  getStartDate(weekNo) {
    var year = (new Date()).getFullYear();
    var d = new Date("Jan 01, " + year + "00:00:00");
    var w = d.getTime() + 604800000 * (weekNo - 1);
    var n1 = new Date(w);
    return n1;
  }

  jumpDate(date) {
    // date = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1}-${(date.getDate()) < 10 ? '0' + (date.getDate()).toString() : date.getDate()}`;
    _('#calendar').fullCalendar('gotoDate', date.toISOString());
  }

  createEvent(form) {
    form.value.date = this.eventDate;
    var end = new Date(`${form.value.date} ${form.value.endTime}`);
    var start = new Date(`${form.value.date} ${form.value.startTime}`);
    var duration = (end.getHours() - start.getHours()) + (((end.getMinutes() - start.getMinutes())) / 60);
    if (!this.eventOverlapCheck(start, end)) return;
    if (!this.remainingTimeCheck(form.value.template.title, duration)) return;
    this.newEvent = this.createNewEvent(form.value, duration)
    this.cs.createEvent(this.scs.selectedWeek.week, this.scs.selectedWeek.delName, this.createNewEvent(form.value, duration), this.weekId).subscribe((res: any) => {
      this.events.push(res.data);
      this.setResetMessage(res.message,res.color);
      this.newEvent.id = res.data.id;
      console.log(form.value.template._id);
      this.updateRemainingTime(form.value.template.title, duration);
      _('#calendar').fullCalendar('renderEvent', this.newEvent)
    }, (err: any) => {
    })
  }

  eventOverlapCheck(st, ed, id?) {
    for (let event of this.events) {
      if(id && id == event.id) continue;
      let start = new Date(event.start).getDate();
      let end = new Date(event.end).getTime();
      let s1,e1;
      if(id){
        s1 = st.toISOString();
        e1 = ed.toISOString();
      }else{
        s1 = (st.toISOString()).substring(0,(st.toISOString()).indexOf('T')+1) + st.toLocaleTimeString();
        e1 = (ed.toISOString()).substring(0,(ed.toISOString()).indexOf('T')+1) + ed.toLocaleTimeString();
      }
      
      console.log((st.toISOString()).substring(0,(st.toISOString()).indexOf('T')+1) + st.toLocaleTimeString());
      // let s = new Date(s1.substring(0,s1.indexOf('.')));
      // console.log(st.toISOString());
      // let e = new Date(e1.substring(0,e1.indexOf('.')));
      // console.log(start, ' ', end, ' ', event.start, ' ', event.end, s.getTime(), ' ', e.getTime(),' ', s, ' ', e);
      
      if(start == st.getDate()){
        let sold = parseInt(event.start.substring(event.start.indexOf('T')+1,event.start.indexOf(':'))) + (parseInt(event.start.substring(event.start.indexOf(':')+1,event.start.indexOf(':')+3))/60);
        let snew = parseInt(s1.substring(s1.indexOf('T')+1,s1.indexOf(':'))) + (parseInt(s1.substring(s1.indexOf(':')+1,s1.indexOf(':')+3))/60)
        let eold = parseInt(event.end.substring(event.end.indexOf('T')+1,event.end.indexOf(':'))) + (parseInt(event.end.substring(event.end.indexOf(':')+1,event.end.indexOf(':')+3))/60)
        let enew = parseInt(e1.substring(e1.indexOf('T')+1,e1.indexOf(':'))) + (parseInt(e1.substring(e1.indexOf(':')+1,e1.indexOf(':')+3))/60)
        console.log(sold,snew,eold,enew);
        if ((snew >= sold && snew < eold) || (enew > sold && enew <= eold)) {
          this.setResetMessage("Du kan inte skapa event på varandra","red");
          return false;
        } else {
          this.responseMessage = "";
          this.responseColor = "transparent";
        }
      }
      
      
    }
    return true;
  }

  remainingTimeCheck(title, duration, rf?) {
    for (let r of this.timeRemain) {
      if (r.title == title) {
        if (r.duration < duration) {
          this.setResetMessage(`Duration Exceeds Maximum Duration of ${title}`,"red");
          if (rf) rf();
          return false;
        } else {
          this.responseMessage = "";
          this.responseColor = "transparent";
        }
      }
    }
    return true;
  }

  createNewEvent(event, duration) {
    return {
      title: `${event.template.title}${event.role ? '\n' + event.role : ''}\nAnteckningar : ${event.notes}`,
      color: `${event.template.color}`,
      start: `${event.date}T${event.startTime}`,
      end: `${event.date}T${event.endTime}`,
      data: {
        title: `${event.template.title}  `,
        id: `${event.template._id}`,
        notes: `${event.notes}`,
        duration: duration,
        role: event.role ? event.role : ''
      }
    }
  }

  updateRemainingTime(title, duration) {
    console.log(this.timeRemain);
    for (let r of this.timeRemain) {
      if (r.title == title) {
        r.duration = ((typeof r.duration == 'string' ? parseFloat(r.duration) : r.duration) - duration).toFixed(2);
        console.log(r.duration);
        break;
      }
    }
  }

  deleteEvent() {
    this.cs.deleteEvent(this.selectedEvent['id'], this.weekId, this.scs.selectedWeek.week).subscribe((res: any) => {
      var index;
      for (let event = 0; event < this.events.length; event++) {
        if (this.events[event].id == this.selectedEvent['_id']) {
          index = event;
          break;
        }
      }
      this.setResetMessage(res.message, res.color) 
      this.events.splice(index, 1);
      _('#calendar').fullCalendar('removeEvents', this.selectedEvent.id);
      console.log(this.selectedEvent['data']['id']);
      console.log(parseFloat(this.selectedEvent['data']['duration']));
      this.updateRemainingTime(this.selectedEvent['data']['title'].trim(), 0 - parseFloat(this.selectedEvent['data']['duration']))
      $('#openEvent').modal('hide');
    }, (err: any) => {

    })
  }

  updateEvent() {
    this.cs.updateEvent(this.selectedEvent['id'], this.weekId, this.scs.selectedWeek.week, this.selectedEvent['data']).subscribe((res: any) => {
      var index;
      for (let i = 0; i < this.events.length; i++) {
        if (this.selectedEvent['id'] == this.events[i].id) {
          index = i;
          break;
        }
      }
      this.selectedEvent.title = this.selectedEvent['data']['title'] + `${'role' in this.selectedEvent['data'] ? '\n' + this.selectedEvent['data'].role : ''}'\n'Anteckningar : ${this.selectedEvent['data'].notes}`;
      _('#calendar').fullCalendar('updateEvent', this.selectedEvent);
      this.setResetMessage(res.message, res.color); 
    }, (err: any) => {

    })
  }

  onEventResize(event, delta, rf) {
    if (!this.remainingTimeCheck(event.data.title.trim(), delta._data.hours + ((delta._data.minutes) / 60), rf)) {
      setTimeout(() => {
        this.responseColor = "transparent";
        this.responseMessage = "";
      }, 2000)
      return;
    }
    this.updateRemainingTime(event.data.title.trim(), delta._data.hours + ((delta._data.minutes) / 60));
    var index, obj = {};
    for (let u = 0; u < this.updateEvents.length; u++) {
      if (this.updateEvents[u].id == event.id) {
        index = u;
        break;
      }
    }
    if (index) {
      this.updateEvents[index].end = event.end._d.toISOString();
      this.updateEvents[index].start = event.start._d.toISOString();
      this.updateEvents[index].duration = delta._data.hours + ((delta._data.minutes) / 60);
    } else {
      obj['id'] = event.id;
      obj['end'] = event.end._d.toISOString();
      obj['start'] = event.start._d.toISOString();
      obj['duration'] = delta._data.hours + ((delta._data.minutes) / 60);
      this.updateEvents.push(obj);
    }

  }

  onDropEvent(event) {
    console.log(this.updateEvents);
    if (!this.eventOverlapCheck(event.start._d, event.end._d, event.id)) {
      setTimeout(() => {
        this.responseColor = "transparent";
        this.responseMessage = "";
      }, 2000)
      return;
    }
    var index=-1, obj = {};
    for (let u = 0; u < this.updateEvents.length; u++) {
      if (this.updateEvents[u].id == event.id) {
        index = u;
        break;
      }
    }
    console.log(index);
    console.log(index!=-1);
    if (index!=-1) {
      this.updateEvents[index].end = event.end._d.toISOString();
      this.updateEvents[index].start = event.start._d.toISOString();
    } else {
      obj['id'] = event.id;
      obj['end'] = event.end._d.toISOString();
      obj['start'] = event.start._d.toISOString();
      obj['duration'] = event.data.duration;
      this.updateEvents.push(obj);
    }
  }

  updateResizeDropEvents() {
    this.cs.updateResizeDropEvents(this.scs.selectedWeek.week, this.weekId, this.updateEvents).subscribe((res: any) => {
      this.setResetMessage(res.message, res.color) 
    }, (err: any) => {

    })
  }

  setResetMessage(message, color) {
    this.responseColor = color;
    this.responseMessage = message;
    setTimeout(() => {
      this.responseColor = "transparent";
      this.responseMessage = "";
    }, 2000);
  }

}