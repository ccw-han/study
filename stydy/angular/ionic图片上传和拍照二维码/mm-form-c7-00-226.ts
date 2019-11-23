import { TranslateService } from "@ngx-translate/core";
import { BaseAppComponent } from "../base-app";
import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ActionSheetController,
  ViewController,
  normalizeURL,
  Platform
} from "ionic-angular";
import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { NativeProvider } from "../../providers/native/native";
import { UserService } from "../../providers/user/user-service";
import { UserInfo } from "../../model/user-info";
import { ImagePicker } from "@ionic-native/image-picker";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ToastProvider } from "../../providers/toast/toast";
import { CodeModel } from "../../model/base-model";
import { CodeService } from "../../providers/user/code-service";
import { MmFormC700226 } from "../../model/mm-form-c7-00-226";
import * as moment from "moment";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { File, Entry } from "@ionic-native/file";
import { FilePath } from "@ionic-native/file-path";
import { TaskProcessInfo } from "../../model/task-detail";
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { Base64 } from '@ionic-native/base64';
import { AppSettings } from '../../app/app.settings'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'mm-form-c7-00-226',
  templateUrl: 'mm-form-c7-00-226.html',
})
export class MmFormC700226Component extends BaseAppComponent {

  tableName: string = "mm_form_c7_00_226"
  data: MmFormC700226 = new MmFormC700226()

  confirmPerson: UserInfo
  confirmPerson1: UserInfo
  classCodes: CodeModel[]
  shiftCodes: CodeModel[]
  ticketCodes: CodeModel[]
  codeListType: Array<any>
  codeList: Array<any>

  constructor(
    public nav: NavController,
    public translate: TranslateService,
    public navParams: NavParams,
    public sql: NativeProvider,
    public userService: UserService,
    public imagePicker: ImagePicker,
    public camera: Camera,
    public noticeSer: ToastProvider,
    public actionSheetCtrl: ActionSheetController,
    public codeService: CodeService,
    private photoViewer: PhotoViewer,
    private zBar: ZBar,
    private base64: Base64,
    private file: File,
    private appSettings: AppSettings,
    private transfer: FileTransfer,
  ) {
    super(nav, translate)

    this.data.id = navParams.get('id')
  }

  ngOnInit() {
    if (this.data.id) {
      // 加载已经填写的数据
      this.sql.selectOne(this.tableName, null, "id='" + this.data.id + "'").subscribe((data) => {
        this.data = data
        if (this.data.confirmPerson1) {
          this.confirmPerson1 = new UserInfo()
          this.confirmPerson1.userNick = this.data.confirmPerson1
          this.confirmPerson1.userId = this.data.confirmPersonId1
        }
        if (this.data.confirmPerson) {
          this.confirmPerson = new UserInfo()
          this.confirmPerson.userNick = this.data.confirmPerson
          this.confirmPerson.userId = this.data.confirmPersonId
        }
        // 图片处理
        if (this.data.ticketPic) {
          let limit = this.data.ticketPic.lastIndexOf('/')
          let path = this.data.ticketPic.substring(0, limit + 1)
          let file = this.data.ticketPic.substring(limit + 1, this.data.ticketPic.length)
          this.file.checkFile(path, file).then(result => {
            if (!result) { // 如果本地图片丢失则访问服务器上的图片
              this.data.ticketPic = AppSettings.API_ENDPOINT + '/r/fileTransfer/view/' + this.data.ticketPicId
              // TODO
              // 将服务器上的图片转到本地
            }
          }).catch(err => { })
        }
      })
    } else {
      this.data.lineSn = this.userService.loginLine
      this.data.checkDate = moment().format('YYYY-MM-DD')
    }

    // 获取班次
    this.codeService.getCodeByTypeFromDb("class_code").subscribe((data) => {
      this.classCodes = data
    })

    // 获取排班
    this.codeService.getCodeByTypeFromDb("shift_code").subscribe((data) => {
      this.shiftCodes = data
    })

    // 获取品种
    this.codeService.getCodeByTypeFromDb("c7_category").subscribe(data => {
      this.codeListType = data
      this.codeList = []
      for (let index = 0; index < this.codeListType.length; index++) {
        this.codeService.getCodeByTypeFromDb(this.codeListType[index].code).subscribe((rows) => {
          if (rows.length) {
            for (let i = 0; i < rows.length; i++) {
              this.codeList.push(rows[i])
            }
          }
        })
      }
    })
  }

