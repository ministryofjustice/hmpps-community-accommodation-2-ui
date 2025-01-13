/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Assessment } from './Assessment';
import type { TemporaryAccommodationApplication } from './TemporaryAccommodationApplication';
import type { TemporaryAccommodationAssessmentStatus } from './TemporaryAccommodationAssessmentStatus';
import type { TemporaryAccommodationUser } from './TemporaryAccommodationUser';
import type { Unit } from './Unit';
export type TemporaryAccommodationAssessment = (Assessment & {
    application: TemporaryAccommodationApplication;
    allocatedToStaffMember?: TemporaryAccommodationUser;
    status?: TemporaryAccommodationAssessmentStatus;
    summaryData: Unit;
    releaseDate?: string;
    accommodationRequiredFromDate?: string;
});

