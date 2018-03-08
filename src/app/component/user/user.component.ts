import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './user.service';
import { StaticContentService } from '../../services/staticContent.service';
import * as _ from 'jquery';
import { CalendarCustomComponent } from '../calendar/calendar.component';

declare let $: any;
declare let html2canvas: any;
declare let jsPDF: any;
@Component({
    selector: 'user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css'],
    providers: [UserService]
})
export class UserComponent implements OnInit {

    eventsTemplates: any[] = [];
    allEventsTemplates: any[] = [];
    @ViewChild('calendar') calendar: any;
    addresses: any;
    weeks: any = [];
    responseColor: string = 'transparent';
    responseMessage: string = '';
    delNames: any[] = [];
    spas: any;
    vers: any;
    templates: any[] = [];
    localStorage: any;
    timeRemain: any = [];
    options: any[] = [''];
    selectedWeekId : any;

    constructor(private us: UserService, public scs: StaticContentService) {
        this.getAdminPanel();
        this.getUserData();
        localStorage.setItem('copy_access', 'false');
        localStorage.setItem('grant_access', 'false');
        this.localStorage = localStorage;
    }

    ngOnInit() {
        this.scs.selectedWeek.user = this.localStorage.username;
        this.scs.selectedWeek.week = Math.ceil(((new Date()).getTime() - (new Date(`${(new Date()).getFullYear()}-01-01`)).getTime()) / 604800000);
        console.log(this.scs.selectedWeek.week);
    }

    getAdminPanel() {
        this.us.getAdminPanel().subscribe((res: any) => {
            for (let r of res) {
                if (r._id == 'delName') this.delNames = this.delNames.concat(r.data[0].data);
                else if (r._id == 'template') this.templates = r.data;
                else if (r._id == 'ver') this.vers = r.data;
                else if (r._id == 'spa') this.spas = r.data;
                else if (r._id == 'weeks') this.weeks = r.data[0].data;
                else if (r._id == 'eventsTemplate') {
                    this.eventsTemplates = r.data.filter((template)=>{ return this.localStorage.address == template.address});
                    this.allEventsTemplates = JSON.parse(JSON.stringify(this.eventsTemplates));
                }
                else if (r._id == 'address') {
                    this.addresses = r.data;
                    var userAddress = this.addresses.filter((address) => { return this.localStorage.address == address.address })
                    if(userAddress[0]) localStorage.setItem('oppe', `${userAddress[0].start} - ${userAddress[0].end}`);
                }
            }
        }, (err: any) => {

        })
    }

    getUserData() {
        this.us.getUserData().subscribe((res: any) => {
            this.sort(res.templates, 'title');
            this.sort(res.delName, 'name');
            this.delNames = this.delNames.concat(res.delName);
            this.templates = this.templates.concat(res.templates);
        }, (err: any) => {

        })
    }

    setSpaBlock() {
        this.eventsTemplates = JSON.parse(JSON.stringify(this.allEventsTemplates));
        this.scs.selectedWeek.spaBlock = this.delNames.filter((delName) => {
            return delName.name == this.scs.selectedWeek.delName
        })[0].spa;
        this.eventsTemplates = this.eventsTemplates.filter( (eventTemplate) => { return eventTemplate.spa == this.scs.selectedWeek.spaBlock} )
        this.scs.selectedWeek.timmar = 0;
        this.setTimmar();
        this.getSelectedWeek();
    }

    setTimmar() {
        for (let template of this.spas.filter((spa) => {
            return spa.code == this.scs.selectedWeek.spaBlock
        })[0].templates) {
            if (template.name.id == '5a575bddfd1a1d0004cb1f1b' || template.name.id == "5a576897fd1a1d0004cb1f1d") {
                this.scs.selectedWeek.timmar += template.hrs;
            }
        }
    }

    getSelectedWeek() {
        this.calendar.jumpDate(this.getStartDate(typeof this.scs.selectedWeek.week == 'string'? parseInt(this.scs.selectedWeek.week):this.scs.selectedWeek.week));
        this.us.getSelectedWeek(this.scs.selectedWeek.week, this.scs.selectedWeek.delName).subscribe((res: any) => {
            if(res.exist) this.selectedWeekId = res.data[0]._id;
            
            this.scs.lock = !res.exist;
            if (res.data[0] && res.data[0].spaBlock != '' && res.data[0].spaBlock != this.scs.selectedWeek.spaBlock) {
                this.scs.selectedWeek.spaBlock = res.data[0].spaBlock;
                this.scs.selectedWeek.timmar = 0;
                this.setTimmar();
            }
            if (res.data[0]) this.scs.selectedWeek.events = res.data[0].events;
            this.timeRemain = [];
            this.remainingTime();
            this.calendar.events = this.scs.selectedWeek.events;
            this.calendar.renderEvents();
        }, (err: any) => {

        })
    }

