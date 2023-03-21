import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { CargoException } from './models/cargo.exception';

@Catch(CargoException)
export class CargoExceptionFilter implements ExceptionFilter {
  catch(exception: CargoException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const body = {
      code: exception.code,
      message: exception.message,
      info: exception.info,
    };

    response.status(exception.getStatus()).json(body);
  }
}
