import { Permission } from './role.types';

export interface CurrentUser {
  id: string;
  name: string;
  anonymous: boolean;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  displayName?: string;
}
