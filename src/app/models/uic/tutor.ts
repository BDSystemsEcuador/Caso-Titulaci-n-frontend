import { Catalogue } from '../app/catalogue';
import { Teacher } from './../app/teacher';
import { ProjectPlan } from './project-plan';
export interface Tutor {
    id?: number;
    project_plan?: ProjectPlan,
    teacher?: Teacher,
    type?: Catalogue,
    observations?: string[],

}