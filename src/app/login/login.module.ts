import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Urls } from '../services/urls';

@NgModule({
    declarations : [ LoginComponent ],
    imports : [ FormsModule, CommonModule,RouterModule.forChild([
        {
            path : '',
            component : LoginComponent
        }
    ]),HttpModule ],
    providers : [ Urls ]
})
export class LoginModule{

}