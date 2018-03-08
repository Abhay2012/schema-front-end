import { Component, ViewChild } from '@angular/core';
import { StaticContentService } from '../../services/staticContent.service';
import { AdminService } from './admin.service';
import { CalendarCustomComponent } from '../calendar/calendar.component';

declare let $: any;
@Component({
    selector: 'admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css'],
    providers: [AdminService]
})
export class AdminComponent {
    timeRemain: any[] = [];
    tab = 1;
    users: any[] = [];
    vers: any[];
    spas: any[];
    addresses: any[];
    templates: any[];
    fixedDels: any[];
    eventsTemplates : any[]=[];
    edit: boolean = false;
    delNames;
    newDelNames: any[] = [];
    copyDelNames: any[] = [];
    responseMessage = '';
    responseColor = 'transparent';
    selectedEventTemplate = {};
    options = [''];
    userPasswordChange;
    @ViewChild('calendar') calendar: any;

    constructor(public scs: StaticContentService, private as: AdminService) {
        this.getAdminPanel();
        this.getUsers();
        this.newDelNames.push(scs.newDelName);
        this.scs.lock = false;
    }

    getAdminPanel() {
        this.as.getAdminPanel().subscribe((res: any) => {
            for (let r of res) {
                if (r._id == 'delName') this.fixedDels = r.data[0].data;
                else if (r._id == 'template') this.templates = r.data;
                else if (r._id == 'ver') this.vers = r.data;
                else if (r._id == 'address') this.addresses = r.data;
                else if (r._id == 'spa') this.spas = r.data;
                else if (r._id == 'eventsTemplate') this.eventsTemplates = r.data;
            }
        }, (err: any) => {

        })
    }

    getUsers() {
        this.as.getUsers().subscribe((res: any) => {
            console.log(res);
            this.users = res;
        }, (err: any) => {

        })
    }

    getDelNames(event) {
        this.as.getDelNames(event.target.value).subscribe((res: any) => {
            this.delNames = res[0].delName;
        }, (err: any) => {

        })
    }

    deleteDelName(id, index) {
        this.as.deleteDelName(id).subscribe((res: any) => {
            this.delNames.splice(index, 1);
        }, (err: any) => {

        })
    }

    updateDelName(delName) {
        this.as.updateDelName(delName).subscribe((res: any) => {

        }, (err: any) => {

        })
    }

    addDelName(selectedUser) {
        this.as.addDelName(this.newDelNames, selectedUser).subscribe((res: any) => {
            this.delNames = this.delNames.concat(this.newDelNames);
        }, (err: any) => {

        })
    }

    getCopyDelNames(event) {
        this.as.getDelNames(event.from).subscribe((res: any) => {
            this.copyDelNames = res[0].delName;
        }, (err: any) => {

        })
    }

    moveDelNames(form) {
        this.as.moveDelNames(form.to, form.from, this.copyDelNames).subscribe((res: any) => {
            this.setResetMessage(res.message,res.color)
        }, (err: any) => {

        })
    }

    uploadDelNames(file, selectedUser) {
        let data = new FormData();
        data.append('avatar', file.files[0])
        this.as.uploadDelNames(selectedUser, data).subscribe((res: any) => {
            this.delNames = res.data;
        }, (err: any) => {
        })
    }


    updateUser(user) {
        this.as.updateUser(user).subscribe((res: any) => {

        }, (err: any) => {

        })
    }

    updateAdminPanel(data) {
        this.as.updateAdminPanel(data).subscribe((res: any) => {

        }, (err: any) => {

        })
    }

    createUser(form) {
        this.as.createUser(form.value).subscribe((res: any) => {
            console.log(res);
            this.setResetMessage(res.message,res.color);
            this.users.push(form.value);
        }, (err: any) => {

        })
    }

    addAdminPanel(form, str) {
        form.value.type = str;
        if (str == 'template') {
            form.value.user = false;
            form.value.options = this.options;
        }
        if (str == 'spa') form.value.templates = this.scs.spaBlockTemplates;
        this.as.addAdminPanel(form.value).subscribe((res: any) => {
            this.setResetMessage(res.message,res.color);
            if (str == 'template') this.templates.push(form.value);
            else if (str == 'address') this.addresses.push(form.value);
            else if (str == 'ver') this.vers.push(form.value);
            else if (str == 'spa') this.spas.push(form.value);
        })
    }

    deleteUser(user, index) {
        this.as.deleteUser(user.username).subscribe((res: any) => {
            this.users.splice(index, 1);
        }, (err: any) => {

        })
    }

    deleteFromAdminPanel(id, index, str) {
        this.as.deleteFromAdminPanel(id).subscribe((res: any) => {
            if (str == 'template') this.templates.splice(index, 1);
            else if (str == 'address') this.addresses.splice(index, 1);
            else if (str == 'ver') this.vers.splice(index, 1);
            else if (str == 'spa') this.spas.splice(index, 1);
        }, (err: any) => {

        })
    }

    changeUserPassword(changeUserPass) {
        if (changeUserPass.value.newPassword.match(/^[0-9a-zA-Z]+$/)) {
            this.as.changeUserPassword(changeUserPass.value, this.userPasswordChange).subscribe((res: any) => {
                this.setResetMessage(res.message,res.color);
            }, (err: any) => {

            })
        }
    }

    createEventsTemplate(eventsTemplateForm){
        console.log(eventsTemplateForm);
        eventsTemplateForm['type'] = "eventsTemplate";
        eventsTemplateForm['events'] = [];
        this.as.createEventsTemplate(eventsTemplateForm).subscribe((res :any) => {
            this.setResetMessage(res.message,res.color);
            this.eventsTemplates.push(res.data);
        }, (err:any)=>{

        } )
    }

    deleteEventsTemplate(){
        this.as.deleteEventsTemplate(this.selectedEventTemplate['_id']).subscribe((res :any) => {
            this.setResetMessage(res.message,res.color);
            this.eventsTemplates.splice(this.eventsTemplates.indexOf(this.selectedEventTemplate),1);
        }, (err:any)=>{

        } )
    }

    remainingTime() {
        console.log(this.selectedEventTemplate);
        this.timeRemain = [];
        this.calendar.events = this.selectedEventTemplate['events'];
        this.calendar.renderEvents();
        for (let template of this.spas.filter((spa) => {
            return spa.code == this.selectedEventTemplate['spa']
        })[0].templates) {
            var duration = template.hrs - this.selectedEventTemplate['events'].filter((event) => {
                return event.data.id == template.name.id;
            }).reduce((previous, current) => {
                if (typeof current.data.duration == 'string') current.data.duration = parseFloat(current.data.duration)
                return previous += current.data.duration;
            }, 0)
            this.timeRemain.push({ duration: duration.toFixed(2), title: template.name.title, color: template.color });
        }
        console.log(this.timeRemain);
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

    openModal(id) {
        this.responseMessage = '';
        this.responseColor = 'transparent';
        $(id).modal('show');
    }

    setResetMessage(message,color){
        this.responseColor = color;
        this.responseMessage = message;
        setTimeout(()=>{
          this.responseColor = "transparent";
          this.responseMessage = "";
        },2000);
    }
}