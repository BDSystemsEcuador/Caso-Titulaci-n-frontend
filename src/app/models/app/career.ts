import {Catalogue, Institution} from './models.index';

export interface Career {
    id?: number;
    institution?: Institution;
    modality?: Catalogue;
    type?: Catalogue;
    code?: string;
    name?: string;
    description?: string;
    short_name?: string;
    resolution_number?: string;
    title?: string;
    acronym?: string;
    logo?: string;
    learning_results?: string;
}
