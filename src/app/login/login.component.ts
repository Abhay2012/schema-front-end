import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService]
})
export class LoginComponent {
    isLogin: boolean = true;
    message;
    _MS_PER_DAY = 1000 * 60 * 60 * 24;
    loader: boolean = false;
    constructor(private ls: LoginService, private router: Router) {

    }

    login(form) {
        var date = new Date();
        this.loader = true;
        this.ls.login(form.value).subscribe((res: any) => {
            res = JSON.parse(res._body);

            console.log(res);
            if (!res.error) {
                localStorage.setItem('username', res.username);
                localStorage.setItem('access_token', res.access_token);
                localStorage.setItem('name', res.name);
                localStorage.setItem('address', res.data.address);
                if(res.username != 'admin'){
                    for (let del of res.data.delName) {
                        if (this.dateDiffInDays(new Date(del.start),date) >= 0 && this.dateDiffInDays(new Date(del.end),date) <= 0){
                            localStorage.setItem('weekTemplate',del.name);
                            break;
                        }
                        else{
                            localStorage.setItem('weekTemplate',null);
                        }
                    }    
                }
                

                var id = localStorage.getItem('username');
                this.router.navigate(['user', id]);
            } else {
                this.message = res.message;
                this.loader = false;
            }
        }, (err: any) => {

        })
    }

    dateDiffInDays(a, b) {
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / this._MS_PER_DAY);
      }
}