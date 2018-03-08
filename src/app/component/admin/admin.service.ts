import { Injectable } from '@angular/core';
import { Urls } from '../../services/urls';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AdminService{
    
    constructor(private http : Http, private urls : Urls){

    }

    getUsers(){
        return this.http.get(`${this.urls.url}/users`).map(response => response.json());
    }

    getAdminPanel(){
        return this.http.get(`${this.urls.url}/adminPanel`).map(response => response.json());
    }

    updateUser(data){
        return this.http.post(`${this.urls.url}/updateUser`,data).map(res => res.json());
    }

    updateAdminPanel(data){
        return this.http.post(`${this.urls.url}/updateAdminData`,data).map(res => res.json());
    }

    createUser(data){
        return this.http.post(`${this.urls.url}/createUser`,data).map(res => res.json());
    }

    addAdminPanel(data){
        return this.http.post(`${this.urls.url}/addAdminPanel`,data).map(res => res.json());    
    }

    deleteUser(username){
        return this.http.delete(`${this.urls.url}/deleteUser/${username}`).map(res => res.json());
    }

    deleteFromAdminPanel(id){
        return this.http.delete(`${this.urls.url}/deleteFromAdminPanel/${id}`).map(res => res.json());
    }

    getDelNames(username){
        return this.http.get(`${this.urls.url}/delName/${username}`).map(res => res.json());
    }

    deleteDelName(id){
        return this.http.delete(`${this.urls.url}/deleteDelName/${id}`).map(res => res.json());
    }

    updateDelName(data){
        return this.http.post(`${this.urls.url}/updateDelName`,data).map(res => res.json());
    }

    addDelName(data,username){
        return this.http.post(`${this.urls.url}/createDelName/${username}`,data).map(res => res.json());
    }

    moveDelNames(username,username1,data){
        return this.http.post(`${this.urls.url}/moveDelName/${username}/${username1}`,data).map(res => res.json());
    }

    uploadDelNames(username,data){
        return this.http.post(this.urls.url+`/upload/${username}`,data).map(res => res.json());
    }

    changeUserPassword(data,username){
        return this.http.post(`${this.urls.url}/changeUserPassword/${username}`, data);
    }

    createEventsTemplate(data){
        return this.http.post(`${this.urls.url}/createEventsTemplate`,data).map( res=>res.json());
    }

    deleteEventsTemplate(id){
        return this.http.delete(`${this.urls.url}/deleteEventsTemplate/${id}`).map(res=>res.json());
    }
}