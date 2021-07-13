import { Catalogue } from "../app/catalogue";
import { Planning } from "./planning";

export interface Event {
  id?: number;
  planning?: Planning;
  name?: Catalogue;
  start_date?: Date;
  end_date?: Date;
}
