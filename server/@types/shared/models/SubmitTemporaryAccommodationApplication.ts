/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubmitApplication } from './SubmitApplication';
import type { Unit } from './Unit';
export type SubmitTemporaryAccommodationApplication = (SubmitApplication & {
    arrivalDate: string;
    isRegisteredSexOffender?: boolean;
    needsAccessibleProperty?: boolean;
    hasHistoryOfArson?: boolean;
    isDutyToReferSubmitted?: boolean;
    dutyToReferSubmissionDate?: string;
    dutyToReferOutcome?: string;
    isApplicationEligible?: boolean;
    eligibilityReason?: string;
    dutyToReferLocalAuthorityAreaName?: string;
    personReleaseDate?: string;
    pdu?: string;
    probationDeliveryUnitId?: string;
    isHistoryOfSexualOffence?: boolean;
    isConcerningSexualBehaviour?: boolean;
    isConcerningArsonBehaviour?: boolean;
    prisonReleaseTypes?: Array<string>;
    summaryData: Unit;
});

