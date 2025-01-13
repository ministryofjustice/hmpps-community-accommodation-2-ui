/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NewPlacementApplication } from './NewPlacementApplication';
import type { PlacementApplicationType } from './PlacementApplicationType';
import type { PlacementDates } from './PlacementDates';
import type { Unit } from './Unit';
import type { WithdrawPlacementRequestReason } from './WithdrawPlacementRequestReason';
export type PlacementApplication = (NewPlacementApplication & {
    /**
     * If type is 'Additional', provides the PlacementApplication ID. If type is 'Initial' this field provides a PlacementRequest ID.
     */
    id: string;
    createdByUserId: string;
    schemaVersion: string;
    outdatedSchema?: boolean;
    createdAt: string;
    submittedAt?: string;
    /**
     * If type is 'Additional', provides the PlacementApplication ID. If type is 'Initial' this field shouldn't be used.
     */
    assessmentId: string;
    assessmentCompletedAt: string;
    applicationCompletedAt: string;
    data?: Unit;
    document?: Unit;
    canBeWithdrawn: boolean;
    isWithdrawn: boolean;
    withdrawalReason?: WithdrawPlacementRequestReason;
    type: PlacementApplicationType;
    placementDates: Array<PlacementDates>;
});

