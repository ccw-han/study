export class DataType {
  constructor(public formCode: string, public inputFieldName: string,
              public ifReadonly: string, public checkProject: string,
              public modelData: string, public ngModel: string,
              public dependOnFieldName: string, public resultFieldName: string,
              public showSkip: boolean) {
  }
}

export class DemoResult {
  id: string;
  idx: string;
  checkField1: string;
  checkValue1: string;
  checkField2: string;
  checkValue2: string;
  pId: string;
}

export class DemoIndex {
  id: string;
  lineSn: string;
  checkDate: string;
  checkPerson: string;
  checkPersonId: string;
  confirmPerson: string;
  confirmPersonId: string;
  recordStatus: string;
  syncStatus: string;
  confirmResult: string;
  headSign: string;
  tableName: string;
  version: string;
  remark: string;
}
