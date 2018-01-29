import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import * as _ from 'jquery';

declare let jsPDF: any;
declare let $: any;
declare let html2canvas: any;

@Component({
  selector: 'user',
  templateUrl: "user.component.html",
  styleUrls: ["user.component.css"],
  providers: [UserService]
})


export class UserComponent implements OnInit {

  _MS_PER_DAY = 1000 * 60 * 60 * 24;
  editEvent: boolean = false;
  updatedNotes;
  weeks: any;
  createTemp: boolean = false;;
  updatedEvents = [];
  stTime = "08:00:00";
  endTime = "09:00:00";
  vers: any = [];
  dels: any = [];
  spas: any = [];
  passwordMessage: boolean = false;
  templates: any = [];
  remainingTime = [];
  showRemain: boolean = false;
  addresses: any = [];
  alreadyMessage;
  options = [''];
  BlockTemplates = [{ name: '', color: '', hrs: '' }, { name: '', color: '', hrs: '' }, { name: '', color: '', hrs: '' }];
  already: boolean;
  resizeMessage = '';
  showResize: boolean = false;
  templateForm: FormGroup;
  show: boolean = false;
  user_id;
  username;
  edit = false;
  pasteMessage = false;
  message;
  deleteDels = [];
  users;
  weekMessage = '';
  selectedWeek = { address: '', user: '', delName: '', week: 0, spaBlock: '', timmar: null, events: [] };
  tab: number = 1;
  selectedUser;
  eventDate;
  events = [];
  updatedRole;
  local;
  selectedEvent = {};
  delNames = [{ name: '', spa: '', start: new Date(), end: new Date() }];
  weekTemplateName;
  copyWeek = [{week : 0,del : ''}];

