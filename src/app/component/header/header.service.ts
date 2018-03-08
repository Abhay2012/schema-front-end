import { Injectable } from '@angular/core';
import { Urls } from '../../services/urls';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HeaderService{

    constructor(private urls : Urls, private http:Http){

    }

    changePassword(data){
        return this.http.post(`${this.urls.url}/changePassword/${localStorage.getItem('username')}`, data).map(response => response.json());
    }

    changeCopyPassword(data){
        return this.http.post(`${this.urls.url}/changePassword/${'copyAccess'}`, data).map(response => response.json());
    }

    getAccess(data){
        return this.http.post(this.urls.url + `/login`, data).map(response => response.json());
    }

}