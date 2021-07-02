import { Planning } from "./planning";
import { Event as EventModel } from "./event";
export interface EventPlanning {
  id?: number;
  event_id?: number;
  planning_id?: number;
  start_date?: Date;
  end_date?: Date;
  observations?: string[];
  event?: EventModel;
  planning?: Planning;
}
