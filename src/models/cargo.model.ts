interface IReturnCode {
  code: string;
  message: string;
}

interface ICargoReturnCode {
  [key: string]: IReturnCode;
}

export class Cargo<T = any> {
  constructor(info, returnCode?: IReturnCode) {
    if (!returnCode) returnCode = CargoReturenCode.SUCCESS;
    this.code = returnCode.code;
    this.message = returnCode.message;
    this.info = info;
  }

  code: string;
  message: string;
  info: T;
}

export const CargoReturenCode: ICargoReturnCode = {
  SUCCESS: { code: '0000', message: 'Success' },
  USER_EXIEST: { code: '1001', message: 'User Exist' },
  BAD_CREDENTIALS: { code: '1002', message: 'Bad Credentials' },
};
