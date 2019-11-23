import {
  Component,
  ComponentFactoryResolver,
  ComponentRef, EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AdComponent} from './ad.component';
import {AdDirective} from './ad.directive';
import {AdItem} from './ad-item';

@Component({
  selector: 'hero-tr',
  template: `
    <ng-template ad-host></ng-template>
  `
})
export class HeroProfileComponent implements AdComponent, OnInit {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  @ViewChild(AdDirective) adHost: AdDirective;
  public formComponentRef: ComponentRef<any>; // 通过formContainer调用相关api创建出来的组件容器
  public formContainerRef: ViewContainerRef;//用来创建等对组件进行相关操作的
  @ViewChild('table') table: TemplateRef<any>;
  @ViewChild('checkItem') checkItem: TemplateRef<any>;
  //@Input() data: AdItem[];
  @Input() data: AdItem;
  @Input() value: any;
  @Output() dataExport: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    if (this.data) {
      this.loadComponent();
    }
  }

  loadComponent() {
    let adItem = this.data;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
    this.formContainerRef = this.adHost.viewContainerRef;
    this.formContainerRef.clear();
    this.formComponentRef = this.formContainerRef.createComponent(componentFactory);
    this.formComponentRef.instance.data = adItem.data;
    this.formComponentRef.instance.value = this.value;
  }

  eventHandlerH(event: any) {
  }

}


