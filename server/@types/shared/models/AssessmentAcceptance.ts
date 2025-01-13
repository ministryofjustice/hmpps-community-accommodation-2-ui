/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApType } from './ApType';
import type { PlacementDates } from './PlacementDates';
import type { PlacementRequirements } from './PlacementRequirements';
import type { Unit } from './Unit';
export type AssessmentAcceptance = {
    document: Unit;
    requirements?: PlacementRequirements;
    placementDates?: PlacementDates;
    apType?: ApType;
    notes?: string;
};

