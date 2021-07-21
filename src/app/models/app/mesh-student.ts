import { MeshStudentRequirement } from './../uic/mesh-student-requirement';
import { Student } from './student';
export interface MeshStudent {
    id?: number;
    student?: Student,
    mesh?: any,
    start_cohort?: Date,
    end_cohort?: Date,
    is_graduated?: boolean,
    mesh_student_requirements?: Array<MeshStudentRequirement>;
}