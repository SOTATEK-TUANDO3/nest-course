import { Roles as Roles } from '../app/enums/common.enum';

export const roles = [
  {
    name: 'Admin',
    code: Roles.ADMIN,
    description: 'Admin to manage the site',
  },
  {
    name: 'Customer',
    code: Roles.CUSTOMER,
    description: 'Customer to buy product',
  },
];
