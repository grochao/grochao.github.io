import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * Data Point Formatting Card
 */
declare class DataPointCardSettings extends FormattingSettingsCard {
    BackGroundColor: formattingSettings.ColorPicker;
    BackGroundColorAccount: formattingSettings.ColorPicker;
    BackGroundColorHeaders: formattingSettings.ColorPicker;
    BackGroundColorHeadersColor: formattingSettings.ColorPicker;
    LabelExpenses: formattingSettings.TextInput;
    LabelIncome: formattingSettings.TextInput;
    LabelTotalExpenses: formattingSettings.TextInput;
    LabelTotalIncome: formattingSettings.TextInput;
    LabelTotalProfit: formattingSettings.TextInput;
    LabelRevenues: formattingSettings.TextInput;
    LabelTotalRevenues: formattingSettings.TextInput;
    LabelTotalNetResultOperation: formattingSettings.TextInput;
    DecimalPlace: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
* visual settings model class
*
*/
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard: DataPointCardSettings;
    cards: DataPointCardSettings[];
}
export type VisualCustomSettingsType = {
    INCOME: {
        Label: string;
        LabelTotal: string;
    };
    EXPENSES: {
        Label: string;
        LabelTotal: string;
    };
    PROFIT: {
        Label: string;
        LabelTotal: string;
    };
    REVENUES: {
        Label: string;
        LabelTotal: string;
    };
    NETRESULTOPERATION: {
        Label: string;
        LabelTotal: string;
    };
    ValueDecimalPlaces: number;
    BackGroundColor: string;
    BackGroundColorAccount: string;
    BackGroundColorHeaders: string;
    BackGroundColorHeadersColor: string;
};
export declare class VisualCustomSettingsModel implements VisualCustomSettingsType {
    INCOME: {
        Label: string;
        LabelTotal: string;
    };
    EXPENSES: {
        Label: string;
        LabelTotal: string;
    };
    PROFIT: {
        Label: string;
        LabelTotal: string;
    };
    REVENUES: {
        Label: string;
        LabelTotal: string;
    };
    NETRESULTOPERATION: {
        Label: string;
        LabelTotal: string;
    };
    ValueDecimalPlaces: number;
    BackGroundColor: string;
    BackGroundColorAccount: string;
    BackGroundColorHeaders: string;
    BackGroundColorHeadersColor: string;
    constructor(INCOME?: {
        Label: string;
        LabelTotal: string;
    }, EXPENSES?: {
        Label: string;
        LabelTotal: string;
    }, PROFIT?: {
        Label: string;
        LabelTotal: string;
    }, REVENUES?: {
        Label: string;
        LabelTotal: string;
    }, NETRESULTOPERATION?: {
        Label: string;
        LabelTotal: string;
    }, ValueDecimalPlaces?: number, BackGroundColor?: string, BackGroundColorAccount?: string, BackGroundColorHeaders?: string, BackGroundColorHeadersColor?: string);
    getSettings(_SETTINGS_: any): VisualCustomSettingsType;
}
export {};
