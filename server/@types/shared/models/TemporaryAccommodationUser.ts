/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TemporaryAccommodationUserRole } from './TemporaryAccommodationUserRole';
import type { User } from './User';

export type TemporaryAccommodationUser = (User & {
    roles: Array<TemporaryAccommodationUserRole>;
});