    remainingTime() {
        this.timeRemain = [];
        for (let template of this.spas.filter((spa) => {
            return spa.code == this.scs.selectedWeek.spaBlock
        })[0].templates) {
            var duration = template.hrs - this.scs.selectedWeek.events.filter((event) => {
                return event.data.id == template.name.id;
            }).reduce((previous, current) => {
                if (typeof current.data.duration == 'string') current.data.duration = parseFloat(current.data.duration)
                return previous += current.data.duration;
            }, 0)
            this.timeRemain.push({ duration: duration.toFixed(2), title: template.name.title, color: template.color });
        }
        console.log(this.timeRemain);
    }

    setSelectedWeek() {
        if (this.scs.selectedWeek.week != 0 && this.scs.selectedWeek.spaBlock != '' && this.scs.selectedWeek.delName != '') {
            this.us.setSelectedWeek(this.scs.selectedWeek).subscribe((res: any) => {
                this.setResetMessage(res.message, res.color)
                this.scs.lock = false;
            }, (err: any) => {

            })
        }
    }

    createUserTemplate(data) {
        this.us.createUserTemplate(data.value).subscribe((res: any) => {
            this.setResetMessage(res.message, res.color)
            this.templates.push(res.data);
            this.options = [''];
        }, (err: any) => {
            console.log(err);
        })
    }

    deleteTemplate(template) {
        this.us.deleteTemplate(template.id).subscribe((res: any) => {
          this.templates.splice(this.templates.indexOf(template), 1);
        }, (err: any) => {
    
        })
    }

    setTemplate(form){
        this.us.setTemplate(this.scs.selectedWeek.week,this.scs.selectedWeek.delName,form.value.template).subscribe((res:any)=>{
            this.setResetMessage(res.message, res.color)
            this.calendar.events = res.data;
            this.calendar.renderEvents();
        },(err:any)=>{

        })
    }

    printWarning(id?) {
        var timeLeft = this.timeRemain.reduce((previous, current) => { return previous + (typeof current.duration == 'string' ? parseFloat(current.duration) : current.duration) }, 0)
        if (timeLeft > 0) {
            var message = this.timeRemain.reduce((previous, current) => { return previous + `${current.title} : ${current.duration} ` }, 'Du har inte satt ut alla timmarna för ')
            var confirm = window.confirm(message);
            if (confirm) {
                if (id) this.print();
                else this.printLandscape();
            }
        } else {
            if (id) this.print();
            else this.printLandscape();
        }
    }

    openModal(id) {
        this.responseMessage = '';
        this.responseColor = 'transparent';
        $(id).modal('show');
    }

    sort(array, by) {
        array.sort((a, b) => {
            if (a[by] < b[by]) {
                return -1;
            } else {
                return 1;
            }
        })
    }

    getStartDate(weekNo:number) {
        var year = (new Date()).getFullYear();
        var d = new Date(`${year}-01-01`);
        var w = d.getTime() + 604800000 * (weekNo - 1);
        var n1 = new Date(w);
        return n1;
    }

    push(array, value) {
        array.push(JSON.parse(JSON.stringify(value)));
    }

    pop(array, index) {
        array.splice(index, 1);
    }

    trackFn(index, value) {
        return index;
    }

    // To take PDF of web Page
    print() {
        html2canvas(document.body, {
            onrendered: (canvas) => {
                var img = canvas.toDataURL('image/jpeg', 1.0);
                var doc = new jsPDF({
                    unit: 'px',
                    format: 'a4'
                });
                doc.addImage(img, 'JPEG', 20, 20, 400, 380);
                doc.save(`${this.scs.selectedWeek.delName} v${this.scs.selectedWeek.week} schema.pdf`);
                document.body.style.width = '100%';
                document.body.style.height = '100%';
            }
        })
    }


    printLandscape() {
        html2canvas(document.body, {
            onrendered: (canvas) => {
                var img = canvas.toDataURL('image/jpeg', 1.0);
                var doc = new jsPDF('l', 'mm', [297, 210]);
                doc.addImage(img, 'JPEG', 20, 20, 220, 180);
                doc.save(`${this.scs.selectedWeek.delName} v${this.scs.selectedWeek.week} schema.pdf`);
                document.body.style.width = '100%';
                document.body.style.height = '100%';
            }
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