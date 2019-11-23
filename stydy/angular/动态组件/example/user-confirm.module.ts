import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LayoutHomeModule } from '../../layout-home/layout-home.module';
import { CommonComponentModule } from '../../common-component.module';
import {UserConfirmComponent} from "./user-confirm";

@NgModule({
    declarations: [
      UserConfirmComponent
    ],
    imports: [
        CommonComponentModule,
        LayoutHomeModule,
        IonicPageModule.forChild(UserConfirmComponent),
    ],
    exports: [
      UserConfirmComponent
    ]
})
export class CheckItemExampleModule { }
