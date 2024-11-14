export type CLS_GeneratorHTML_structure_columns = {
    role: string;
    indexPosition: number;
    colPosition: number;
    title: string;
    name_id: string;
    indexValue: number;
};
declare class CLS_GeneratorHTML {
    CreateTable(id?: string): HTMLElement;
    private return_cell;
    private returnRowTR;
    CreateTableBody(_datas_?: any): HTMLTableSectionElement;
    CreateTableHead(_datas_: any, show_allColumns_headers?: boolean): HTMLTableSectionElement;
}
export declare const Visual_GeneratorHTML: CLS_GeneratorHTML;
export {};
