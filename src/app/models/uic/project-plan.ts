export interface ProjectPlan {
    id?: number,
    title?: string,
    description?: string,
    act_code?: string,
    approval_date?: Date,
    is_approved?: boolean,
    observations?: string[]
}