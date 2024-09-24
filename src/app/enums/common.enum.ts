export enum OrderBy {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TemplateExtension {
  EXCEL = 'xlsx',
  CSV = 'csv',
}

export enum accountConfirmationType {
  RESET_PASSWORD = 'reset_password',
}

export enum Roles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum PagesConfig {
  PAGE_HOME = 'pageHome',
  PAGE_ABOUT = 'pageAbout',
  PAGE_CONTACT = 'pageContact',
  SETTING_GENERAL = 'settingGeneral',
  SETTING_PAYMENT = 'settingPayment',
  SETTING_EMAIL = 'settingEmail',
}

export enum CourseType {
  PUBLIC = 0,
  PRIVATE = 1,
}

export enum OrderStatus {
  PROCESSING = 0,
  SHIPPED = 1,
  DELIVERED = 2,
  CANCELED = 3,
}

export enum PaymentStatus {
  UN_PAID = 0,
  PAID = 1,
}
