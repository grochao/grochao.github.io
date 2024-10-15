import { ANS_DataTypeJsonStructure, ANS_DataTypeJsonSimpleStructure } from "./types";
export declare class ANS_JsonDB {
    constructor();
    static get_data_cel(): ANS_DataTypeJsonStructure | ANS_DataTypeJsonSimpleStructure;
    static return_JSON_structure(): ANS_DataTypeJsonStructure;
    static return_JSON_simple_structure(): ANS_DataTypeJsonSimpleStructure;
}
