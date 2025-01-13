/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cas2Assessment } from './Cas2Assessment';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { NomisUser } from './NomisUser';
import type { Person } from './Person';
import type { Unit } from './Unit';
export type Cas2SubmittedApplication = {
    id: string;
    person: Person;
    createdAt: string;
    submittedBy?: NomisUser;
    schemaVersion: string;
    outdatedSchema: boolean;
    document?: Unit;
    submittedAt?: string;
    telephoneNumber?: string;
    timelineEvents: Array<Cas2TimelineEvent>;
    assessment: Cas2Assessment;
};

