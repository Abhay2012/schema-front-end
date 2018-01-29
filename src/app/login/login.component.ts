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
                localStorage.setItem('name', res.name);
                localStorage.setItem('address', res.data.address);
                this.router.navigate(['user', res.username]);
            } else {
                this.message = res.message;
                this.loader = false;
            }
        }, (err: any) => {

        })
    }
}