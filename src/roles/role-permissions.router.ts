import express from 'express';
import { can } from './middleware/can.middleware';
import { updateRolePermissions } from './roles.controller';

export const rolePermissionsRouter = express.Router({
  mergeParams: true,
});

rolePermissionsRouter.put('/', can('update', 'Role'), updateRolePermissions);
