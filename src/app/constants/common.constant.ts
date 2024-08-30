import 'dotenv/config';
import { OrderBy } from '../enums/common.enum';

export const constants = {
  PAGINATION: {
    PAGE_DEFAULT: 1,
    LIMIT_DEFAULT: 10,
    SORT_BY_DEFAULT: 'id',
    ORDER_BY_DEFAULT: OrderBy.DESC,
  },
  ERROR_CODE: {
    FIRST_CHANGE_PASSWORD: 4031,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 64,
  },
  TENANT_HEADER: 'x-tenant-id',
  LIMIT_FILE: {
    SIZE: 500 * 1024 * 1024,
    TYPE: /\.(docx|doc|odt|rdt|rtf|epub|pptx|ppt|txt|odp|xlsx|csv|tsv|ods|xlsm|xlsb|xltx|png|jpg|pdf|jpeg|webp|svg|gif|avif|apng)$/,
  },
  WEBSOCKET: {
    EVENT: {
      GET_PROJECT_APPROVE_STATUS: 'project_approve_status',
      NEW_PROJECT_PERCENT: 'new_project_percent',
      CHANGE_PASSWORD: 'change_password',
      LOG_OUT: 'log_out',
      NOTIFICATION: 'notification',
      UPDATE_SYSTEM_ROLE: 'update_system_role',
      DELETED_USER: 'deleted_user',
    },
    ROOM_NAME: {
      TENANT_PREFIX: 'tenant_room_',
      USER_PREFIX: 'user_room',
    },
    ADMIN_CLIENT: 0,
  },
  REQUEST_AUTH_USER_ID: 'authUserId',
  APP_ENVIRONMENT: {
    LOCAL: 'local',
    DEVELOPMENT: 'dev',
    STAGING: 'staging',
    PRODUCTION: 'prod',
    DEMO: 'demo',
  },
  MAX_PRICE_COURSE: 500,
  INJECT_TOKEN: {
    AUTH_USER_ID: 'AUTH_USER_ID',
  },
  SOTATEK_DOMAIN: 'sotatek.com',
  USER_PUBLIC_INFO: ['user.id', 'user.email', 'user.displayName', 'user.picture'],
};
