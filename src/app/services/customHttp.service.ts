import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


function getToken(): any {

    let token = localStorage.getItem('access_token');
    let loginType = localStorage.getItem('loginType');
    let header;
    if (!token) {
        header = 'Basic ' + btoa(`gulf_${loginType}:riddhi`);
    } else {
        header = 'Bearer ' + localStorage.getItem('access_token') || '';
    }
    return header;
}

@Injectable()
export class CustomHttpService extends Http {

    accountHeader: string;
    constructor(backend: XHRBackend, options: RequestOptions) {


        options.headers = new Headers({
            'Authorization': `${getToken()}`,
            'account': localStorage.getItem('loginType'),
            'isWeb' : true
        });

        super(backend, options);
    }

    // its like interceptor, calls by each methods internally like get, post, put, delete etc
    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

        if (typeof url === 'string') {
            if (!options) {
                options = { headers: new Headers() };
            }

            options.headers.set('Authorization', `${getToken()}`);
            options.headers.set('account', localStorage.getItem('loginType'));
        } else {

            url.headers.set('Authorization', `${getToken()}`);
            url.headers.set('account', localStorage.getItem('loginType'));
        }
        return super.request(url, options);
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {

        return super.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {

        return super.post(url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {

        return super.put(url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }


    extractData(res: Response) {
        /**
        * res.json() raises exception if body is not a valid json or body is not present in response
        * that's why it is written in try block
        * */
        // console.log(res);

        try {
            return res.json();
        } catch (error) {
            return res.status;
        }
    }

    handleError(error: Response | any) {

        console.log(error);
        let err: any = {};
        if (error instanceof Response) {

            let body;
            try {
                body = error.json();
            } catch (error) {
                body = '';
            }

            let errMsg = body.error || 'Internal server error, Try again later ';
            err.status = error.status;
            err.msg = errMsg;

            if (error.status === 0) {
                err.status = 0;
                err.msg = 'No Internet, Check Your connection Or Try again';
            }
        }
        else {
            err = error.message ? error.message : error.toString();
        }

        return Observable.throw(err);
    }
}