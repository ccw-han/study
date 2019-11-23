import { TranslateService } from '@ngx-translate/core';
import { BaseAppComponent } from '../base-app';
import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { NativeProvider } from '../../providers/native/native';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ActionSheetController, LoadingController } from 'ionic-angular';
import { UserService } from '../../providers/user/user-service';
import moment from 'moment';
import { UserInfo } from '../../model/user-info';
import { CodeService } from '../../providers/user/code-service';
import { TaskProcessInfo } from '../../model/task-detail';
import { MmFormC700122, MmFormC700122Index } from "../../model/mm-form-c7-00-122";
import { UUID } from "angular2-uuid";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Camera } from "@ionic-native/camera";
import { ToastProvider } from "../../providers/toast/toast";
import { AppSettings } from "../../app/app.settings";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { PhotoLibrary, GetThumbnailOptions } from '@ionic-native/photo-library';

@IonicPage()
@Component({
  selector: 'mm-form-c7-00-122',
  templateUrl: 'mm-form-c7-00-122.html'
})
export class MmFormC700122Component extends BaseAppComponent implements OnInit {
  pData: MmFormC700122Index = new MmFormC700122Index();
  datas: Array<MmFormC700122>;
  data: MmFormC700122 = new MmFormC700122();
  pId: string;
  checkPerson: UserInfo;
  printer1: UserInfo;
  printer2: UserInfo;
  confirmPerson: UserInfo;
  confirmPerson2: UserInfo;
  tableName: string = "mm_form_c7_00_122";
  pTableName: string = "mm_form_c7_00_122_index";
  formCode = "mm-form-c7-00-122";
  tableCode = "mm-form-c7-00-122";
  version: number = 0;
  flag: boolean = true;
  loading: any

  //canvas
  private drawShow: string = 'hide' // 控制显示canvas画布
  private myCanvas: any // canvas
  private ctx: any // ctx
  private color: string = 'red' // canvas色彩
  private rate: number = 1 // 图片缩放比例
  private currAttr: string // 图片路径（pad）
  private currAttrId: string // 图片ID

  constructor(public nav: NavController,
    public translate: TranslateService,
    public navParams: NavParams,
    private nativeProvider: NativeProvider,
    public codeService: CodeService,
    public modalCtrl: ModalController,
    private photoViewer: PhotoViewer,
    public actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    public camera: Camera,
    public noticeSer: ToastProvider,
    private userService: UserService,
    private alertCtrl: AlertController,
    private el: ElementRef,
    private renderer2: Renderer2,
    public loadingCtrl: LoadingController,
    private photoLibrary: PhotoLibrary) {
    super(nav, translate);

    //初始化一些值
    this.pId = navParams.get("id")
    if (this.pId) {
      this.nativeProvider.selectOne(this.pTableName, null, "id ='" + this.pId + "'").subscribe(data => {
        this.pData = data
        if (this.pData.recordStatus == "已完成") {
          this.flag = false
        }
      })
    } else {
      this.pData.checkPerson = this.userService.loginUser.userNick
      this.pData.checkPersonId = this.userService.loginUser.userId
      this.pData.checkDate = moment().format('YYYY-MM-DD')
      this.pData.lineSn = this.userService.loginLine
      this.data.date = moment().format('YYYY-MM-DD')
    }
  }

  ngOnInit() {
    this.nativeProvider.selectRecord(this.tableName, null, "pid='" + this.pId + "'", null).subscribe((datas) => {
      this.datas = []
      if (datas.length) {
        for (let index = 0; index < datas.length; index++) {
          if (datas.item(index).recordStatus == '已完成') { // 已完成的数据展示
            this.datas.push(datas.item(index))
          } else { // 未完成的数据显示到编辑栏
            this.data = datas.item(index)
            if (this.data.printer1) {
              this.printer1 = new UserInfo()
              this.printer1.userNick = this.data.printer1
            }
            if (this.data.printer2) {
              this.printer2 = new UserInfo()
              this.printer2.userNick = this.data.printer2
            }
            if (this.data.confirmPerson) {
              this.confirmPerson = new UserInfo()
              this.confirmPerson.userNick = this.data.confirmPerson
            }
            if (this.data.confirmPerson2) {
              this.confirmPerson2 = new UserInfo()
              this.confirmPerson2.userNick = this.data.confirmPerson2
            }
          }
        }
      } else {
        this.data = new MmFormC700122()
        this.data.date = moment().format('YYYY-MM-DD')
        this.data.time = moment().format('HH:mm')
      }
    })
  }

