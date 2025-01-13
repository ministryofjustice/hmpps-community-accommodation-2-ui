/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApArea } from './ApArea';
import type { Application } from './Application';
import type { ApprovedPremisesApplicationStatus } from './ApprovedPremisesApplicationStatus';
import type { ApType } from './ApType';
import type { AssessmentDecision } from './AssessmentDecision';
import type { Cas1ApplicationUserDetails } from './Cas1ApplicationUserDetails';
import type { Cas1CruManagementArea } from './Cas1CruManagementArea';
import type { PersonRisks } from './PersonRisks';
import type { PersonStatus } from './PersonStatus';
import type { Unit } from './Unit';
export type ApprovedPremisesApplication = (Application & {
    isWomensApplication?: boolean;
    /**
     * Use apType
     * @deprecated
     */
    isPipeApplication?: boolean;
    isEmergencyApplication?: boolean;
    /**
     * Use apType
     * @deprecated
     */
    isEsapApplication?: boolean;
    apType?: ApType;
    arrivalDate?: string;
    risks?: PersonRisks;
    createdByUserId: string;
    schemaVersion: string;
    outdatedSchema: boolean;
    data?: Unit;
    document?: Unit;
    status: ApprovedPremisesApplicationStatus;
    assessmentId?: string;
    assessmentDecision?: AssessmentDecision;
    assessmentDecisionDate?: string;
    submittedAt?: string;
    personStatusOnSubmission?: PersonStatus;
    apArea?: ApArea;
    cruManagementArea?: Cas1CruManagementArea;
    applicantUserDetails?: Cas1ApplicationUserDetails;
    /**
     * If true, caseManagerUserDetails will provide case manager details. Otherwise, applicantUserDetails can be used for case manager details
     */
    caseManagerIsNotApplicant?: boolean;
    caseManagerUserDetails?: Cas1ApplicationUserDetails;
    licenceExpiryDate?: string;
});

