import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enum.common';

export const RolesDecorator = (...args: UserRole[]) =>
  SetMetadata('roles', args);
