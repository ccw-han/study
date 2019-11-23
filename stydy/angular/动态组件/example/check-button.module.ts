import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { LayoutHomeModule } from '../../layout-home/layout-home.module';

import { CommonComponentModule } from '../../common-component.module';
import {CheckButtonComponent} from "./check-button";



@NgModule({
    declarations: [
      CheckButtonComponent
    ],
    imports: [
        CommonComponentModule,
        LayoutHomeModule,
        IonicPageModule.forChild(CheckButtonComponent),
    ],
    exports: [
      CheckButtonComponent
    ]
})
export class CheckItemExampleModule { }
