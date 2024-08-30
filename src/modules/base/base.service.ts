import { HttpException } from '@nestjs/common';

export class BaseService {
  responseOk(data: any = undefined, msg: string = null): any {
    let response = {
      statusCode: 200,
      message: msg,
      data: data,
    };
    if (!data) {
      delete response.data;
    }
    if (!msg) {
      delete response.message;
    }
    if (data?.statusCode && !data?.data) {
      response = data;
    }
    return response;
  }

  reponseErr(code: number = 500, msg: string = 'Internal Server Error', data: any) {
    const res = {
      statusCode: code,
      message: msg,
    };
    if (data) {
      res['data'] = data;
    }
    throw new HttpException(res, code);
  }
}
