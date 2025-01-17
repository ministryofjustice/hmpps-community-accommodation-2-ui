/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BedSearchResultBedSummary } from './BedSearchResultBedSummary';
import type { BedSearchResultPremisesSummary } from './BedSearchResultPremisesSummary';
import type { BedSearchResultRoomSummary } from './BedSearchResultRoomSummary';
import type { TemporaryAccommodationBedSearchResultOverlap } from './TemporaryAccommodationBedSearchResultOverlap';
export type TemporaryAccommodationBedSearchResult = {
    premises: BedSearchResultPremisesSummary;
    room: BedSearchResultRoomSummary;
    bed: BedSearchResultBedSummary;
    overlaps: Array<TemporaryAccommodationBedSearchResultOverlap>;
};

