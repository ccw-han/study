import { TranslateService } from '@ngx-translate/core';
import { BaseAppComponent } from './../base-app';
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { NativeProvider } from '../../providers/native/native';
import { UserService } from '../../providers/user/user-service';
import { UserInfo } from '../../model/user-info';
import { MmForm0000226 } from '../../model/mm-form-00-00-226';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { ToastProvider } from '../../providers/toast/toast';
import { CodeModel } from "./../../model/base-model";
import { CodeService } from "../../providers/user/code-service";
import * as moment from 'moment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { TaskProcessInfo } from '../../model/task-detail';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppSettings } from '../../app/app.settings'
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'mm-form-00-00-226',
  templateUrl: 'mm-form-00-00-226.html',
})
export class MmForm0000226Component extends BaseAppComponent {
  tableName: string = "mm_form_00_00_226"
  data: MmForm0000226 = new MmForm0000226()
  confirmPerson: UserInfo
  classCodes: CodeModel[]
  shiftCodes: CodeModel[]
  ticketCodes: CodeModel[]
  codeListType: Array<any>
  codeList: Array<any>
  constructor(
    public nav: NavController,
    public translate: TranslateService,
    public navParams: NavParams,
    public nativeProvider: NativeProvider,
    public userService: UserService,
    public imagePicker: ImagePicker,
    public camera: Camera,
    public noticeSer: ToastProvider,
    public actionSheetCtrl: ActionSheetController,
    public codeService: CodeService,
    private photoViewer: PhotoViewer,
    private zBar: ZBar,
    private transfer: FileTransfer,
    private file: File,
  ) {
    super(nav, translate)
    this.data.id = navParams.get('id')
  }

  ngOnInit() {
    if (this.data.id) {
      this.nativeProvider.selectOne(this.tableName, null, "id='" + this.data.id + "'").subscribe((data) => {
        this.data = data
        if (this.data.confirmPerson) {
          this.confirmPerson = new UserInfo()
          this.confirmPerson.userId = this.data.confirmPersonId
          this.confirmPerson.userNick = this.data.confirmPerson
        }

        // TODO:图片处理

      })
    } else {
      this.data.lineSn = this.userService.loginLine
      this.data.checkDate = moment().format('YYYY-MM-DD')
    }

    // 获取班次
    this.codeService.getCodeByTypeFromDb("class_code").subscribe((data) => {
      this.classCodes = data
    });

    // 获取排班
    this.codeService.getCodeByTypeFromDb("shift_code").subscribe((data) => {
      this.shiftCodes = data
    });

    // 获取品种
    this.codeService.getCodeByTypeFromDb("c7_category").subscribe(data => {
      this.codeListType = data
      for (let index = 0; index < this.codeListType.length; index++) {
        this.codeService.getCodeByTypeFromDb(this.codeListType[index].code).subscribe((rows) => {
          if (rows.length) {
            var smallClass = ''
            for (let i = 0; i < rows.length; i++) {
              if (i == 0) {
                smallClass += rows[i]['name']
              } else {
                smallClass += ',' + rows[i]['name']
              }
            }
            this.codeListType[index]['name'] = this.codeListType[index]['name'] + '[' + smallClass + ']'
          }
        })
      }
      this.codeList = this.codeListType
    })
  }

  saveRecord() {
    let startTask = false
    if (!this.data.id) {
      startTask = true
    }
    this.nativeProvider.saveRecord(this.tableName, this.data)
    if (startTask) {
      let taskInfo: TaskProcessInfo = new TaskProcessInfo()
      taskInfo.checkDate = this.data.checkDate
      taskInfo.code = "mm-form-00-00-226"
      taskInfo.name = "PRP使用对照表 -NQ"
      taskInfo.pageName = 'MmForm0000226Component'
      taskInfo.keyName = 'id'
      taskInfo.keyValue = this.data.id
      this.userService.addNewTaskProgress(taskInfo)
    }
  }

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

  takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI
    }

    this.camera.getPicture(options).then((imagePath) => {
      this.data.ticketPic = imagePath
      this.uploadImage()
      this.saveRecord()
    }, (err) => {
      this.noticeSer.showToast('ERROR: 获取图片错误.')
    })
  }

  viewImage() {
    this.photoViewer.show(this.data.ticketPic, "预览", { share: false })
  }

  scanner(type: string) {
    let options: ZBarOptions = {
      text_title: '扫描中',
      text_instructions: '请把相机对准条形码',
      flash: 'on',
      drawSight: true
    }

    this.zBar.scan(options).then(result => {
      if (result.length == 9){
        result = result.substring(1)
      }
      if (result.length == 8) {
        let zbarDatas = result.split('')
        for (let index = 0; index < zbarDatas.length; index++) {
          this.data[type + (index + 1)] = zbarDatas[index]
        }
        if (this.data.ticket1 && this.data.aluminum1 && this.data.plastic1) {
          let ticketStr = '', aluminumStr = '', plasticStr = ''
          for (let index = 1; index < 9; index++) {
            ticketStr += this.data['ticket' + index]
            aluminumStr += this.data['aluminum' + index]
            plasticStr += this.data['plastic' + index]
          }
          if (ticketStr != aluminumStr || aluminumStr != plasticStr) {
            this.data.nqJudges = 'NG'
          } else {
            this.data.nqJudges = 'OK'
          }
        }
      }
      this.saveRecord()
    }).catch(error => {
      this.noticeSer.showToast('ERROR: 条码解析错误.')
    })
  }

  uploadImage() {
    let imagePath = this.data.ticketPic
    let url = AppSettings.API_ENDPOINT + '/r/fileTransfer/upload'
    this.data.ticketPicId = UUID.UUID().toString()
    const fileTransfer: FileTransferObject = this.transfer.create()
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file.png',
      mimeType: 'image/png',
      params: { 'ticketPicId': this.data.ticketPicId },
      headers: {}
    }

    fileTransfer.onProgress(ProgressEvent => {

    })

    fileTransfer.upload(imagePath, url, options).then(res => {
      if (res.responseCode != 200) {
        this.noticeSer.showToast('ERROR: 图片未上传到服务器.')
      }
    }, (err) => {
      this.noticeSer.showToast('ERROR: 图片未上传到服务器.')
    })
  }

  userConfirmed() {
    if (this.data.id) {
      this.data.confirmPerson = this.confirmPerson.userNick
      this.data.confirmPersonId = this.confirmPerson.username
      this.data.recordStatus = "已完成"
      this.userService.completeTaskProgress("mm-form-00-00-226", this.data.id, false)
      this.nativeProvider.saveRecord(this.tableName, this.data)
    }
  }
}
