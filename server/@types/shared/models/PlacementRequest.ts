/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApprovedPremisesUser } from './ApprovedPremisesUser';
import type { AssessmentDecision } from './AssessmentDecision';
import type { BookingSummary } from './BookingSummary';
import type { Person } from './Person';
import type { PersonRisks } from './PersonRisks';
import type { PlacementDates } from './PlacementDates';
import type { PlacementRequestRequestType } from './PlacementRequestRequestType';
import type { PlacementRequestStatus } from './PlacementRequestStatus';
import type { PlacementRequirements } from './PlacementRequirements';
import type { ReleaseTypeOption } from './ReleaseTypeOption';
import type { WithdrawPlacementRequestReason } from './WithdrawPlacementRequestReason';
export type PlacementRequest = (PlacementRequirements & PlacementDates & {
    id: string;
    person: Person;
    risks: PersonRisks;
    applicationId: string;
    assessmentId: string;
    releaseType: ReleaseTypeOption;
    status: PlacementRequestStatus;
    assessmentDecision: AssessmentDecision;
    assessmentDate: string;
    applicationDate: string;
    assessor: ApprovedPremisesUser;
    isParole: boolean;
    /**
     * Notes from the assessor for the CRU Manager
     */
    notes?: string;
    booking?: BookingSummary;
    requestType?: PlacementRequestRequestType;
    isWithdrawn: boolean;
    withdrawalReason?: WithdrawPlacementRequestReason;
});

