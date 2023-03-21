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
    if (!returnCode) returnCode = CargoReturnCode.SUCCESS;
    this.code = returnCode.code;
    this.message = returnCode.message;
    this.info = info;
  }

  code: string;
  message: string;
  info: T;
}

export const CargoReturnCode: ICargoReturnCode = {
  SUCCESS: { code: '0000', message: 'Success', status: 200 },
  USER_EXIEST: { code: '1001', message: 'User Exist', status: 400 },
  BAD_CREDENTIALS: { code: '1002', message: 'Bad Credentials', status: 401 },
  UNAUTHORIZED: {
    code: '1003',
    message: 'Unauthorized',
    status: 401,
  },
  FORBIDDEN: { code: '1004', message: 'Forbidden resource', status: 403 },
  SCOOTER_EXIEST: { code: '1005', message: 'Scooter Exist', status: 400 },
  BAD_REQUEST: { code: '1400', message: 'Bad Request', status: 400 },
  NOT_FOUND: { code: '1404', message: 'Not Found', status: 404 },
  USER_RENTED: { code: '2000', message: 'User Rented', status: 403 },
  SCOOTER_RENTED: { code: '2001', message: 'Scooter Rented', status: 403 },
  UNKNOWN_ERROR: { code: '9999', message: 'Unknown Error', status: 500 },
};
