import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
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
        path : 'user/admin',
        loadChildren : 'app/component/admin/admin.module#AdminModule'
      },
      {
          path : 'user/:id',
          loadChildren : 'app/component/user/user.module#UserModule'      
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
