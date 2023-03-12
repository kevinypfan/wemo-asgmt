export interface IReturnCode {
  code: string;
  message: string;
  status: number;
}

export interface ICargoReturnCode {
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
  SUCCESS: { code: '0000', message: 'Success', status: 200 },
  USER_EXIEST: { code: '1001', message: 'User Exist', status: 400 },
  BAD_CREDENTIALS: { code: '1002', message: 'Bad Credentials', status: 401 },
  UNAUTHORIZED: {
    code: '1003',
    message: 'Unauthorized',
    status: 401,
  },
  NOT_FOUND: { code: '1404', message: 'Not Found', status: 404 },
  UNKNOWN_ERROR: { code: '9999', message: 'Unknown Error', status: 500 },
};
