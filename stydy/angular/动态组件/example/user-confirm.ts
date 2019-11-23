import {UserInfo} from './../../../model/user-info';
import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../providers/user/user-service";
import {NativeProvider} from "../../../providers/native/native";

@Component({
  selector: 'user-confirm',
  templateUrl: 'user-confirm.html'
})
export class UserConfirmComponent implements OnInit {
  @Input() data: any;
  @Input() value: any;
  confirmPerson: UserInfo;//确认者
  constructor(private uservice: UserService,
              private nativeProvider: NativeProvider,) {

  }

  ngOnInit(): void {
    if (this.value.confirmPerson) {
      console.log("confirmPerson:"+this.value.confirmPerson);
      this.confirmPerson = new UserInfo();
      this.confirmPerson.userNick = this.value.confirmPerson;
      this.confirmPerson.userId = this.value.confirmPersonId;
    }
  }

  userConfirmed() {
    if (this.confirmPerson) {
      this.value.confirmPerson = this.confirmPerson.userNick;
      this.value.confirmPersonId = this.confirmPerson.userId;
      this.value.recordStatus = "已完成";//表的状态
      let hasNg = false;
      if (this.value.confirmResult == 'N') {
        hasNg = true;
      }
      this.uservice.completeTaskProgress(this.value.formCode, this.value.pId, hasNg);//完成表的创建
    }
    this.nativeProvider.updateRecord(this.value.indexTableName, {
      recordStatus: "已完成",
      confirmPerson: this.value.confirmPerson,
      confirmPersonId: this.value.confirmPersonId,
      confirmResult: this.value.confirmResult
    }, " id = '" + this.value.pId + "'");
  }

}
