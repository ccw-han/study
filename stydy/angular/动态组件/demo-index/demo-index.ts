import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {BaseAppComponent} from '../base-app';
import {CheckListInfoServiceProvider} from '../../providers/checklist-info-service/checklist-info-service';
import {TranslateService} from '@ngx-translate/core';
import {NativeProvider} from '../../providers/native/native';
import {MmFormC7Ct103} from '../../model/mm-form-c7-ct-103';
import {UserService} from '../../providers/user/user-service';
import moment from 'moment';
import {DemoIndex} from "../demo/DataType";

@IonicPage()
@Component({
  selector: 'demo-index',
  templateUrl: 'demo-index.html'
})
export class DemoIndexComponent extends BaseAppComponent implements OnInit {
  editFormPath: string = 'DemoComponent';
  loginLine: string;
  pageName: string = "DemoComponent";
  today = moment().format("YYYY-MM-DD");
  yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');

  constructor(public nav: NavController,
              public translate: TranslateService,
              public navParams: NavParams,
              public checkListInfoServiceProvider: CheckListInfoServiceProvider,
              private nativeProvider: NativeProvider,
              private userService: UserService,
              private modalCtrl: ModalController,) {
    super(nav, translate);
    this.loginLine = this.userService.loginLine;
  }

  tableName: string = "demo_index";
  list: Array<DemoIndex> = new Array<DemoIndex>();

  ngOnInit() {
    this.selectRecords();
  }

  selectRecords() {
    console.log("name:"+this.tableName);
    console.log("loginLine:"+this.userService.loginLine);
    console.log("today:"+this.today);
    console.log("yesterday:"+this.yesterday);
    this.nativeProvider.selectRecord(this.tableName, null, "(recordStatus != '已作废' and lineSn = '" + this.userService.loginLine + "' and (checkDate = '" + this.today + "'or checkDate = '" + this.yesterday + "' )) or (recordStatus='进行中' and lineSn = '" + this.userService.loginLine + "' )", "checkDate asc")
      .subscribe((rows) => {
        this.list = [];
        console.log("length:"+rows.length);
        if (rows.length) {
          for (let index = 0; index < rows.length; index++) {
            this.list.push(rows.item(index));
          }
        }
      })
  }

  toForm(id, pageName, tableName) {
    let version = 0;
    this.nativeProvider.selectOne('benchmark', ["max(version) version"], "tableCode='" + tableName.replace(/_/g, "-").toLowerCase() + "'").subscribe(data => {
      version = data.version;
      if (id != null) {
        this.push(pageName, {id: id, version: version});
      } else {
        this.push(pageName, {version: version});
      }
    });
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
    this.selectRecords();
  }

  //已作废按钮点击事件
  delRecord(idx, $event) {
    let userConfirmModal = this.modalCtrl.create('UserConfirmComponent', {title: '修改审核', roleType: '1'});
    userConfirmModal.onDidDismiss(data => {
      if (data) {
        this.delete(idx, $event);
      }
    });
    userConfirmModal.present();
    $event.stopPropagation();//阻止父组件的点击事件
  }

  delete(idx, $event) {
    this.list[idx].recordStatus = "已作废";
    this.nativeProvider.saveRecord(this.tableName, this.list[idx]);
    this.nativeProvider.deleteRecord("task_process_info", null, "keyValue = '" + this.list[idx].id + "'");
    this.selectRecords();
    $event.stopPropagation();//阻止父组件的点击事件

  }

}