  // Calendar Object
  calendarOptions: Object = {
    fixedWeekCount: false,
    defaultDate: '2016-09-12',
    editable: true,
    allDaySlot: false,
    eventTextColor : 'black',
    weekends: false,
    minTime: '08:00:00',
    maxTime: '17:00:00',
    weekNumbers: true,
    eventRender: function (event, element) {
      element.find('.fc-event-title').html(event.title);
    },
    eventResize: (event, delta, revertFunc, jsEvent, ui, view) => {
      this.resizeEvents(event, delta);

    },
    eventClick: (event, jsEvent, view) => {
      this.selectedEvent = event;
      this.updatedNotes = event.data.notes;
      this.createUser('#openEvent');
    },
    dayClick: (date, jsEvent, view, resourceObj) => {
      this.createUser('#createEvent');
      date = date._d;
      this.eventDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1}-${(date.getDate()) < 10 ? '0' + (date.getDate()).toString() : date.getDate()}`;
    },
    eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => {
      var start = new Date(event.start._d.getTime() - 3600000);
      var end = new Date(event.end._d.getTime() - 3600000);
      console.log(end);
      console.log(event.end._d.getTime());
      console.log(event.end._d);
      console.log(end.getHours());
      if (start.getHours() < 8 || end.getHours() > 17 || (end.getHours() == 17 && end.getMinutes() > 1)) {
        revertFunc();
        return;
      }
      this.resizeEvents(event);
    },
    slotLabelFormat: "HH:mm",
    header: {
      left: 'today, prev, next',
      center: 'title',
      right: 'month,agendaWeek,agendaDay, listMonth'
    },
    defaultView: 'agendaWeek',
    events: [],
    timeFormat: 'H(:mm)',
    eventLimit: true, // allow "more" link when too many events
    droppable: true
  };

  constructor(private ac: ActivatedRoute, private us: UserService, private router: Router) {
    this.selectedWeek.delName = localStorage.getItem('weekTemplate');
    this.local = localStorage;
  }

  ngOnInit() {

    // To get Username from URL
    this.ac.params.subscribe((param) => {
      this.user_id = param.id;
      this.username = localStorage.getItem('name');
      if (this.user_id == 'admin') {
        this.getUsers();
      }
    })

    // To provide functionality to change week in drop down when prev next buttons clicked
    $('body').on('click', 'button.fc-prev-button', () => {
      if (this.selectedWeek.week > 1) {
        this.selectedWeek['week']--;
        this.getSelectedWeek(this.selectedWeek.week);
      }
    });

    $('body').on('click', 'button.fc-next-button', () => {
      if (this.selectedWeek.week < 52) {
        this.selectedWeek['week']++;
        this.getSelectedWeek(this.selectedWeek.week);
      }
    });

    //  To store Current week No. in local Storage
    var no_of_days = this.dateDiffInDays(new Date('2018-01-01'), new Date()) + 1;
    localStorage.setItem('week', `${Math.ceil(no_of_days / 7)}`);

    // Get Selected Week Data from localStorage
    this.selectedWeek.user = localStorage.getItem('username');
    this.selectedWeek.address = localStorage.getItem('address');

    // To Provide Today's date as Default Date of calendar
    this.calendarOptions['defaultDate'] = new Date();

    // To get Data Created By Admin Account
    this.getAdminPannelData();

  }

  // To get Data Store By admin
  getAdminPannelData() {
    this.selectedWeek.week = this.local.week;
    this.us.getAdminPanel().subscribe((res: any) => {
      res = JSON.parse(res._body);
      for (let r of res) {
        if (r.type == 'template') {
          this.templates.push(r);
        } else if (r.type == 'ver') {
          this.vers.push(r);
        } else if (r.type == 'spa') {
          this.spas.push(r);
        } else if (r.type == 'address') {
          this.addresses.push(r);
        } else if (r.type == 'weeks') {
          this.weeks = r.data;
        }
      }
      if (this.user_id != 'admin') {
        this.getUserTemplates();
      }
      for (let address of this.addresses) {
        //console.log(address);
        if (address.address == this.local.address) {
          localStorage.setItem('oppe', address.start + '-' + address.end);
          //console.log("done");
        }
      }
    }, (err: any) => {

    })
  }

  // To get Data Present in user
  getUserTemplates() {
    var today = new Date();
    this.us.getUserTemplates().subscribe((res: any) => {
      res = JSON.parse(res._body);

      for (let r of res.templates) {
        this.templates.push(r);
      }

      for (let del of res.delName) {
        var start = this.dateDiffInDays(today, new Date(del.start));
        var end = this.dateDiffInDays(today, new Date(del.end))
        if (end < 0) {
          this.deleteDels.push(del);
        }
        if (start <= 0 && end > 0) {
          this.dels.push(del);
        }
      }
      this.templates.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        } else {
          return 1;
        }
      })
      localStorage.setItem('weekTemplate', this.dels[0].name)
      this.selectedWeek.spaBlock = this.dels[0].spa;
      this.getSelectedWeek(this.selectedWeek.week);
    }, (err: any) => {

    })
  }

  // Get Selected Week 
  getSelectedWeek(week, def?) {

    this.weekMessage = '';

    // To chane week in calnedar 
    this.jumpDate(this.getStartDate(week));

    // Get Data From server
    this.us.getSelectedWeek(this.selectedWeek.week, this.selectedWeek.user).subscribe((res: any) => {
      res = JSON.parse(res._body);
      if (res.exist) {
        if(res.data[0].delName==''){
          res.data[0].delName=res.data[0].name;
        }
        this.selectedWeek = res.data[0];
        this.events = res.data[0].events;
        
        for(let event of this.events){
          event.title = `${event.data.title}${event.data.role ? '\n'+ event.data.role : ''}\nAnteckningar :${event.data.notes}`
        }

        _('#calendar').fullCalendar('removeEvents');
        _('#calendar').fullCalendar('addEventSource', this.events);
        if (this.selectedWeek.spaBlock != '') {
          this.showRemain = true;
          this.remainingTimeCal();
        } else {
          this.showRemain = false;
        }
        if(this.selectedWeek.address==''){
          this.selectedWeek.address = this.local.address;
        }

      } else {
        this.selectedWeek = { address: this.selectedWeek.address, user: this.selectedWeek.user, delName: this.selectedWeek.delName, week: this.selectedWeek.week, spaBlock: this.selectedWeek.spaBlock, timmar: '', events: [] };
        this.showRemain = false;
        this.events = [];
        _('#calendar').fullCalendar('removeEvents');
        _('#calendar').fullCalendar('addEventSource', this.events);
        this.remainingTimeCal();
      }
    })
  }

  pasteEvents() {
    var obj={};
    obj['selectedWeek'] = JSON.parse(JSON.stringify(this.selectedWeek));
    obj['copyWeek'] = this.copyWeek;
    this.us.copyCalendar(obj, this.copyWeek[0].del).subscribe((res: any) => {
      //console.log(res);
      this.pasteMessage = true;
      this.selectedWeek.week = this.copyWeek[0].week;
      this.selectedWeek.delName = this.copyWeek[0].del;
      this.weekTemplateChange({ target: { value: this.copyWeek[0].del } });
    }, (err: any) => {
      this.pasteMessage = false;
    })
  }

  postDelname() {
    this.us.postDelName(this.selectedUser['username'], this.delNames).subscribe((res: any) => {

      for (let del of this.delNames) {
        this.selectedUser.delName.push(del);
      }
      this.delNames = [{ name: '', spa: '', start: new Date(), end: new Date() }];
    }, (err: any) => {

    })
  }

  // Update Events resized
  updateResize() {
    this.us.updateResize(this.local.week,this.selectedWeek['_id'], this.updatedEvents).subscribe((res: any) => {
      //console.log(res);
      res = JSON.parse(res._body);
      this.showResize = true;
      if (res.error) {
        this.resizeMessage = "Sparning misslyckades";

      } else {
        this.resizeMessage = "Sparat";
        for (let event = 0; event < this.events.length; event++) {
          for (let up of this.updatedEvents) {
            if (this.events[event].id == up.id) {
              this.events[event].start = up.start;
              this.events[event].end = up.end;
              this.events[event].data.duration = up.duration;
            }
          }
        }
        _('#calendar').fullCalendar('removeEvents');
        _('#calendar').fullCalendar('addEventSource', this.events);

      }
    })
  }


  // Called when events resize
  resizeEvents(event, delta?) {
    var obj = {};
    var index = -1;
    var start = new Date(event.start._d.getTime() - 3600000);
    var end = new Date(event.end._d.getTime() - 3600000);
    var duration = (end.getTime() - start.getTime()) / 3600000;
    var rduration = 0;
    //console.log(start.getHours());
    // if(start.getHours()<8){
    //   fn();
    //   return;
    // }

    if (delta) {
      rduration = delta._data.hours + ((delta._data.minutes) / 60);
    }

    obj['id'] = event.id;


    for (let u = 0; u < this.updatedEvents.length; u++) {
      if (this.updatedEvents[u].id == event.id) {
        index = u;
        break;
      }
    }

    for (let r of this.remainingTime) {
      if (r.id == event.data.id) {
        if (r.duration < rduration) {
          this.resizeMessage = "Du har överskridit den maximala tiden för denna aktivitet för detta spår och block";
          this.showResize = true;
          r.duration = (r.duration - rduration).toFixed(2);
          return;
        } else {
          r.duration = (r.duration - rduration).toFixed(2);
        }
      }
    }

    for (let r of this.remainingTime) {
      if (r.duration < 0) {
        this.showResize = true;
        break;
      } else {
        this.showResize = false;
      }
    }

    if (index != -1) {
      this.updatedEvents[index].end = `${end.getFullYear()}-${(end.getMonth() + 1) < 10 ? '0' + (end.getMonth() + 1).toString() : end.getMonth() + 1}-${(end.getDate()) < 10 ? '0' + (end.getDate()).toString() : end.getDate()}T${end.getHours() < 10 ? '0' + end.getHours() : end.getHours()}:${end.getMinutes() < 10 ? '0' + end.getMinutes() : end.getMinutes()}`;;
      this.updatedEvents[index].duration = duration
      this.updatedEvents[index].start = `${start.getFullYear()}-${(start.getMonth() + 1) < 10 ? '0' + (start.getMonth() + 1).toString() : start.getMonth() + 1}-${(start.getDate()) < 10 ? '0' + (start.getDate()).toString() : start.getDate()}T${start.getHours() < 10 ? '0' + start.getHours() : start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
    } else {

      obj['end'] = `${end.getFullYear()}-${(end.getMonth() + 1) < 10 ? '0' + (end.getMonth() + 1).toString() : end.getMonth() + 1}-${(end.getDate()) < 10 ? '0' + (end.getDate()).toString() : end.getDate()}T${end.getHours() < 10 ? '0' + end.getHours() : end.getHours()}:${end.getMinutes() < 10 ? '0' + end.getMinutes() : end.getMinutes()}`;
      obj['duration'] = duration;
      obj['start'] = `${start.getFullYear()}-${(start.getMonth() + 1) < 10 ? '0' + (start.getMonth() + 1).toString() : start.getMonth() + 1}-${(start.getDate()) < 10 ? '0' + (start.getDate()).toString() : start.getDate()}T${start.getHours() < 10 ? '0' + start.getHours() : start.getHours()}:${start.getMinutes() < 10 ? '0' + start.getMinutes() : start.getMinutes()}`;
      this.updatedEvents.push(obj);
    }
    //console.log(this.updatedEvents);
  }

