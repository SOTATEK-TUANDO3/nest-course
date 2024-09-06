import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/common.enum';

export const REQUEST_ACCESS_USER_TYPE = 'request_access_user_type';
export const AllowAccess = (...types: Roles[]) => SetMetadata(REQUEST_ACCESS_USER_TYPE, types);
