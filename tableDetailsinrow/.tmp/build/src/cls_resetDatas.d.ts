type CLS_resetData_structure_columns = {
    role: string;
    indexPosition: number;
    title: string;
    name_id: string;
};
type CLS_resetData_return = {
    HeadersColumns: CLS_resetData_structure_columns;
    ValuesColumn: CLS_resetData_structure_columns;
    ValuesRows: any;
};
declare class CLS_resetData {
    ReturnDataJson(_data_: any): CLS_resetData_return;
    private sort_data;
}
export declare const Visual_CLS_resetData: CLS_resetData;
export {};
