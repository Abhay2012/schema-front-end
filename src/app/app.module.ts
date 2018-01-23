import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo : 'login',
        pathMatch : 'full'
      },
      {
        path : 'login',
        loadChildren : 'app/login/login.module#LoginModule' 
      },
      {
          path : 'user/:id',
          loadChildren : 'app/user/user.module#UserModule'      
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
