import { Injectable } from '@angular/core';
import { Urls } from '../../services/urls';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    constructor(private urls: Urls, private http: Http) {

    }

    getAdminPanel() {
        return this.http.get(`${this.urls.url}/adminPanel`).map(response => response.json());
    }

    getUserData() {
        return this.http.get(`${this.urls.url}/userTemplatesFetch/${localStorage.getItem('username')}`).map(res => res.json());
    }

    getSelectedWeek(week, delName) {
        return this.http.get(`${this.urls.url}/getCalendarData/${week}/${localStorage.getItem('username')}/${delName}`).map(res => res.json());
    }

    setSelectedWeek(data) {
        if (typeof (data.week) == 'string') {
            data.week = parseInt(data.week);
        }
        return this.http.post(`${this.urls.url}/saveCalendarData`, data).map(res => res.json());    
    }

    createUserTemplate(data) {
        console.log("serv");
        return this.http.post(`${this.urls.url}/userTemplateUpdate/${localStorage.getItem('username')}`, data);
    }

    deleteTemplate(id) {
        return this.http.delete(`${this.urls.url}/deleteTemplate/${id}`).map(res => res.json());
    }

    setTemplate(week,delName,data){
        return this.http.post(`${this.urls.url}/setTemplate/${week}/${localStorage.getItem('username')}/${delName}`,data).map(res=>res.json());
    }














    

    // getUserTemplates() {
    //     let id = localStorage.getItem('username');
    //     return this.http.get(`${this.urls.url}/userTemplatesFetch/${id}`)
    // }



    

    // copyCalendar(data, del) {
    //     data.name = del;
    //     data.delName = del;
    //     return this.http.post(`${this.urls.url}/copyCalendarData`, data);
    // }

    // addEvent(week, user, data) {
    //     return this.http.post(`${this.urls.url}/addEvent/${week}/${user}/${localStorage.getItem('weekTemplate')}`, data)
    // }

    

    // deleteEvent(id, wId, week) {
    //     return this.http.delete(`${this.urls.url}/deleteEvent/${id}/${wId}/${week}`)
    // }

    // updateEvent(id, wId, week, data) {
    //     return this.http.post(`${this.urls.url}/updateEvent/${id}/${wId}/${week}`, data);
    // }

    // updateResize(week, wId, data) {
    //     return this.http.post(`${this.urls.url}/updateResize/${wId}/${week}`, data);
    // }

    // createWeekTemplate(data) {
    //     return this.http.post(`${this.urls.url}/createWeekTemplate/${localStorage.getItem('username')}`, data);
    // }

    // postDelName(username, data) {
    //     return this.http.post(`${this.urls.url}/createDelName/${username}`, data);
    // }
    // moveDelName(username,username1,data){
    //     return this.http.post(`${this.urls.url}/moveDelName/${username}/${username1}`,data);
    // }
    // updateDelName(id, data) {
    //     return this.http.post(`${this.urls.url}/updateDelName/${id}`, data);
    // }


    // changeUserPassword(data,username){
    //     return this.http.post(`${this.urls.url}/changeUserPassword/${username}`, data);
    // }

    // upload(id,data){
    //     return this.http.post(this.urls.url+`/upload/${id}`,data);
    // }
}