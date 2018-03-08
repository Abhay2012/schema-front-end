import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports : [
        FormsModule, 
        ReactiveFormsModule,
        CommonModule
    ],
    declarations : [ HeaderComponent ],
    exports : [ HeaderComponent ]
})

export class HeaderModule{

}