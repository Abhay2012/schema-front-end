import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';

declare let $: any;
@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css'],
    providers: [HeaderService]
})
export class HeaderComponent {

    localStorage;
    responseMessage = '';
    responseColor = 'transparent';
    constructor(private router: Router, private hs: HeaderService) {
        this.localStorage = localStorage;
    }

    showSideMenu() {
        var sideMenu = document.getElementById('sideMenu');
        if (sideMenu.style.display == 'none') {
            sideMenu.style.display = 'inline-block';
        } else {
            sideMenu.style.display = 'none';
        }
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['login']);
    }

    changePassword(event) {
        if (event.value.newPassword.match(/^[0-9a-zA-Z]+$/)) {
            this.hs.changePassword(event.value).subscribe((res: any) => {
                this.setResetMessage(res.message, res.color);
            }, (err: any) => {

            })
        } else {
            this.setResetMessage('Invalid Password', "red");
        }
    }

    changeCopyPassword(event) {
        //console.log(event.value);
        if (event.value.newPassword.match(/^[0-9a-zA-Z]+$/)) {
            this.hs.changeCopyPassword(event.value).subscribe((res: any) => {
                this.setResetMessage(res.message, res.color)
            }, (err: any) => {

            })
        }
    }

    getAccess(form) {
        form.value.username = 'admin';
        console.log(form);
        this.hs.getAccess(form.value).subscribe((res: any) => {
            if(!res.error){
                this.localStorage.setItem("grant_access","true");
                this.setResetMessage("Access Granted", "green");
            }else this.setResetMessage("Access Denied", "red");
        }, (er: any) => {

        })
    }


    copyAccess(form) {
        form.value.username = 'copyAccess';
        this.hs.getAccess(form.value).subscribe((res: any) => {
            if(!res.error){
                this.localStorage.setItem("grant_access","true");
                this.setResetMessage("Access Granted", "green");
            }else this.setResetMessage("Access Denied", "red");
        }, (er: any) => {

        })
    }

    openModal(id) {
        this.responseMessage = '';
        this.responseColor = 'transparent';
        $(id).modal('show');
    }

    setResetMessage(message, color) {
        this.responseColor = color;
        this.responseMessage = message;
        setTimeout(() => {
            this.responseColor = "transparent";
            this.responseMessage = "";
        }, 2000);
    }
}