  saveRecord() { // 父表新建数据
    let startTask = false
    if (!this.pData.id) { //在创建表的时候
      startTask = true
    }
    this.nativeProvider.saveRecord(this.pTableName, this.pData)
    if (startTask) { //在新建表之后就新建在处理记录
      let taskInfo: TaskProcessInfo = new TaskProcessInfo()
      taskInfo.checkDate = this.pData.checkDate
      taskInfo.code = "mm-form-c7-00-122"
      taskInfo.name = "其它类型——CAUTION LABEL打印记录表"
      taskInfo.pageName = 'MmFormC700122Component'
      taskInfo.keyName = 'id'
      taskInfo.keyValue = this.pData.id
      taskInfo.version = this.version
      this.userService.addNewTaskProgress(taskInfo)
    }
  }

  saveColData() { // 保存行数据
    this.data.pid = this.pData.id
    this.nativeProvider.saveRecord(this.tableName, this.data)
  }

  saveData() { // 保存之前的数据, 并新增一行数据
    this.data.pid = this.pData.id
    this.data.recordStatus = '已完成'
    this.nativeProvider.saveRecord(this.tableName, this.data).subscribe((res) => {
      if (!this.datas) {
        this.datas = []
      }
      this.datas.unshift(this.data)
      this.data = new MmFormC700122()
      this.data.date = moment().format('YYYY-MM-DD')
      this.data.time = moment().format('HH:mm')
      this.printer1 = new UserInfo()
      this.printer2 = new UserInfo()
      this.confirmPerson = new UserInfo()
      this.confirmPerson2 = new UserInfo()
    })
  }

