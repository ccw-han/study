import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { LayoutHomeModule } from '../../layout-home/layout-home.module';

import { CommonComponentModule } from '../../common-component.module';
import { CheckItemExampleComponent } from './check-item-example';



@NgModule({
    declarations: [
        CheckItemExampleComponent
    ],
    imports: [
        CommonComponentModule,
        LayoutHomeModule,
        IonicPageModule.forChild(CheckItemExampleComponent),
    ],
    exports: [
        CheckItemExampleComponent
    ]
})
export class CheckItemExampleModule { }
