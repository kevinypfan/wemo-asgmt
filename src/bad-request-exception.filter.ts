import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CargoException } from './models/cargo.exception';
import { CargoReturnCode } from './models/cargo.model';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    let cargoException = new CargoException(CargoReturnCode.UNKNOWN_ERROR);

    const badRequestException: any = exception.getResponse().valueOf();

    if (typeof badRequestException === 'string') {
      cargoException = new CargoException(
        CargoReturnCode.BAD_REQUEST,
        badRequestException,
      );
    } else {
      cargoException = new CargoException(
        CargoReturnCode.BAD_REQUEST,
        badRequestException.message,
      );
    }

    const body = {
      code: cargoException.code,
      message: cargoException.message,
      info: cargoException.info,
    };

    // if (response && typeof response === 'object' && 'status' in response) {
    //   return response.status(status).json(cargoException);
    // }
    response.status(status).json(body);
  }
}
