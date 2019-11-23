import {Component, ComponentFactoryResolver, Input, TemplateRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {AdItem} from "./ad-item";
import {DataType, DemoIndex} from "./DataType";
import {CheckButtonComponent} from "../check-item/example/check-button";
import {CheckItemResultComponent} from "../check-item/check-item-result";
import {UserConfirmComponent} from "../check-item/example/user-confirm";
import {UserService} from "../../providers/user/user-service";
import {TaskProcessInfo} from "../../model/task-detail";
import moment from "moment";
import {NativeProvider} from "../../providers/native/native";
import {MmFormC7Ct101B} from "../../model/mm-form-c7-ct-101-b";
import {UserInfo} from "../../model/user-info";
import {TranslateService} from "@ngx-translate/core";
import {NgUpdateProvider} from "../../providers/ng-update/ng-update";
import {MmFormC7Ct101BBenchmark} from "../../model/mm-form-c7-ct-101-b-benchmark";

@IonicPage()
@Component({
  selector: 'demo',
  templateUrl: 'demo.html'
})
export class DemoComponent {
  mmCt101bBenchmark: MmFormC7Ct101BBenchmark = new MmFormC7Ct101BBenchmark();
  tableName: string = 'demo';
  indexTableName: string = 'demo_index';
  flag: boolean = false;
  pId: string;
  formCode: string = "demo";
  formName: string = "设备点检 - demo";
  tableCode: string = 'demo';
  version: number = 0;
  demoIndex: DemoIndex = new DemoIndex();
  trs: any[] = [];
  tds1: any[] = [
    {rowspan: 2, colspan: 1, label: "点检项目"},
    {rowspan: 2, colspan: 1, label: "No."},
    {rowspan: 2, colspan: 2, label: "检查项目"},
    null,
    {rowspan: 2, colspan: 1, label: "GOT点检部位"},
    {rowspan: 2, colspan: 1, label: "标准件编号"},
    {rowspan: 2, colspan: 1, label: "点检工位"},
    {rowspan: 2, colspan: 1, label: "品种"},
    {rowspan: 1, colspan: 2, label: "基准"}, null,
    {rowspan: 2, colspan: 1, label: "单位"},
    {rowspan: 2, colspan: 1, label: "周期"},
    {colspan: 1, rowspan: 2, label: "值", width: "100px"},
    {colspan: 1, rowspan: 2, label: "判定"}
  ];
  tds2: any[] = [
    null, null, null, null, null, null, null, null,
    {colspan: 1, rowspan: 1, label: "中心值"},
    {colspan: 1, rowspan: 1, label: "基准"},
    null, null, null, null
  ];
  tds3: any[] = [
    {rowspan: 10, colspan: 1, label: "始业点检(S)"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 2, rowspan: 1, label: "目视检查设备内无工件残留"},
    null,
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "无工件残留"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds4: any[] = [
    null,
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 2, rowspan: 1, label: "制造品种"},
    null,
    {colspan: 1, rowspan: 1, label: "GOT主画面"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "参照GOT填写"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds5: any[] = [
    null,
    {colspan: 1, rowspan: 1, label: "S1"},
    {colspan: 1, rowspan: 1, label: "计量天平"},
    {colspan: 1, rowspan: 1, label: "水泡在圆圈内"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, img: "assets/imgs/bird.png"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds6: any[] = [
    null,
    {colspan: 1, rowspan: 1, label: "S2"},
    {colspan: 1, rowspan: 1, label: "计量天平"},
    {colspan: 1, rowspan: 1, label: "天平'0.000'设定"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "0.000"},
    {colspan: 1, rowspan: 1, label: "g"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds7: any[] = [
    null,
    {colspan: 1, rowspan: 2, label: "S3"},
    {colspan: 1, rowspan: 2, label: "计量天平"},
    {colspan: 1, rowspan: 1, label: "400g砝码的测定"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "B-191 B-192"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "399.996<=OK<=400.004"},
    {colspan: 1, rowspan: 1, label: "g"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds8: any[] = [
    null, null, null,
    {colspan: 1, rowspan: 1, label: "1000g砝码的测定"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "B-365"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "999.996<=OK<=1000.004"},
    {colspan: 1, rowspan: 1, label: "g"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1}, {colspan: 1, rowspan: 1}
  ];
  tds9: any[] = [
    null,
    {colspan: 1, rowspan: 1, label: "S4"},
    {colspan: 2, rowspan: 1, label: "天平夹具"},
    null,
    {colspan: 1, rowspan: 1, label: "GOT始业点检1"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "458.215<=OK<=458.255"},
    {colspan: 1, rowspan: 1, label: "g"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds10: any[] = [
    null, {colspan: 1, rowspan: 1, label: "S5"},
    {colspan: 2, rowspan: 1, label: "CLB颜色识别"},
    null,
    {colspan: 1, rowspan: 1, label: "GOT始业点检1"},
    {colspan: 1, rowspan: 1, label: "C-823"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "GOT判定OK"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds11: any[] = [
    null,
    {colspan: 1, rowspan: 1, label: "S6"},
    {colspan: 2, rowspan: 1, label: "条形码印刷质量确认"},
    null,
    {colspan: 1, rowspan: 1, label: "GOT始业点检1"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "目视判定OK"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds12: any[] = [
    null,
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 2, rowspan: 1, label: "标准件点检结束归位确认"},
    null,
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "全品种"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "无标准件残留"},
    {colspan: 1, rowspan: 1, label: "-"},
    {colspan: 1, rowspan: 1, label: "一天一次(作业前)"},
    {colspan: 1, rowspan: 1},
    {colspan: 1, rowspan: 1}
  ];
  tds13: any[] = [{colspan: 12, rowspan: 1, label: "点检判定(Y/N)"},
    null, null, null, null, null, null, null, null, null, null, null,
    {colspan: 2, rowspan: 1, confirmResultLabel: true},
    null
  ];
  tds14: any[] = [{colspan: 12, rowspan: 1, label: "点检者(技能工)"},
    null, null, null, null, null, null, null, null, null, null, null,
    {colspan: 2, rowspan: 1, checkPersonLabel: true},
    null
  ];
  tds15: any[] = [{colspan: 12, rowspan: 1, label: "确认者(班长)"},
    null, null, null, null, null, null, null, null, null, null, null,
    {colspan: 2, rowspan: 1},
    null
  ];
  tds16: any[] = [
    {colspan: 1, rowspan: 1, label: "备注"},
    {colspan: 13, rowspan: 1},
    null, null, null, null, null, null, null, null, null, null, null, null
  ];

  dataValue = {
    tableName: "demo",
    indexTableName: "demo_index",
    formCode: "demo",
    checkDate: null,
    lineSn: null,
    resultMax: 10,
    checkPerson: null,
    checkPersonId: null,
    confirmResult: null,
    confirmPerson: null,
    confirmPersonId: null,
    recordStatus: "进行中",
    pId: null,

  };
  datas1 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue1", "confirmPerson", "目视检查设备内无工件残留", "data", "checkValue1", null, "checkResult1", true));
  datas2 = new AdItem(CheckItemResultComponent, {result: "checkResult1"});
  datas3 = new AdItem(CheckButtonComponent, new DataType("tableName", " ", "confirmPerson", "制造品种", "data", "checkValue2", "checkResult1", "checkResult2", true));
  datas4 = new AdItem(CheckItemResultComponent, {result: "checkResult2"});
  datas5 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue3", "confirmPerson", "计量天平-水泡在圆圈内", "data", "checkValue3", "checkResult2", "checkResult3", true));
  datas6 = new AdItem(CheckItemResultComponent, {result: "checkResult3"});
  datas7 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue4", "confirmPerson", "计量天平-天平'0.000'设定", "data", "checkValue4", "checkResult3", "checkResult4", true));
  datas8 = new AdItem(CheckItemResultComponent, {result: "checkResult4"});
  datas9 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue5", "confirmPerson", "计量天平-400g砝码的测定", "data", "checkValue5", "checkResult4", "checkResult5", true));
  datas10 = new AdItem(CheckItemResultComponent, {result: "checkResult5"});
  datas11 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue6", "confirmPerson", "计量天平-400g砝码的测定-B-365", "data", "checkValue6", "checkResult5", "checkResult6", true));
  datas12 = new AdItem(CheckItemResultComponent, {result: "checkResult6"});
  datas13 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue7", "confirmPerson", "天平夹具", "data", "checkValue7", "checkResult6", "checkResult7", true));
  datas14 = new AdItem(CheckItemResultComponent, {result: "checkResult7"});
  datas15 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue8", "confirmPerson", "CLB颜色识别", "data", "checkValue8", "checkResult7", "checkResult8", true));
  datas16 = new AdItem(CheckItemResultComponent, {result: "checkResult8"});
  datas17 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue9", "confirmPerson", "条形码印刷质量确认", "data", "checkValue9", "checkResult8", "checkResult9", true));
  datas18 = new AdItem(CheckItemResultComponent, {result: "checkResult9"});
  datas19 = new AdItem(CheckButtonComponent, new DataType("tableName", "checkValue10", "confirmPerson", "标准件点检结束归位确认", "data", "checkValue10", "checkResult9", "checkResult10", true));
  datas20 = new AdItem(CheckItemResultComponent, {result: "checkResult10"});
  datas22 = new AdItem(UserConfirmComponent, {roleType: 2, name: "userConfirm"});
  dataExample = {
    "2|12": this.datas1, "2|13": this.datas2,
    "3|12": this.datas3, "3|13": this.datas4,
    "4|12": this.datas5, "4|13": this.datas6,
    "5|12": this.datas7, "5|13": this.datas8,
    "6|12": this.datas9, "6|13": this.datas10,
    "7|12": this.datas11, "7|13": this.datas12,
    "8|12": this.datas13, "8|13": this.datas14,
    "9|12": this.datas15, "9|13": this.datas16,
    "10|12": this.datas17, "10|13": this.datas18,
    "11|12": this.datas19, "11|13": this.datas20,
    "14|12": this.datas22
  };

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              userService: UserService,
              private nativeProvider: NativeProvider,
              public nav: NavController,
              public translate: TranslateService,
              public navParams: NavParams,
              private ngUpdateProvider: NgUpdateProvider,
              private uservice: UserService) {
    this.pId = navParams.get("id");
    if (this.pId) {
      this.dataValue.pId = this.pId;
    }
    this.version = navParams.get("version");
    //初始化赋值，俩个对象都要
    //this.giveValue(this.demoIndex);
    this.giveDataValue(this.dataValue);
  }

  ngOnInit() {
    this.trs.push(this.tds1);
    this.trs.push(this.tds2);
    this.trs.push(this.tds3);
    this.trs.push(this.tds4);
    this.trs.push(this.tds5);
    this.trs.push(this.tds6);
    this.trs.push(this.tds7);
    this.trs.push(this.tds8);
    this.trs.push(this.tds9);
    this.trs.push(this.tds10);
    this.trs.push(this.tds11);
    this.trs.push(this.tds12);
    this.trs.push(this.tds13);
    this.trs.push(this.tds14);
    this.trs.push(this.tds15);
    this.trs.push(this.tds16);
    //根据传过来的pId查询，如果查到就是查询，没查到就是新建
    if (this.pId) {
      this.nativeProvider.selectOne(this.indexTableName, null, " id = '" + this.pId + "'").subscribe(
        {
          next: data => {
            if (data) {
              this.demoIndex = data;
              if (this.demoIndex.confirmPerson) {
                this.dataValue.confirmPerson = this.demoIndex.confirmPerson;
                this.dataValue.confirmPersonId = this.demoIndex.confirmPersonId;
              }
              if (this.demoIndex.checkPerson) {
                this.dataValue.checkPerson = this.demoIndex.checkPerson;
                this.dataValue.checkPersonId = this.demoIndex.checkPersonId;
              }
              this.dataValue.confirmResult = this.demoIndex.confirmResult;
              this.version = +this.demoIndex.version;
              this.dataValue['version'] = this.version;
              this.nativeProvider.selectRecord(this.tableName, null, " pId = '" + this.pId + "'", null).subscribe(
                (res) => {
                  var children = [];
                  if (res.length) {
                    for (let index = 0; index < res.length; index++) {
                      children.push(res.item(index));
                    }
                    children.forEach((element) => {
                      this.dataValue[element.checkField1] = element.checkValue1;
                      this.dataValue[element.checkField2] = element.checkValue2;
                      this.dataValue[element.checkField1 + '_id'] = element.id;
                    })
                  }
                }
              );
            }
            this.getBenchmarks();
          },
        }
      );
    } else {
      this.demoIndex = new DemoIndex();
      this.getBenchmarks();
    }
  }

  getBenchmarks() {
    // this.nativeProvider.selectRecord('benchmark', null, "tableCode='" + this.tableCode + "' and version='" + this.version + "'", null)
    //   .subscribe(benchmarks => {
    //     for (let i = 0; i < benchmarks.length; i++) {
    //       let field = benchmarks.item(i).fieldName.replace("checkValue", "benchmark");
    //       this.mmCt101bBenchmark[field] = benchmarks.item(i).fieldValue;
    //     }
    //     console.log(benchmarks);
    //     console.log(this.mmCt101bBenchmark);
    //   });
  }

  //确定按钮
  saveRecord() {
    //判断是否创建处理表
    let startTask = false;
    if (!this.demoIndex.id) {
      startTask = true;
    }
    this.giveIndexValue(this.demoIndex);
    this.nativeProvider.saveRecord(this.indexTableName, this.demoIndex);
    this.dataValue.pId = this.demoIndex.id;
    if (startTask) {//正在处理表的创建
      let taskInfo: TaskProcessInfo = new TaskProcessInfo();
      taskInfo.checkDate = this.demoIndex.checkDate;
      taskInfo.code = this.formCode;
      taskInfo.name = this.formName;
      taskInfo.pageName = "DemoComponent";
      taskInfo.keyName = "id";
      taskInfo.keyValue = this.demoIndex.id;
      taskInfo.version = this.version;
      this.uservice.addNewTaskProgress(taskInfo);
    }
  }

  //备注
  saveRemark() {
    this.nativeProvider.saveRecord(this.indexTableName, this.demoIndex);
  }

  //触发事件
  eventHandlerH($event) {
  }

  giveDataValue(data: any) {
    data.lineSn = this.uservice.loginLine;
    data.checkDate = moment().format("YYYY-MM-DD");
    data.tableName = this.tableName;
    data.checkPerson = this.uservice.loginUser.userNick;
    data.checkPersonId = this.uservice.loginUser.userId;
    data.version = this.version;
  }

  giveIndexValue(data: any) {
    data.lineSn = this.dataValue.lineSn;
    data.checkDate = this.dataValue.checkDate;
    data.tableName = this.dataValue.tableName;
    data.checkPerson = this.dataValue.checkPerson;
    data.recordStatus = this.dataValue.recordStatus;
    data.checkPersonId = this.dataValue.checkPersonId;
    data.version = this.dataValue['version'];
  }
}
