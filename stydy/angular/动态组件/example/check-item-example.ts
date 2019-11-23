import { UserInfo } from './../../../model/user-info';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BaseAppComponent } from '../../base-app';
import { CheckListInfoServiceProvider } from '../../../providers/checklist-info-service/checklist-info-service';
import { TranslateService } from '@ngx-translate/core';
import { NativeProvider } from '../../../providers/native/native';
import { UserService } from '../../../providers/user/user-service';
import { MmFormC7Df101A } from '../../../model/mm-form-c7-df-101';
@IonicPage()
@Component({
    selector: 'check-item-example',
    templateUrl: 'check-item-example.html'
})
export class CheckItemExampleComponent extends BaseAppComponent implements OnInit {
    constructor(
        public nav: NavController,
        public translate: TranslateService,
        public navParams: NavParams,
        public checkListInfoServiceProvider: CheckListInfoServiceProvider,
        private nativeProvider: NativeProvider,
        private uservice: UserService,
    ) {
        super(nav, translate);

    }

    data: MmFormC7Df101A = new MmFormC7Df101A();
    benchmark1: string = '10 < OK && OK <=50';
    benchmark2: string = 'OK=="OK"';
    benchmark3: string = 'OK=="GOT"';
    benchmark4: string = '10 < OK && OK <80';
    confirmPerson: UserInfo;
    ngOnInit() {
    }

    onCheck($e){
      console.log("----check-begin----")
      console.log($e);
      console.log("----check-end----")
    }

    onAudit($e){
      console.log("----check-begin----")
      console.log($e);
      console.log("----check-end----")

    }

    printData(){
      console.log("----printData-begin----")
      console.log(this.confirmPerson);
      console.log(this.data);
      console.log("----printData-end----")

    }

}