  inputCom() { // 确认完成
    let alert = this.alertCtrl.create({
      title: '警告',
      message: '确认点检完成吗？',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.pData.recordStatus = '已完成'
            this.pData.confirmResult = 'Y'
            this.userService.completeTaskProgress("mm-form-c7-00-122", this.pData.id, false)
            this.nativeProvider.saveRecord(this.pTableName, this.pData)
            this.flag = false
          }
        }
      ]
    })
    alert.present()
  }

  viewImage(pic: string) {
    this.photoViewer.show(pic, "预览", { share: false })
  }

  editImage(pic: string, attr: string, attrId: string) {
    this.loadCanvasImage(pic)
    this.currAttr = attr
    this.currAttrId = attrId
  }

  getPicture(attr: string, attrId: string) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '请选择',
      buttons: [
        {
          text: '拍照',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, attr, attrId)
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    })
    actionSheet.present()
  }

  takePicture(sourceType, attr: string, attrId: string) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI
    }

    this.camera.getPicture(options).then((imagePath) => {
      this.loadCanvasImage(imagePath)
      this.currAttr = attr
      this.currAttrId = attrId
    }, (err) => {
      this.noticeSer.showToast('ERROR: 获取图片错误.')
    })
  }

  uploadImage(attr: string, attrId: string) {
    let imagePath = this.data[attr]
    let url = AppSettings.API_ENDPOINT + '/r/fileTransfer/upload'
    this.data[attrId] = UUID.UUID().toString()
    const fileTransfer: FileTransferObject = this.transfer.create()

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'file.png',
      mimeType: 'image/png',
      params: { 'ticketPicId': this.data[attrId] },
      headers: {}
    }

    // 文件上传进度
    this.loading = this.loadingCtrl.create({
      content: '文件上传中',
      dismissOnPageChange: false
    })
    this.loading.present()
    let schedule: number = 0
    fileTransfer.onProgress(ProgressEvent => {
      schedule = ProgressEvent.loaded / ProgressEvent.total * 100
    })
    let timer = setInterval(() => {
      if (schedule >= 99) {
        this.loading.dismiss()
        clearInterval(timer)
      }
    })

    // 上传文件到服务器
    fileTransfer.upload(imagePath, url, options).then(data => {
      if (data.responseCode != 200) {
        this.noticeSer.showToast('WARN: 图片未上传到服务器.')
      }
    }, err => {
      this.noticeSer.showToast('WARN: 图片未上传到服务器.')
    })
    this.saveColData()
  }

  deleteData(id: string) {
    let alert = this.alertCtrl.create({
      title: '警告',
      message: '确认删除该条记录吗？',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.nativeProvider.deleteRecord(this.tableName, id, "").subscribe(() => {
              for (let index = 0; index < this.datas.length; index++) {
                if (id === this.datas[index].id) {
                  this.datas.splice(index, 1)
                }
              }
            })
          }
        }
      ]
    })
    alert.present()
  }

  loadCanvasImage(path) {
    this.drawShow = "show"
    let image = new Image()
    image.src = path
    image.crossOrigin = "Anonymous"
    image.onload = () => {
      this.myCanvas = this.el.nativeElement.querySelector('#myCanvas')
      let screenWidth = window.screen.width
      let screenHeight = window.screen.height - 50 // 50px的操作区域 
      let imageWidth = image.width
      let imageHeight = image.height
      this.myCanvas.width = screenWidth
      this.myCanvas.height = screenHeight

      // 图片宽或高超过屏幕
      this.rate = 1
      if (screenWidth < imageWidth || screenHeight < imageHeight) {
        let rateWidth = screenWidth / imageWidth
        let rateHeight = screenHeight / imageHeight
        this.rate = (rateWidth > rateHeight ? rateHeight : rateWidth)
        this.myCanvas.width = imageWidth * this.rate
        this.myCanvas.height = imageHeight * this.rate
      } else {
        this.myCanvas.width = imageWidth
        this.myCanvas.height = imageHeight
      }

      // 图片位置处理，让图片上下居中显示
      this.myCanvas.style.marginTop = (screenHeight - this.myCanvas.height) / 2 + "px"

      // canvas生成图片
      this.ctx = this.myCanvas.getContext("2d")
      this.ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height)
      this.ctx.translate(this.myCanvas.width / 2 - imageWidth / 2 * this.rate, this.myCanvas.height / 2 - imageHeight / 2 * this.rate)
      this.ctx.scale(this.rate, this.rate)
      this.ctx.drawImage(image, 0, 0)
    }
  }

  canvasDrawStart($event) {
    let beginX = Number($event.touches[0].pageX) / this.rate - Number($event.srcElement.offsetLeft) / this.rate
    let beginY = Number($event.touches[0].pageY) / this.rate - Number($event.srcElement.offsetTop)
    this.ctx.strokeStyle = this.color
    this.ctx.beginPath()
    this.ctx.moveTo(beginX, beginY)
  }

  canvasDrawMove($event) {
    let toX = Number($event.touches[0].pageX) / this.rate - Number($event.srcElement.offsetLeft) / this.rate
    let toY = Number($event.touches[0].pageY) / this.rate - Number($event.srcElement.offsetTop)
    this.ctx.lineTo(toX, toY)
    this.ctx.lineWidth = 5
    this.ctx.stroke()
  }

  canvasDrawEnd() {
    this.ctx.closePath()
  }

  canvasColorSelect(color: string) {
    this.color = color
  }

  canvasDrawCancel() {
    this.drawShow = 'hide'
  }

  canvasDrawConfirm() {
    let newFileName = UUID.UUID().toString()
    this.photoLibrary.requestAuthorization({ read: true, write: true }).then(() => {
      let getThumbnailOptions: GetThumbnailOptions = {
        quality: 1
      }
      this.photoLibrary.saveImage(this.myCanvas.toDataURL("image/png", 1), newFileName, getThumbnailOptions).then(libraryItem => {
        this.data[this.currAttr] = decodeURIComponent(libraryItem.photoURL).split(';')[1]
        this.data[this.currAttrId] = newFileName
        this.uploadImage(this.currAttr, this.currAttrId)
        this.saveColData()
        this.ngOnInit()
      })
    }).catch(err => {
      this.noticeSer.showToast('ERROR: 图片处理错误.')
    })
    this.drawShow = 'hide'
  }

  userConfirmed(field: string) {
    if (field == 'printer1') {
      this.data['printer1'] = this.printer1.userNick
    }
    if (field == 'confirmPerson') {
      this.data['confirmPerson'] = this.confirmPerson.userNick
    }
    if (field == 'printer2') {
      this.data['printer2'] = this.printer2.userNick
    }
    if (field == 'confirmPerson2') {
      this.data['confirmPerson2'] = this.confirmPerson2.userNick
    }
    this.saveColData()
  }

}
