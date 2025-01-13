/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Application } from './Application';
import type { ApplicationStatus } from './ApplicationStatus';
import type { Cas2Assessment } from './Cas2Assessment';
import type { Cas2TimelineEvent } from './Cas2TimelineEvent';
import type { NomisUser } from './NomisUser';
import type { Unit } from './Unit';
export type Cas2Application = (Application & {
    createdBy: NomisUser;
    schemaVersion: string;
    outdatedSchema: boolean;
    data?: Unit;
    document?: Unit;
    status: ApplicationStatus;
    submittedAt?: string;
    telephoneNumber?: string;
    assessment?: Cas2Assessment;
    timelineEvents?: Array<Cas2TimelineEvent>;
});

