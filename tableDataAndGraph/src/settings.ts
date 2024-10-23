/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {


    BackGroundColor = new formattingSettings.ColorPicker({
        name: "BackGroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" }
    });

    BackGroundColorAccount = new formattingSettings.ColorPicker({
        name: "BackGroundColorAccount",
        displayName: "Background Color Type Account",
        value: { value: "#FFFFFF" }
    });

    BackGroundColorHeaders = new formattingSettings.ColorPicker({
        name: "BackGroundColorHeaders",
        displayName: "Background Color Headers",
        value: { value: "#FFFFFF" }
    });
    BackGroundColorHeadersColor = new formattingSettings.ColorPicker({
        name: "BackGroundColorHeadersColor",
        displayName: "Text Color Headers",
        value: { value: "#FFFFFF" }
    });

    LabelExpenses = new formattingSettings.TextInput({
        placeholder: "Label Expenses",
        name: "LabelExpenses",
        displayName: "Label Expenses",
        value: "Label Expense"
    });

    LabelIncome = new formattingSettings.TextInput({
        placeholder: "Label Income",
        name: "LabelIncome",
        displayName: "Label Income",
        value: "Label Income"
    });




    LabelTotalExpenses = new formattingSettings.TextInput({
        placeholder: "Label Total Expenses",
        name: "LabelTotalExpenses",
        displayName: "Label Total Expenses",
        value: "Label Expense"
    });

    LabelTotalIncome = new formattingSettings.TextInput({
        placeholder: "Label Total Income",
        name: "LabelTotalIncome",
        displayName: "Label Total Income",
        value: "Label Total Income"
    });

    /*v----- */
    LabelTotalProfit = new formattingSettings.TextInput({
        placeholder: "Label Total Profit",
        name: "LabelTotalProfit",
        displayName: "Label Total Profit",
        value: "Label Total Profit"
    });

    LabelRevenues = new formattingSettings.TextInput({
        placeholder: "Label NON-Operatin Revenues",
        name: "LabelRevenues",
        displayName: "Label NON-Operatin Revenues",
        value: "Label NON-Operatin Revenues"
    });
    LabelTotalRevenues = new formattingSettings.TextInput({
        placeholder: "Label Total NON-Operatin Revenues",
        name: "LabelTotalRevenues",
        displayName: "Label Total NON-Operatin Revenues",
        value: "Label Total NON-Operatin Revenues"
    });
    LabelTotalNetResultOperation = new formattingSettings.TextInput({
        placeholder: "Label Total Net Result Operation",
        name: "LabelTotalNetResultOperation",
        displayName: "Label Total Net Result Operation",
        value: "Label Total Net Result Operation"
    });

    /*v----- */



    DecimalPlaces = new formattingSettings.NumUpDown({
        name: "DecimalPlaces",
        displayName: "Decimal Place",
        value: 2,
        options: {
            minValue: {
                type: powerbi.visuals.ValidatorType.Min,
                value: 0,
            },
            maxValue: {
                type: powerbi.visuals.ValidatorType.Max,
                value: 8,
            },
        }

    });

    name: string = "format_table";
    displayName: string = "Format Table";
    slices: Array<FormattingSettingsSlice> = [
        this.LabelIncome,
        this.LabelTotalIncome,
        this.LabelExpenses,
        this.LabelTotalExpenses,
        this.BackGroundColorHeaders,
        this.BackGroundColorHeadersColor,
        this.BackGroundColor,
        this.DecimalPlaces,
        this.BackGroundColorAccount,
        this.LabelTotalProfit,
        this.LabelRevenues,
        this.LabelTotalRevenues,
        this.LabelTotalNetResultOperation
    ];
}

/**
* visual settings model class
*
*/
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dataPointCard = new DataPointCardSettings();

    cards = [this.dataPointCard];
}/*
class VisualCustomSettingsType<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}
type VisualCustomSettingsType = {
    name: string;
    knownFor: string[];
};*/
export type VisualCustomSettingsType = {
    INCOME: {
        Label: string,
        LabelTotal: string
    },
    EXPENSES: {
        Label: string,
        LabelTotal: string
    },
    PROFIT: {
        Label: string,
        LabelTotal: string
    },
    REVENUES: {
        Label: string,
        LabelTotal: string
    },
    NETRESULTOPERATION: {
        Label: string,
        LabelTotal: string
    },

    DecimalPlaces: number,
    BackGroundColor: string,
    BackGroundColorAccount: string,
    BackGroundColorHeaders: string,
    BackGroundColorHeadersColor: string,

}
export class VisualCustomSettingsModel implements VisualCustomSettingsType {
    constructor(
        public INCOME: { Label: string; LabelTotal: string; } = null,
        public EXPENSES: { Label: string; LabelTotal: string; } = null,
        public PROFIT: { Label: string; LabelTotal: string; } = null,
        public REVENUES: { Label: string; LabelTotal: string; } = null,
        public NETRESULTOPERATION: { Label: string; LabelTotal: string; } = null,
        public DecimalPlaces: number = 2,
        public BackGroundColor: string = "#FFFFFF",
        public BackGroundColorAccount: string = "#FFFFFF",
        public BackGroundColorHeaders: string = "#FFFFFF",
        public BackGroundColorHeadersColor: string = "#FFFFFF") {

    }
    public getSettings(_SETTINGS_) {


        console.log("*****************[_SETTINGS_]********************");
        console.info("******[" + JSON.stringify(_SETTINGS_) + "]*******");
        const _AllSettings_: VisualCustomSettingsType = {
            INCOME: {
                Label: _SETTINGS_.dataPointCard.LabelIncome.value,
                LabelTotal: _SETTINGS_.dataPointCard.LabelTotalIncome.value
            },
            EXPENSES: {
                Label: _SETTINGS_.dataPointCard.LabelExpenses.value,
                LabelTotal: _SETTINGS_.dataPointCard.LabelTotalExpenses.value
            },
            PROFIT: {
                Label: null,
                LabelTotal: _SETTINGS_.dataPointCard.LabelTotalProfit.value
            },
            REVENUES: {
                Label: _SETTINGS_.dataPointCard.LabelRevenues.value,
                LabelTotal: _SETTINGS_.dataPointCard.LabelTotalRevenues.value
            },
            NETRESULTOPERATION: {
                Label: _SETTINGS_.dataPointCard.LabelTotalNetResultOperation.value,
                LabelTotal: _SETTINGS_.dataPointCard.LabelTotalNetResultOperation.value
            },
            DecimalPlaces: _SETTINGS_.dataPointCard.DecimalPlaces.value,
            BackGroundColor: _SETTINGS_.dataPointCard.BackGroundColor.value.value,
            BackGroundColorAccount: _SETTINGS_.dataPointCard.BackGroundColorAccount.value.value,
            BackGroundColorHeaders: _SETTINGS_.dataPointCard.BackGroundColorHeaders.value.value,
            BackGroundColorHeadersColor: _SETTINGS_.dataPointCard.BackGroundColorHeadersColor.value.value

        };

        return _AllSettings_;
    }
}