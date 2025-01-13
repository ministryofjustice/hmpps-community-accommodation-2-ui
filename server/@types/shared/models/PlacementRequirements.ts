/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApType } from './ApType';
import type { Gender } from './Gender';
import type { PlacementCriteria } from './PlacementCriteria';
export type PlacementRequirements = {
    gender: Gender;
    type: ApType;
    /**
     * Postcode outcode
     */
    location: string;
    radius: number;
    essentialCriteria: Array<PlacementCriteria>;
    desirableCriteria: Array<PlacementCriteria>;
};

