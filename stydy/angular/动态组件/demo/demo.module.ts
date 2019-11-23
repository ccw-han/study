import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LayoutHomeModule} from '../layout-home/layout-home.module';
import {DemoComponent} from "./demo";
import {CommonComponentModule} from "../common-component.module";
import {HeroProfileComponent} from "./hero-profile.component";
import {AdDirective} from "./ad.directive";
import {CheckItemBtnComponent} from "../check-item/check-item-btn";
import {CheckButtonComponent} from "../check-item/example/check-button";
import {CheckItemResultComponent} from "../check-item/check-item-result";
import {UserConfirmComponent} from "../check-item/example/user-confirm";

@NgModule({
  declarations: [
    DemoComponent,
    HeroProfileComponent,
    AdDirective,
  ],
  imports: [
    CommonComponentModule,
    LayoutHomeModule,
    IonicPageModule.forChild(DemoComponent),
  ],
  entryComponents: [HeroProfileComponent, CheckItemBtnComponent,
    CheckButtonComponent, CheckItemResultComponent, UserConfirmComponent,
  ],
  exports: [
    DemoComponent
  ]
})
export class DemoModule {
}
