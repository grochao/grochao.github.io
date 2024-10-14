import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import { VisualCustomSettingsType } from "./settings";
export declare class Visual implements IVisual {
    static target: HTMLElement;
    private updateCount;
    private textNode;
    private AllColumnNames;
    private executeUpdate;
    private table;
    private formattingSettings;
    private formattingSettingsService;
    private dataView;
    static _id_event_click_global_: string;
    static GrandTotal: {
        TotalIncome: import("./data").ANS_DataTypeJsonStructure;
        TotalExpenses: import("./data").ANS_DataTypeJsonStructure;
        TotalProfit: import("./data").ANS_DataTypeJsonStructure;
        TotalRevenues: import("./data").ANS_DataTypeJsonStructure;
        TotalNetResultOperation: import("./data").ANS_DataTypeJsonStructure;
        ITDA_VALUE: import("./data").ANS_DataTypeJsonStructure;
        EBITDA_VALUE: import("./data").ANS_DataTypeJsonStructure;
        EBITDA_PERCENTAGE: import("./data").ANS_DataTypeJsonStructure;
    };
    static settings_obj: VisualCustomSettingsType;
    constructor(options: VisualConstructorOptions);
    static LogBOX(_VALUE_?: string, style?: string): void;
    static ReturnCell(typecel: string, TextContent: any, theClass?: string, colspan?: number): HTMLElement;
    private static checkValue;
    private static returnDate;
    private static ReplaceYTD;
    private onlyUnique;
    private returnDB_Json;
    private static isNumeric;
    private static returnFormatYTD;
    static returnStyleOutput(value: any, symbol?: any, rounded?: boolean): string;
    private static capitalizar;
    private static ReturnRowWithData;
    private static doDashes;
    private static getRandomArbitrary;
    private static returnTotalLabel;
    private static ReturnRow;
    private static InitzialiceJSON;
    private static returnJsonEBITDA_VALUE;
    private static SetDataValue;
    private static UpdateDataValues;
    private static GenerateAccountTypeTable;
    private static GetDataValues;
    InitDataTable(): void;
    update(options: VisualUpdateOptions): void;
    private static PrintFormatNumeric;
    private static formatMoney;
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property.
     */
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
