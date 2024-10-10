export type ANS_DataTypeJsonStructure = {
    account: string,
    categories: string,
    group_account_name: string,
    account_name: string,
    PreviousYear: number,
    Budget: number,
    CurrentYear: number,
    difDollar: number,
    difPercentage: number,
    current_date: null
}
export class ANS_JsonDB {

    private static _SimpleStruct_: ANS_DataTypeJsonStructure;
    constructor() {
        ANS_JsonDB._SimpleStruct_ = ANS_JsonDB.Init_Simple_JSON_Structure();
    }
    public static get_data_cel(): ANS_DataTypeJsonStructure {
        return this._SimpleStruct_;
    }
    private static Init_Simple_JSON_Structure(): ANS_DataTypeJsonStructure {
        return {
            account: "",
            categories: "",
            group_account_name: "",
            account_name: "",
            PreviousYear: 0,
            Budget: 0,
            CurrentYear: 0,
            difDollar: 0,
            difPercentage: 0,
            current_date: null
        }
    }
}
//export 