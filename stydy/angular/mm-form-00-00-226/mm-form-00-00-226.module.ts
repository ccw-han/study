import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LayoutHomeModule } from '../layout-home/layout-home.module';
import { CommonComponentModule } from '../common-component.module';
import { MmForm0000226Component } from './mm-form-00-00-226';
@NgModule({
    declarations: [
        MmForm0000226Component
    ],
    imports: [
        LayoutHomeModule,
        CommonComponentModule,
        IonicPageModule.forChild(MmForm0000226Component),
    ],
    exports: [
        MmForm0000226Component
    ]
})
export class MmForm0000226Module { }