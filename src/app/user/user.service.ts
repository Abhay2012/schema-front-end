import { Injectable } from '@angular/core';
import { Urls } from '../services/urls';
import { Http } from '@angular/http';

@Injectable()
export class UserService{
    constructor( private urls : Urls, private http : Http ){

    }

    getUsers(){
        return this.http.get(`${this.urls.url}/users`);
    }

    createUser(data){
        return this.http.post(`${this.urls.url}/createUser`,data)
    }

    createAddress(data){
        return this.http.post(`${this.urls.url}/addAddress`,data)
    }
    

    createVer(data){
        return this.http.post(`${this.urls.url}/addVer`,data)
    }

    createTemplate(data){
        return this.http.post(`${this.urls.url}/addTemplate`,data)
    }

    createSpa(data){
        return this.http.post(`${this.urls.url}/addSpa`,data)
    }

    getAdminPanel(){
        return this.http.get(`${this.urls.url}/adminPanel`);
    }

    deleteUser(username, str){
        return this.http.delete(`${this.urls.url}/delete${str}/${username}`);
    }

    update(data,str?){
        return this.http.post(`${this.urls.url}/${str ? str : 'updateAdminData'}`,data);
    }

    userTemplate(data){
        let id = localStorage.getItem('username')
        return this.http.post(`${this.urls.url}/userTemplateUpdate/${id}`,data);
    }

    getUserTemplates(){
        let id = localStorage.getItem('username');
        return this.http.get(`${this.urls.url}/userTemplatesFetch/${id}`)
    }

    getSelectedWeek(week,user){
        if(localStorage.getItem('weekTemplate')){
            return this.http.get(`${this.urls.url}/getCalendarData/${week}/${user}/${localStorage.getItem('weekTemplate')}`)
        }
    }

    setSelectedWeek(data, del?){
        data['name'] = localStorage.getItem('weekTemplate');
        if(typeof(data.week)=='string'){
            data.week = parseInt(data.week);
        }
        if(del){
            data.name = del;
            data.delName = del;
        }
        if(data.name != null && data.name != undefined){
            return this.http.post(`${this.urls.url}/saveCalendarData`,data);
        }
    }

    copyCalendar(data, del){
        data.name = del;
        data.delName = del;
        return this.http.post(`${this.urls.url}/copyCalendarData`, data);
    }

    addEvent(week,user,data){
        return this.http.post(`${this.urls.url}/addEvent/${week}/${user}/${localStorage.getItem('weekTemplate')}`,data)
    }

    deleteTemplate(id){
        return this.http.delete(`${this.urls.url}/deleteTemplate/${id}`);
    }

    deleteEvent(id,wId,week){
        return this.http.delete(`${this.urls.url}/deleteEvent/${id}/${wId}/${week}`)
    }

    updateEvent(id,wId,week,data){
        return this.http.post(`${this.urls.url}/updateEvent/${id}/${wId}/${week}`,data);
    }

    updateResize(week,wId, data){
        return this.http.post(`${this.urls.url}/updateResize/${wId}/${week}`,data);
    }

    createWeekTemplate(data){
        return this.http.post(`${this.urls.url}/createWeekTemplate/${localStorage.getItem('username')}`,data);
    }

    postDelName(username, data){
        return this.http.post(`${this.urls.url}/createDelName/${username}`,data);
    }
    moveDelName(username,username1,data){
        return this.http.post(`${this.urls.url}/moveDelName/${username}/${username1}`,data);
    }
    updateDelName(id, data){
        return this.http.post(`${this.urls.url}/updateDelName/${id}`,data);
    }

    deleteDelName(id){
        return this.http.delete(`${this.urls.url}/deleteDelName/${id}`);
    }

    changePassword(data){
        return this.http.post(`${this.urls.url}/changePassword/${localStorage.getItem('username')}`, data);
    }

    changeUserPassword(data,username){
        return this.http.post(`${this.urls.url}/changeUserPassword/${username}`, data);
    }

    changeCopyPassword(data){
        return this.http.post(`${this.urls.url}/changePassword/${'copyAccess'}`, data);
    }

    getAccess(data){
        // var options : RequestOptions = { 'Content-Type' : "application/json"}
        return this.http.post(this.urls.url + `/login`, data)
    }

    upload(id,data){
        return this.http.post(this.urls.url+`/upload/${id}`,data);
    }
}