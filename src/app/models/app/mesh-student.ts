import { Student } from './student';
export interface MeshStudent {
    id?: number;
    student?: Student,
    mesh?: any,
    start_cohort?: Date,
    end_cohort?: Date,
    is_graduated?: boolean
}