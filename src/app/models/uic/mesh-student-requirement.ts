import { MeshStudent } from '../app/mesh-student';
import { Requirement } from './requirement';
export interface MeshStudentRequirement {
    id?: number,
    mesh_student?: MeshStudent,
    requirement?: Requirement,
    observations?: string[],
    is_approved?: boolean
}