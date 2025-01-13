/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PlacementDates } from './PlacementDates';
import type { PlacementType } from './PlacementType';
import type { Unit } from './Unit';
export type SubmitPlacementApplication = {
    translatedDocument: Unit;
    placementType: PlacementType;
    placementDates: Array<PlacementDates>;
};

