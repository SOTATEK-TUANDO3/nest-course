import { HttpException } from '@nestjs/common';
import { constants } from 'src/app/constants/common.constant';
import { SelectQueryBuilder } from 'typeorm';

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

  async customPaginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number = constants.PAGINATION.PAGE_DEFAULT,
    limit: number = constants.PAGINATION.LIMIT_DEFAULT,
  ) {
    page = +page;
    limit = +limit;
    const start = (page - 1) * limit;
    const result = await queryBuilder.skip(start).take(limit).getManyAndCount();
    const items = result[0];
    const totalItems = result[1];
    const totalPage = limit > 0 ? Math.ceil(totalItems / limit) : 1;

    return {
      items: items,
      meta: {
        totalItems: totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: totalPage,
        currentPage: page,
      },
    };
  }

  searchCaseInsensitive(searchField: string): string {
    return `LOWER(REPLACE(${searchField}, ' ', '')) LIKE LOWER(REPLACE(:keyword, ' ', ''))`;
  }
}
