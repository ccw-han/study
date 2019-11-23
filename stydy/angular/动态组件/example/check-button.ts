import {Component, Input, OnInit} from '@angular/core';
import {DataType, DemoResult} from "../../demo/DataType";
import {UUID} from "angular2-uuid";
import {NativeProvider} from "../../../providers/native/native";
import {MmFormC7Ct101B} from "../../../model/mm-form-c7-ct-101-b";
import moment from "moment";
import {NavController} from "ionic-angular";

@Component({
  selector: 'check-button',
  templateUrl: 'check-button.html'
})
export class CheckButtonComponent implements OnInit {
  @Input() data: DataType;
  @Input() value: any;
  demoReslt: DemoResult;

  constructor(private nativeProvider: NativeProvider,
              private nav: NavController) {
  }

  ngOnInit(): void {
  }

  onCheck() {
    let resultY: number = 0;//判定为Y的数量
    let resultN: number = 0;//判定为N的数量
    for (let index = 1; index <= this.value.resultMax; index++) {
      if (this.value['checkResult' + index] == 'Y' || this.value['checkResult' + index] == '-') {
        resultY++;
      }
      if (this.value['checkResult' + index] == 'N') {
        resultN++;
      }
    }
    if ((resultY + resultN) == this.value.resultMax) {
      this.value.confirmResult = resultN == 0 ? 'Y' : 'N';
    }
    //存数据库
    this.demoReslt = new DemoResult();
    if (this.value[this.data.ngModel + '_id']) {
      this.demoReslt.id = this.value[this.data.ngModel + '_id']
    }
    this.demoReslt.pId = this.value["pId"];
    this.demoReslt.checkField1 = this.data.ngModel;
    this.demoReslt.checkValue1 = this.value[this.data.ngModel];
    this.demoReslt.checkField2 = this.data.resultFieldName;
    this.demoReslt.checkValue2 = this.value[this.data.resultFieldName];
    this.nativeProvider.saveRecord(this.value["tableName"], this.demoReslt).subscribe(
      (res) => {
        this.value[this.data.ngModel + '_id'] = this.demoReslt.id;
      }
    );

  }

  //处理新开，作废
  onAudit($e) {
    if ($e == 'cancel') {
      this.value.recordStatus = "已作废";//本表的完成状态
      this.nativeProvider.updateRecord(this.value.indexTableName, {
        recordStatus: "已作废"
      }, " id = '" + this.value.pId + "'");
      this.nativeProvider.deleteRecord("task_process_info", null, "keyValue = '" + this.value.pId + "'");
      this.nav.pop();
    }
    if ($e == 'new') {
      this.value.recordStatus = "已作废";//本表的完成状态
      this.nativeProvider.updateRecord(this.value.indexTableName, {
        recordStatus: "已作废"
      }, " id = '" + this.value.pId + "'");
      this.nativeProvider.deleteRecord("task_process_info", null, "keyValue = '" + this.value.pId + "'");
      this.value.pId = null;
      this.value.checkDate = moment().format("YYYY-MM-DD");
    }
  }

}
