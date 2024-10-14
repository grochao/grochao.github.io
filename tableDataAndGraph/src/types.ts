
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