  // 保存数据
  saveRecord() {
    let startTask = false;
    if (!this.data.id) {//在创建表的时候
      startTask = true;
    }
    this.sql.saveRecord(this.tableName, this.data);
    if (startTask) { //在新建表之后就新建在处理记录
      let taskInfo: TaskProcessInfo = new TaskProcessInfo();
      taskInfo.checkDate = this.data.checkDate;
      taskInfo.code = "mm-form-c7-00-226";
      taskInfo.name = "PRP使用对照表 -MC";
      taskInfo.pageName = 'MmFormC700226Component';
      taskInfo.keyName = 'id';
      taskInfo.keyValue = this.data.id;
      this.userService.addNewTaskProgress(taskInfo);
    }
  }

  // 拍照
  getPicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '请选择',
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: '从手机相册选择',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present()
  }

  // 调用相机
  takePicture(sourceType) {
    // 照片设置
    var options = {
      quality: 70,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI
    }

    // 拍照
    this.camera.getPicture(options).then((imagePath) => {
      this.data.ticketPic = imagePath
      // 上传文件到服务器
      this.uploadImage()

      // 保存数据
      this.saveRecord()
    }, (err) => {
      this.noticeSer.showToast('ERROR: 获取图片错误.')
    })
  }

  // 图片预览
  viewImage() {
    this.photoViewer.show(this.data.ticketPic, "预览", { share: false })
  }

  // zBar扫描仪
  scanner(type: string) {
    let options: ZBarOptions = {
      text_title: '扫描中',
      text_instructions: '请把相机对准条形码',
      flash: 'on',
      drawSight: true
    }

    this.zBar.scan(options).then(result => {
      if (result && result.length == 8) {
        let zbarDatas = result.split('')
        for (let index = 0; index < zbarDatas.length; index++) {
          this.data[type + (index + 1)] = zbarDatas[index]
        }

        // 三点照和OK/NG判断
        if (this.data.ticket1 && this.data.aluminum1 && this.data.plastic1) {
          let ticketStr, aluminumStr, plasticStr
          for (let index = 1; index < 9; index++) {
            ticketStr += this.data['ticket' + index]
            aluminumStr += this.data['aluminum' + index]
            plasticStr += this.data['plastic' + index]
          }
          if (ticketStr != aluminumStr || aluminumStr != plasticStr) {
            this.data.mcJudges1 = 'NG'
          } else {
            this.data.mcJudges1 = 'OK'
          }
        }

        if (this.data.ticket1 && this.data.aluminums1 && this.data.plastics1) {
          let ticketStr, aluminumsStr, plasticsStr
          for (let index = 1; index < 9; index++) {
            ticketStr += this.data['ticket' + index]
            aluminumsStr += this.data['aluminums' + index]
            plasticsStr += this.data['plastics' + index]
          }
          if (ticketStr != aluminumsStr || aluminumsStr != plasticsStr) {
            this.data.mcJudges2 = 'NG'
          } else {
            this.data.mcJudges2 = 'OK'
          }
        }
      }
      this.saveRecord()
    }).catch(error => { });
  }

  // 上传图片到服务器
  uploadImage() {
    let imagePath = this.data.ticketPic
    let url = AppSettings.API_ENDPOINT + '/r/fileTransfer/upload'
    this.data.ticketPicId = UUID.UUID().toString()
    const fileTransfer: FileTransferObject = this.transfer.create()

    // 文件上传配置
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file.png',
      mimeType: 'image/png',
      params: { 'ticketPicId': this.data.ticketPicId },
      headers: {}
    }

    // 文件上传进度
    fileTransfer.onProgress(ProgressEvent => {

    })

    // 上传文件到服务器
    fileTransfer.upload(imagePath, url, options).then((data) => {

    }, (err) => {
      this.noticeSer.showToast('WARN: 图片未上传到服务器.')
    })
  }

  // 确认者确认
  userConfirmed(type: string) {
    if (type == '1') {
      this.data.confirmPerson1 = this.confirmPerson1.userNick
      this.data.confirmPersonId1 = this.confirmPerson1.userId
    }
    if (type == '2') {
      this.data.confirmPerson = this.confirmPerson.userNick
      this.data.confirmPersonId = this.confirmPerson.userId
    }

    if (this.data.confirmPerson1 && this.data.confirmPerson) {
      this.data.recordStatus = "已完成"
      this.userService.completeTaskProgress("mm-form-c7-00-226", this.data.id, false)
    }
    this.sql.saveRecord(this.tableName, this.data)
  }

}
