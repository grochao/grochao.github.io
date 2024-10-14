export type ANS_DataTypeJsonStructure = {
    account: ANS_DataTypeValues,
    categories: ANS_DataTypeValues,
    group_account_name: ANS_DataTypeValues,
    account_name: ANS_DataTypeValues,
    PreviousYear: ANS_DataTypeValues,
    Budget: ANS_DataTypeValues,
    CurrentYear: ANS_DataTypeValues,
    difDollar: ANS_DataTypeValues,
    difPercentage: ANS_DataTypeValues,
    current_date: ANS_DataTypeValues
}
export type ANS_DataTypeJsonSimpleStructure = {

    categories: string,

    PreviousYear: number,
    Budget: number,
    CurrentYear: number,
    difDollar: number,
    difPercentage: number
}
export type ANS_DataTypeValues = {
    value: any,
    position: number
}
export class ANS_JsonDB {

    //private static _JSON_Struct_: ANS_DataTypeJsonStructure | ANS_DataTypeJsonSimpleStructure;
    constructor() {
        //ANS_JsonDB._JSON_Struct_ = ANS_JsonDB.Init_JSON_Structure();
    }
    public static get_data_cel(): ANS_DataTypeJsonStructure | ANS_DataTypeJsonSimpleStructure {
        return null;// return ANS_JsonDB._JSON_Struct_;
    }
    public static return_JSON_structure(): ANS_DataTypeJsonStructure {
        return {
            account: {
                value: "",
                position: 0
            },
            categories: {
                value: "",
                position: 0
            },
            group_account_name: {
                value: "",
                position: 0
            },
            account_name: {
                value: "",
                position: 0
            },
            PreviousYear: {
                value: "",
                position: 0
            },
            Budget: {
                value: "",
                position: 0
            },
            CurrentYear: {
                value: "",
                position: 0
            },
            difDollar: {
                value: "",
                position: 0
            },
            difPercentage: {
                value: "",
                position: 0
            },
            current_date: null
        }
    }
    public static return_JSON_simple_structure(): ANS_DataTypeJsonSimpleStructure {
        return {

            categories: "",
            PreviousYear: 0,
            Budget: 0,
            CurrentYear: 0,
            difDollar: 0,
            difPercentage: 0
        }
    }

}
//export 