import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';

@Catch(UnauthorizedException, BadRequestException)
export class UnauthorizedExceptionFilter<T extends UnauthorizedException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = 401;

    if (exception instanceof BadRequestException) status = 400;

    return response.status(status).json(exception.getResponse());
  }
}
