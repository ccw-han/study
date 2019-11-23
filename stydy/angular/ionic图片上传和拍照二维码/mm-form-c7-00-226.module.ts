import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LayoutHomeModule } from '../layout-home/layout-home.module';
import { CommonComponentModule } from '../common-component.module';
import { MmFormC700226Component } from './mm-form-c7-00-226';
@NgModule({
    declarations: [
        MmFormC700226Component
    ],
    imports: [
    
LayoutHomeModule,
        CommonComponentModule,
        IonicPageModule.forChild(MmFormC700226Component),
    ],
    exports: [
        MmFormC700226Component
    ]
})
export class MmFormC700226Module { }