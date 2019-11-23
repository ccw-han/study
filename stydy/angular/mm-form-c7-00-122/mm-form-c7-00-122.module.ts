
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LayoutHomeModule } from '../layout-home/layout-home.module';
import { CommonComponentModule } from '../common-component.module';
import { MmFormC700122Component } from './mm-form-c7-00-122';

@NgModule({
    declarations: [
        MmFormC700122Component
    ],
    imports: [
        CommonComponentModule,
        LayoutHomeModule,
        IonicPageModule.forChild(MmFormC700122Component),
    ],
    exports: [
        MmFormC700122Component
    ]
})
export class MmFormC700122ComponentModule { }
