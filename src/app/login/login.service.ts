import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Urls } from '../services/urls';
// import { RequestOptions } from '@angular/http/src/base_request_options';

@Injectable()

export class LoginService{
    constructor(private http : Http, private urls : Urls){

    }

    login(data){
        // var options : RequestOptions = { 'Content-Type' : "application/json"}
        return this.http.post(this.urls.url + `/login`, data)
    }
}