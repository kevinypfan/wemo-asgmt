import { HttpException } from '@nestjs/common';
import { IReturnCode } from './cargo.model';

export class CargoException extends HttpException {
  constructor(returnCode: IReturnCode, info = null) {
    super(returnCode.message, returnCode.status);

    // assign the error class name in your custom error (as a shortcut)
    // this.name = this.constructor.name;

    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    this.code = returnCode.code;
    this.message = returnCode.message;
    this.info = info;
  }

  code: string;

  message: string;

  info?: any;
}
