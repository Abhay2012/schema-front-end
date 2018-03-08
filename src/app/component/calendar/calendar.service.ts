import { Injectable } from '@angular/core';
import { Urls } from '../../services/urls';
import { Http } from '@angular/http';

@Injectable()
export class CalendarService{
    constructor(private http : Http,private urls : Urls){
        
    }

    createEvent(week, delName, data, tid?) {
        if(localStorage.getItem('username') == 'admin')
        return this.http.post(`${this.urls.url}/addEventInEventsTemplate/${tid}`, data).map(res => res.json());

        return this.http.post(`${this.urls.url}/addEvent/${week}/${localStorage.getItem('username')}/${delName}`, data).map(res => res.json());
    }

    deleteEvent(id, wId, week) {
        if(localStorage.getItem('username') == 'admin')
        return this.http.delete(`${this.urls.url}/deleteEventFromEventsTemplate/${id}/${wId}`).map(res => res.json());

        return this.http.delete(`${this.urls.url}/deleteEvent/${id}/${wId}/${week}`).map(res => res.json());
    }

    updateEvent(id, wId, week, data) {
        return this.http.post(`${this.urls.url}/updateEvent/${id}/${wId}/${week}`, data).map(res => res.json());
    }

    updateResizeDropEvents(week, wId, data) {
        if(localStorage.getItem('username') == 'admin')
        return this.http.post(`${this.urls.url}/updateEventsResize/${wId}/${week}`, data).map(res => res.json());
        
        return this.http.post(`${this.urls.url}/updateResize/${wId}/${week}`, data).map(res => res.json());
    }

}