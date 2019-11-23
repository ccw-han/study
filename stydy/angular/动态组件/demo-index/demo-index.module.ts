import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LayoutHomeModule} from '../layout-home/layout-home.module';
import {CommonComponentModule} from '../common-component.module';
import {DemoIndexComponent} from './demo-index';

@NgModule({
  declarations: [
    DemoIndexComponent
  ],
  imports: [
    CommonComponentModule,
    LayoutHomeModule,
    IonicPageModule.forChild(DemoIndexComponent),
  ],
  exports: [
    DemoIndexComponent
  ]
})
export class DemoIndexModule {
}
