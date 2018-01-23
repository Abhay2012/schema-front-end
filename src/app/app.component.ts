import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  logout: boolean;

  constructor( private ac : ActivatedRoute) {
    if(document.URL.indexOf('login')){
      this.logout = false;
    }else{
      
    }
  }

  // logout() {

  // }

}
