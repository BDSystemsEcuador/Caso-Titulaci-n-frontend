import { Career } from './../app/career';
export interface Requirement {
    id?: number,
    name?: string,
    is_required?: boolean,
    career?: Career,
    is_solicitable?: boolean
}