  jumpDate(date) {
    date = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1}-${(date.getDate()) < 10 ? '0' + (date.getDate()).toString() : date.getDate()}`;
    _('#calendar').fullCalendar('gotoDate', date);
  }

  // Difference Between two dates
  dateDiffInDays(a, b) {
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / this._MS_PER_DAY);
  }

  // To remove option field in Template Creation Form
  removeOption(i) {
    this.options.splice(i, 1);
  }


  weekTemplateChange(event) {
    for (let del of this.dels) {
      if (del.name == this.selectedWeek.delName) {
        this.selectedWeek.spaBlock = del.spa;
        break;
      }
    }
    this.selectedWeek.delName = event.target.value;
    localStorage.setItem('weekTemplate', event.target.value);
    this.getSelectedWeek(this.selectedWeek.week);
  }

  // createWeekTemplate() {
  //   this.us.createWeekTemplate({ week: this.selectedWeek.week, name: this.weekTemplateName }).subscribe((res: any) => {
  //     //console.log(res);
  //     this.weekTemplates.push(this.weekTemplateName);
  //     this.weekTemplateName = '';
  //   }, (err: any) => {

  //   })
  // }

  remainingTimeCal() {
    var spa;
    console.log(this.selectedWeek);
    for (let s of this.spas) {
      
      if (s.code == this.selectedWeek.spaBlock) {
        spa = s;
        
        this.showRemain = true;
        for (let temp = 0; temp < spa.templates.length; temp++) {
          this.remainingTime[temp] = {
            title: spa.templates[temp].name.title,
            color: spa.templates[temp].color,
            id: spa.templates[temp].name.id,
            duration: (spa.templates[temp].hrs).toFixed(2)
          }
        }
        break;
      }
    }
    

    var a: number = 0;
    if(spa){
      for (let s of spa.templates) {
        if (s.name.id == '5a575bddfd1a1d0004cb1f1b' || s.name.id == "5a576897fd1a1d0004cb1f1d") {
          a += s.hrs;
        }
  
      }
    }
    

    this.selectedWeek.timmar = a;
    for (let event of this.events) {
      for (let r of this.remainingTime) {
        if (event.data.id == r.id) {
          r.duration = (r.duration - event.data.duration).toFixed(2);
        }
      }
    }
    //console.log("Remaining time");
    //console.log(this.remainingTime);

  }

  setSelectedWeek() {
    if (this.selectedWeek.week != 0 && this.selectedWeek.spaBlock != '' && this.selectedWeek.delName != '' && this.selectedWeek.address != '') {
      this.us.setSelectedWeek(this.selectedWeek).subscribe((res: any) => {
        res = JSON.parse(res._body);
        this.weekMessage = res.message;
      }, (err: any) => {

      })
    }

  }

  // save Update Week Information
  getStartDate(week) {
    var year = 2018;
    var d = new Date("Jan 01, " + year + " 01:00:00");
    var w = d.getTime() + 604800000 * (week - 1);
    var n1 = new Date(w);
    var n2 = new Date(w + 518400000)
    return n1;
  }

  // To add option Field in Template Creation Form
  addOption() {
    this.options.push('');
  }

  // For ngFor
  trackFn(index, value) {
    return index;
  }


  // To take PDF of web Page
  print() {
    html2canvas(document.body, {
      onrendered: function (canvas) {
        var img = canvas.toDataURL("image/png");
        var doc = new jsPDF({
          unit: 'px',
          format: 'a4'
        });
        doc.addImage(img, 'JPEG', 20, 20, 400, 380);
        doc.save('test.pdf');
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
    })
  }


  printLandscape() {
    html2canvas(document.body, {
      onrendered: function (canvas) {
        var img = canvas.toDataURL("image/png");
        var doc = new jsPDF('l', 'mm', [297, 210]);
        doc.addImage(img, 'JPEG', 20, 20, 220, 180);
        doc.save('test.pdf');
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
    })
  }




  // To Update Data of admin Panel by Admin 
  update(str, index) {
    //console.log(this.users);
    //console.log(index);
    if (str == 'user') {
      //console.log(this.users[index]);
      this.us.update(this.users[index], 'updateUser').subscribe((res: any) => {
        //console.log(res);
      }, (err: any) => {

      })
    } else if (str == 'address') {
      //console.log(this.addresses[index]);
      this.us.update(this.addresses[index]).subscribe((res: any) => {
        //console.log(res);
      }, (err: any) => {

      })
    } else if (str == 'ver') {
      //console.log(this.vers[index]);
      this.us.update(this.vers[index]).subscribe((res: any) => {
        //console.log(res);
      }, (err: any) => {

      })
    } else if (str == 'spa') {
      //console.log(this.spas[index]);
      this.us.update(this.spas[index]).subscribe((res: any) => {
        //console.log(res);
      }, (err: any) => {

      })
    } else if (str == 'temp') {
      //console.log(this.templates[index]);
      this.us.update(this.templates[index]).subscribe((res: any) => {
        //console.log(res);
      }, (err: any) => {

      })
    } else if (str == 'del') {
      //console.log(this.selectedUser.delName[index]);
      this.us.updateDelName(this.selectedUser.delName[index].id, this.selectedUser.delName[index]).subscribe((res: any) => {
        //console.log(res);
      }, (err: any) => {

      })
    }
  }

  // To get Users For Admin Account
  getUsers() {
    this.us.getUsers().subscribe((res: any) => {
      res = JSON.parse(res._body);
      this.message = res.message;
      //console.log(res);
      this.users = res;
      var index
      for (let user = 0; user < this.users.length; user++) {
        if (this.users[user].username == 'admin') {
          index = user;
        }
      }

      this.users.splice(index, 1);
      // //console.log(this.users);
    }, (err: any) => {

    })
  }

  addOpt(i, j) {
    this.templates[i].options.push("");
  }

  removeOpt(i, j) {
    this.templates[i].options.splice(j, 1);
  }

  // For Logout
  logout() {
    //console.log("logout");
    localStorage.clear();
    this.router.navigate(['login']);
  }

  // For Opening Modal For Creation from Admin Account
  createUser(id) {
    this.editEvent = false;
    this.alreadyMessage = '';
    //console.log("ddcsd");
    $(id).modal('show');
  }

  changePassword(event) {
    //console.log(event.value);
    this.us.changePassword(event.value).subscribe((res: any) => {
      this.passwordMessage = true;
    }, (err: any) => {

    })
  }

  // To add data from Admin Account
  create(form, type) {
    this.show = false;
    this.alreadyMessage = '';
    if (type == 'user') {
      this.us.createUser(form.value).subscribe((res: any) => {
        res = JSON.parse(res._body);
        this.show = true;
        this.alreadyMessage = res.message;
        form.value['createdAt'] = new Date();
        this.users.push(form.value);
        form.reset();
        this.already = res.created;
      }, (errr: any) => {

      })
    } else if (type == 'address') {
      this.us.createAddress(form.value).subscribe((res: any) => {
        this.show = true;
        res = JSON.parse(res._body);
        this.addresses.push(form.value);
        this.alreadyMessage = res.message;
        this.already = res.created;
        form.reset();
      })
    } else if (type == 'temp') {
      // //console.log(form.value);
      if (this.user_id == 'admin') {
        form.value['options'] = this.options;
        //console.log(form.value);
        this.us.createTemplate(form.value).subscribe((res: any) => {
          this.show = true;
          res = JSON.parse(res._body);
          form.value['options'] = this.options;
          this.templates.push(form.value);

          this.alreadyMessage = res.message;
          this.already = res.created;
          form.reset();
          this.options = [''];
          this.templates.sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            } else {
              return 1;
            }
          })
        })
      } else {
        form.value['options'] = [""];
        this.us.userTemplate(form.value).subscribe((res: any) => {
          this.show = true;
          res = JSON.parse(res._body);
          this.templates.push(res.data);
          this.alreadyMessage = res.message;
          this.already = res.created;
          form.reset();
          // this.options = [''];
        })
      }
    } else if (type == 'spa') {
      form.value.templates = this.BlockTemplates;
      //console.log(form.value);
      this.us.createSpa(form.value).subscribe((res: any) => {
        this.show = true;
        res = JSON.parse(res._body);
        this.spas.push(form.value);
        this.alreadyMessage = res.message;
        this.already = res.created;
        form.reset();
        this.BlockTemplates = [{ name: '', color: '', hrs: '' }, { name: '', color: '', hrs: '' }, { name: '', color: '', hrs: '' }]
      })
    } else if (type == 'ver') {

      //console.log(form.value);

      this.us.createVer(form.value).subscribe((res: any) => {
        this.show = true;
        res = JSON.parse(res._body);
        this.vers.push(form.value);
        //console.log(this.vers);
        this.alreadyMessage = res.message;
        this.already = res.created;
        form.reset();
      })
    }
  }

  // To delete Data from admin panel

  deleteUser(user, i, type) {
    if (type == 'user') {
      this.us.deleteUser(user.username, 'User').subscribe((res: any) => {
        //console.log(res);
        var ind = this.users.indexOf(user);
        this.users.splice(ind, 1)
      }, (err: any) => {
      })
    } else if (type == 'address') {
      this.us.deleteUser(user._id, 'Address').subscribe((res: any) => {
        //console.log(res);
        var ind = this.addresses.indexOf(user);
        this.addresses.splice(ind, 1)
      }, (err: any) => {
      })
    } else if (type == 'ver') {
      this.us.deleteUser(user._id, 'Ver').subscribe((res: any) => {
        //console.log(res);
        var ind = this.vers.indexOf(user);
        this.spas.splice(ind, 1)
      }, (err: any) => {
      })
    } else if (type == 'spa') {
      this.us.deleteUser(user._id, 'Spa').subscribe((res: any) => {
        //console.log(res);
        var ind = this.spas.indexOf(user);
        this.spas.splice(ind, 1)
      }, (err: any) => {
      })
    } else if (type == 'temp') {
      this.us.deleteUser(user._id, 'Temp').subscribe((res: any) => {
        //console.log(res);
        var ind = this.templates.indexOf(user);
        this.templates.splice(ind, 1)
      }, (err: any) => {
      })
    } else if (type == 'del') {

      this.us.deleteDelName(this.selectedUser.delName[i].id).subscribe((res: any) => {
        //console.log(res);
        var ind = this.selectedUser.delName.indexOf(user);
        this.selectedUser.delName.splice(ind, 1);
      })
    }
  }

  //   getWeekNo (year,date:Date) {
  //     var onejan = new Date(year, 0, 1);
  //     return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  // };

  eventSubmit(ev) {
    this.show = false;

    // Validations

    if (ev.value.endTime < ev.value.startTime) {
      this.show = true;
      this.alreadyMessage = "End Time Should Be Greater";
      this.already = false;
      return;
    } else {
      this.show = false;
    }
    var dt1 = new Date(`October 13, 2014 ${ev.value.endTime}`);
    var dt2 = new Date(`October 13, 2014 ${ev.value.startTime}`);
    var duration = (dt1.getHours() - dt2.getHours()) + (((dt1.getMinutes() - dt2.getMinutes())) / 60);

    for (let r of this.remainingTime) {
      if (r.title == ev.value.template.title) {
        if (r.duration < duration) {
          this.show = true;
          this.alreadyMessage = `Duration Exceeds Maximum Duration of ${ev.value.template.title}`;
          this.already = false;
          return;
        }
      }
    }


    var obj = {
      title: `${ev.value.template.title}  \n`,
      color: `${ev.value.template.color}`,
      start: `${ev.value.date}T${ev.value.startTime}`,
      end: `${ev.value.date}T${ev.value.endTime}`,
      data: {
        title: `${ev.value.template.title}  `,
        id: `${ev.value.template._id}`,
        notes: `${ev.value.notes}`,
        duration: duration
      }
    };
    // //console.log("checking");
    // //console.log(ev);
    // //console.log(obj);
    // //console.log(this.templates);
    if (ev.value.role) {
      obj.title += `\n ${ev.value.role}`;
    }

    if (ev.value.notes) {
      obj.title += `\n Anteckningar : ${ev.value.notes}`;
    }

    if (ev.value.role) {
      obj.data['role'] = ev.value.role;
    }

    // var events = [ {title:"vf",start : '2018-01-01',color:'green'},{title:"vf",start : '2018-01-01',color:'green'}]
    // this.events.push(obj);

    var no_of_days = this.dateDiffInDays(new Date('2018-01-01'), new Date(ev.value.date)) + 1;
    var weekNo = Math.ceil(no_of_days / 7);
    // //console.log(weekNo);

    // //console.log(ev.value.date.getWeek())
    this.us.addEvent(weekNo, this.user_id, obj).subscribe((res: any) => {
      // //console.log(res);
      res = JSON.parse(res._body);
      this.events.push(res.data);
      this.alreadyMessage = res.message;
      this.already = !res.error;
      this.show = true;
      _('#calendar').fullCalendar('removeEvents');
      _('#calendar').fullCalendar('addEventSource', this.events);
      // //console.log("Remainni");
      // //console.log(this.remainingTime);;
      for (let r of this.remainingTime) {
        if (r.id == obj.data.id) {
          r.duration = (r.duration - obj.data.duration).toFixed(2);
          break;
        }
      }
    }, (err: any) => {

    })
  }

  deleteTemplate(template) {
    this.us.deleteTemplate(template.id).subscribe((res: any) => {
      //console.log(res);
      this.templates.splice(this.templates.indexOf(template), 1);
    }, (err: any) => {

    })
  }

  deleteEvent() {

    var no_of_days = this.dateDiffInDays(new Date('2018-01-01'), new Date(this.selectedEvent['start']._d)) + 1;
    var week = Math.ceil(no_of_days / 7);
    //console.log(this.selectedEvent['id'] + week)

    //console.log("delete function")
    //console.log(this.selectedEvent);
    //console.log(this.events);
    this.us.deleteEvent(this.selectedEvent['id'],this.selectedWeek['_id'], week).subscribe((res: any) => {
      //console.log(res);
      var index;
      for (let event = 0; event < this.events.length; event++) {
        if (this.events[event].id == this.selectedEvent['_id']) {
          index = event;
          break;
        }
      }
      this.events.splice(index, 1);
      _('#calendar').fullCalendar('removeEvents');
      _('#calendar').fullCalendar('addEventSource', this.events);
      for (let r of this.remainingTime) {
        //console.log(r.id);
        if (r.id == this.selectedEvent['data']['id']) {

          r.duration = parseInt(r.duration) + this.selectedEvent['data']['duration'];
          break;
        }
      }
      $('#openEvent').modal('hide');
    }, (err: any) => {

    })
  }

  updateEvent() {
    this.show = false;

    var obj = this.selectedEvent['data'];
    console.log(this.selectedEvent);
    var no_of_days = this.dateDiffInDays(new Date('2018-01-01'), new Date(this.selectedEvent['start']._d)) + 1;
    var week = Math.ceil(no_of_days / 7);
    this.us.updateEvent(this.selectedEvent['id'],this.selectedWeek['_id'], week, obj).subscribe((res: any) => {
      res = JSON.parse(res._body);
      this.show = true;
      this.editEvent = false;
      var index;
      for (let i = 0; i < this.events.length; i++) {
        if (this.selectedEvent['id'] == this.events[i].id) {
          index = i;
          break;
        }
      }
      //console.log(this.selectedEvent);
      //console.log(this.events);
      
      this.events[index].title = obj['title'] + `${'role' in obj? '\n'+obj.role : ''}'\n'Anteckningar : ${obj.notes}`;
      _('#calendar').fullCalendar('removeEvents');
      _('#calendar').fullCalendar('addEventSource', this.events);
      this.alreadyMessage = res.message;
      this.already = !res.error;
    })
  }

  pushDelname() {
    this.delNames.push({ name: '', spa: '', start: new Date(), end: new Date() });
  }

  removeDelname(index) {
    this.delNames.splice(index, 1);
  }

  addWeek(){
    this.copyWeek.push({week : 0, del : ''});
  }

  removeWeek(index){
    this.copyWeek.splice(index,1);
  }

  copyDels(form){
    console.log(form.value)
    this.us.postDelName(form.value.to.username, form.value.from.delName).subscribe((res:any)=>{
      this.pasteMessage = true;
      form.value.to.delName = form.value.from.delName;
    },(err:any)=>{

    })
  }

}