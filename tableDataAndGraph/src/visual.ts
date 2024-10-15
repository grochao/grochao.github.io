/*
*  Power BI Visual CLI
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

import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IVisualHost = powerbi.extensibility.IVisualHost;
import * as d3 from "d3";

import { ANS_JsonDB } from "./data"

import { consoleBox } from "./consoleBox"

type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";



import { VisualFormattingSettingsModel } from "./settings";

import { VisualCustomSettingsModel, VisualCustomSettingsType } from "./settings";
export class Visual implements IVisual {
    static target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private AllColumnNames: string;
    private executeUpdate: boolean;
    private table: HTMLParagraphElement;
    private formattingSettings: VisualFormattingSettingsModel;

    private formattingSettingsService: FormattingSettingsService;
    private dataView: DataView;

    static _id_event_click_global_ = "";
    static GrandTotal = {
        INCOME: ANS_JsonDB.return_JSON_structure(),
        EXPENSES: ANS_JsonDB.return_JSON_structure(),
        PROFIT: ANS_JsonDB.return_JSON_structure(),
        REVENUES: ANS_JsonDB.return_JSON_structure(),
        NETRESULTOPERATION: ANS_JsonDB.return_JSON_structure(),
        ITDA_VALUE: ANS_JsonDB.return_JSON_structure(),
        EBITDA_VALUE: ANS_JsonDB.return_JSON_structure(),
        EBITDA_PERCENTAGE: ANS_JsonDB.return_JSON_structure()
    };





    static settings_obj: VisualCustomSettingsType;
    constructor(options: VisualConstructorOptions) {
        //////console.log('Visual constructor WWW:', options);
        this.formattingSettingsService = new FormattingSettingsService();
        Visual.target = options.element;
        this.executeUpdate = false;


        if (document) {




            //  this.AllColumnNames = "casa, oficina, trabajo";

            const TblContainerER = document.createElement("div");
            TblContainerER.className = "TblContainerER";
            TblContainerER.setAttribute("id", "TblContainerER");
            // TblContainerER.className = "open";


            Visual.target.appendChild(TblContainerER);



        }
    }
    public static getCurrentLine(): number {
        const error = new Error();
        const stackLines = error.stack?.split("\n") || [];

        // Dependiendo del entorno, la línea con la información del stack trace puede variar
        const currentStackLine = stackLines[2]; // La tercera línea suele ser la actual
        const lineMatch = currentStackLine.match(/:(\d+):\d+/);

        return lineMatch ? parseInt(lineMatch[1], 10) : -1; // Devuelve el número de línea
    }
    public static LogBOX(_VALUE_: string = null, style: string = "error"/* error,information,warning */) {
        let _cell_textarea_: HTMLElement = document.getElementById("logbox");
        //let t = document.createTextNode(_VALUE_);

        if (!_cell_textarea_) {
            const _show_hidden_ = document.createElement("div");
            const _allcontent_ = document.createElement("div");
            _allcontent_.id = "allcontent";
            _show_hidden_.id = "show_hidden"
            _cell_textarea_ = document.createElement("div");
            _cell_textarea_.className = "log";
            _cell_textarea_.id = "logbox";
            _allcontent_.innerHTML = '<div class="container-message ' + style + '"><textarea style="display:block;width_100%; height:150px">' + _VALUE_ + "</textarea></div>";
            _cell_textarea_.appendChild(_show_hidden_);
            _cell_textarea_.appendChild(_allcontent_);



            Visual.target.appendChild(_cell_textarea_)

            Visual.agregarEventoClick();
        } else {
            const _allcontent_ = document.getElementById("allcontent");
            _allcontent_.innerHTML += '<div class="container-message ' + style + '"><textarea style="display:block;width_100%; height:150px">' + _VALUE_ + "</textarea></div>";
            // _cell_textarea_.innerHTML += '<div class="container-message ' + style + '">' + _VALUE_ + "</div>";
            // _cell_textarea_.appendChild(t);
        }



        if (_VALUE_ == null) {
            //_cell_textarea_.innerHTML = "";
            if ($(".container-message").length) {
                $(".container-message").remove();
            }
        }

    }
    public static ReturnCell(typecel: string, TextContent: any, theClass: string = "", colspan: number = null): HTMLElement {

        // let _cell_: HTMLElement = document.createElement(typecel);
        const _cell_ = document.createElement(typecel);
        //_cell_.appendChild(document.createTextNode(TextContent));
        _cell_.innerHTML = TextContent;

        if (theClass != "") {
            _cell_.className = theClass;
        }
        if (colspan !== null) {
            _cell_.setAttribute('colspan', colspan.toString());
        }

        //     let _cell_: HTMLElement = d3.selectAll("Table")

        return _cell_;


    }

    private static checkValue(value: any, round: boolean = false, replaceValue: any = "") {
        if (value == null || value === null || typeof value === 'undefined') {
            return replaceValue;
        } else {
            return (round) ? (Number(value)) : value;
        }
    }
    private static returnDate(_date_: Date) {
        const day = _date_.getDate().toString();
        /* const MontString = [
             "E"
         ]*/
        const month = (_date_.getMonth() + 1).toString();
        const year = _date_.getFullYear();
        return `${day}-${month}-${year}`;

    }

    private static ReplaceYTD(name: string, lastYTD: string, currentYTD: string) {
        return ((name).replace("[CURRENT YEAR]", currentYTD).replace("[LAST YEAR]", lastYTD)).replace(/\s+/g, "<br>")
    }
    private onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    private static getRowValuesJson(_ROW_VALUES_, _DB_TITLE_COLUMNS_) {
        return {
            account: _ROW_VALUES_[_DB_TITLE_COLUMNS_.account.position],
            categories: _ROW_VALUES_[_DB_TITLE_COLUMNS_.categories.position],
            group_account_name: _ROW_VALUES_[_DB_TITLE_COLUMNS_.group_account_name.position],
            account_name: _ROW_VALUES_[_DB_TITLE_COLUMNS_.account_name.position],
            PreviousYear: Number((_ROW_VALUES_[_DB_TITLE_COLUMNS_.PreviousYear.position])),
            Budget: Number((_ROW_VALUES_[_DB_TITLE_COLUMNS_.Budget.position])),
            CurrentYear: Number((_ROW_VALUES_[_DB_TITLE_COLUMNS_.CurrentYear.position])),
            difDollar: Number((_ROW_VALUES_[_DB_TITLE_COLUMNS_.difDollar.position])),
            difPercentage: Number((_ROW_VALUES_[_DB_TITLE_COLUMNS_.difPercentage.position]))
        }
    }
    private returnDB_Json(JsonDB: any) {
        // let tmpArray = JsonDB.categorical.categories;
        const _DB_ = {
            TITLE_COLUMNS: {
                VALUES: [ANS_JsonDB.return_JSON_structure()]
            },
            VALUES: [],
            "INCOME": {
                VALUES: []
            },
            "EXPENSES": {
                VALUES: []
            },
            "PROFIT": {
                VALUES: []
            },
            "REVENUES": {
                VALUES: []
            },
            "NETRESULTOPERATION": {
                VALUES: []
            },
            "CURRENT_YTD": "",
            "LAST_YTD": "",
        };

        (JsonDB.columns).forEach((_ROW_TITLES_ACCOUNTS_: any) => {
            const ColumnsPositions = {
                value: JSON.stringify(_ROW_TITLES_ACCOUNTS_.displayName),
                position: parseInt(_ROW_TITLES_ACCOUNTS_.index)
            };
            if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("account")) {
                _DB_.TITLE_COLUMNS.VALUES[0].account = ColumnsPositions;

            } else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("categories")) {
                _DB_.TITLE_COLUMNS.VALUES[0].categories = ColumnsPositions;

            }
            else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("group_account_name")) {
                _DB_.TITLE_COLUMNS.VALUES[0].group_account_name = ColumnsPositions;

            }

            else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("account_name")) {
                _DB_.TITLE_COLUMNS.VALUES[0].account_name = ColumnsPositions;

            } else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("PreviousYear")) {
                _DB_.TITLE_COLUMNS.VALUES[0].PreviousYear = ColumnsPositions;

            } else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("Budget")) {
                _DB_.TITLE_COLUMNS.VALUES[0].Budget = ColumnsPositions;

            } else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("CurrentYear")) {
                _DB_.TITLE_COLUMNS.VALUES[0].CurrentYear = ColumnsPositions;

            } else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("difDollar")) {
                _DB_.TITLE_COLUMNS.VALUES[0].difDollar = ColumnsPositions;

            } else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("difPercentage")) {
                _DB_.TITLE_COLUMNS.VALUES[0].difPercentage = ColumnsPositions;

            }
            else if (_ROW_TITLES_ACCOUNTS_.roles.hasOwnProperty("current_date")) {
                _DB_.TITLE_COLUMNS.VALUES[0].current_date = ColumnsPositions;

            }
        });


        (JsonDB.rows).forEach((_ROW_VALUES_: any/*, row: number*/) => {

            let AccountType: string = '';


            if (_ROW_VALUES_[_DB_.TITLE_COLUMNS.VALUES[0].categories.position] !== null) {
                AccountType = _ROW_VALUES_[_DB_.TITLE_COLUMNS.VALUES[0].account.position];
                const TMPVALUES = Visual.getRowValuesJson(_ROW_VALUES_, _DB_.TITLE_COLUMNS.VALUES[0])
                if ((TMPVALUES.categories === "FINANCIAL/DEPRECIATION") && (((TMPVALUES.account_name).toUpperCase()).includes(("Amortizations").toUpperCase()) || ((TMPVALUES.account_name).toUpperCase()).includes(("Depreciation").toUpperCase()) || ((TMPVALUES.account_name).toUpperCase()).includes(("Interest Payment").toUpperCase()))) {


                    Visual.GrandTotal.ITDA_VALUE.categories.value = "EBITDA (US$)";
                    Visual.GrandTotal.ITDA_VALUE.PreviousYear.value = Number(Visual.GrandTotal.ITDA_VALUE.PreviousYear.value) + Number(TMPVALUES.PreviousYear);
                    Visual.GrandTotal.ITDA_VALUE.Budget.value = Number(Visual.GrandTotal.ITDA_VALUE.Budget.value) + Number(TMPVALUES.Budget);
                    Visual.GrandTotal.ITDA_VALUE.CurrentYear.value = Number(Visual.GrandTotal.ITDA_VALUE.CurrentYear.value) + Number(TMPVALUES.CurrentYear);
                    Visual.GrandTotal.ITDA_VALUE.difDollar.value = Number(Visual.GrandTotal.ITDA_VALUE.difDollar.value) + Number(TMPVALUES.difDollar);
                    Visual.GrandTotal.ITDA_VALUE.difPercentage.value = Number(Visual.GrandTotal.ITDA_VALUE.difPercentage.value) + Number(TMPVALUES.difPercentage);


                }
                //  _DB_.VALUES.push(TMPVALUES);
                if (AccountType == "OPERATING INCOME") {
                    _DB_.INCOME.VALUES.push(TMPVALUES);

                } else if (AccountType == "OPERATING EXPENSES") {
                    _DB_.EXPENSES.VALUES.push(TMPVALUES);


                } else if (AccountType == "NON-OPERATING REVENUES") {
                    _DB_.REVENUES.VALUES.push(TMPVALUES);
                }
            }

            if (_DB_.CURRENT_YTD == "") {
                _DB_.CURRENT_YTD = Visual.returnFormatYTD(_ROW_VALUES_[_DB_.TITLE_COLUMNS.VALUES[0].current_date.position], "current");
                _DB_.LAST_YTD = Visual.returnFormatYTD(_ROW_VALUES_[_DB_.TITLE_COLUMNS.VALUES[0].current_date.position], "last");
                _DB_.TITLE_COLUMNS.VALUES[0].account.value = Visual.ReplaceYTD(_DB_.TITLE_COLUMNS.VALUES[0].account.value, _DB_.LAST_YTD, _DB_.CURRENT_YTD);
                _DB_.TITLE_COLUMNS.VALUES[0].PreviousYear.value = Visual.ReplaceYTD(_DB_.TITLE_COLUMNS.VALUES[0].PreviousYear.value, _DB_.LAST_YTD, _DB_.CURRENT_YTD);
                _DB_.TITLE_COLUMNS.VALUES[0].Budget.value = Visual.ReplaceYTD(_DB_.TITLE_COLUMNS.VALUES[0].Budget.value, _DB_.LAST_YTD, _DB_.CURRENT_YTD);
                _DB_.TITLE_COLUMNS.VALUES[0].CurrentYear.value = Visual.ReplaceYTD(_DB_.TITLE_COLUMNS.VALUES[0].CurrentYear.value, _DB_.LAST_YTD, _DB_.CURRENT_YTD);
                _DB_.TITLE_COLUMNS.VALUES[0].difDollar.value = Visual.ReplaceYTD(_DB_.TITLE_COLUMNS.VALUES[0].difDollar.value, _DB_.LAST_YTD, _DB_.CURRENT_YTD);
                _DB_.TITLE_COLUMNS.VALUES[0].difPercentage.value = Visual.ReplaceYTD(_DB_.TITLE_COLUMNS.VALUES[0].difPercentage.value, _DB_.LAST_YTD, _DB_.CURRENT_YTD);

            }

        });

        return _DB_;

    }
    private static isNumeric(value?: string | number): boolean {
        return ((value != null) &&
            (value !== '') &&
            !isNaN(Number(value.toString())));
    }
    private static returnFormatYTD(_date_: string, type: string = 'current') {

        const rest = (type == "current") ? 2000 : 2001;
        return ((new Date(_date_)).toLocaleString('default', { month: 'short' }) + "-" + (parseInt((new Date(_date_)).toLocaleString('default', { year: 'numeric' })) - rest)).replace(/^\w/, (c) => c.toUpperCase())
    }
    static returnStyleOutput(value: any, symbol: any = null, rounded: boolean = true) {
        value = Visual.isNumeric(value) ? Visual.PrintFormatNumeric(value, false, false, rounded) : value

        if (symbol !== null) {
            if (symbol == "$" || symbol == "U$" || symbol == "US$" || symbol == "C$") {
                return "<span><i>" + symbol + "</i>" + ((value + "") == "-0" ? "-" : value) + "</span>";
            } else if (symbol == "%") {
                return "<span>" + ((value).replace("(", "-")).replace(")", "") + "%</span>";
            }
        } else {
            return "<span>" + value + "</span>";
        }
    }
    private static capitalizar(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        0
    }
    private static ReturnRowWithData(_DATA_ROW_, ClassRow: string = null) {
        const RowWithData = document.createElement("tr");


        if (ClassRow === "is_row_category") {
            if (ClassRow != null) {
                RowWithData.className = ClassRow + " " + Visual._id_event_click_global_;
                RowWithData.setAttribute("data-category", Visual.doDashes(_DATA_ROW_.categories));
            }
            RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.categories), "is_string"));
        }

        else if (ClassRow === "is_row_group_acount") {
            if (ClassRow != null) {
                RowWithData.className = ClassRow + " " + Visual._id_event_click_global_;
                RowWithData.setAttribute("data-group-acount", Visual.doDashes(_DATA_ROW_.group_account_name));
            }
            RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.group_account_name), "is_string"));

        }
        else {

            RowWithData.className = ClassRow + " hidden " + Visual.doDashes(_DATA_ROW_.categories);
            RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.account_name), "is_string "));
        }


        RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.PreviousYear, "$"), "is_numeric"));
        RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.Budget, "$"), "is_numeric"));
        RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.CurrentYear, "$"), "is_numeric"));
        RowWithData.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_DATA_ROW_.difDollar, "$"), "is_numeric"));
        const _value_percent_ = Visual.returnStyleOutput((Number(_DATA_ROW_.Budget) > 0) ? (Number(_DATA_ROW_.difDollar) / Number(_DATA_ROW_.Budget)) * 100 : "-", "%", false)
        RowWithData.appendChild(Visual.ReturnCell("td", (_value_percent_ == "<span>-%</span>" ? "<span></span>" : _value_percent_), "is_numeric"));
        return RowWithData;
    }
    private static doDashes(str) {
        const re = /[^a-z0-9]+/gi; // global and case insensitive matching of non-char/non-numeric
        const re2 = /^-*|-*$/g;     // get rid of any leading/trailing dashes
        str = str.replace(re, '-');  // perform the 1st regexp
        return str.replace(re2, '').toLowerCase(); // ..aaand the second + return lowercased result
    }
    private static getRandomArbitrary(min, max) {
        return (Math.random() * (max - min) + min).toFixed(0);
    }
    private static returnTotalLabel(type) {
        let TotalLabel: any = "";
        switch (type) {
            case "PROFIT":
                TotalLabel = "PROFIT";
                break;
            case "NETRESULTOPERATION":
                TotalLabel = "NETRESULTOPERATION";
                break;
            case "EBITDA_VALUE":
                TotalLabel = "EBITDA_VALUE";
                break;
            case "EBITDA_PERCENTAGE":
                TotalLabel = "EBITDA_PERCENTAGE";
                break;
            default:
                TotalLabel = type
                break;
        }
        return TotalLabel;
    }
    private static ReturnRow(head_column, _DATAROW_, symbol) {
        const tmp_row = document.createElement("tr");
        tmp_row.appendChild(Visual.ReturnCell("th", Visual.returnStyleOutput(head_column, "is_string_full")));
        tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((_DATAROW_.PreviousYear).toFixed(0), symbol), "is_numeric"));
        tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((_DATAROW_.Budget).toFixed(0), symbol), "is_numeric"));
        tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((_DATAROW_.CurrentYear).toFixed(0), symbol), "is_numeric"));
        tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((_DATAROW_.difDollar).toFixed(0), symbol), "is_numeric"));
        tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((_DATAROW_.difPercentage).toFixed(1), "%", false), "is_numeric"));
        return tmp_row
    }
    /*private static InitzialiceJSON() {
        return {
            account:"",

            categories: "",
            PreviousYear: 0,
            Budget: 0,
            CurrentYear: 0,
            difDollar: 0,
            difPercentage: 0
        }
    }*/
    private static returnJsonEBITDA_VALUE() {


        const INCOME_PREVIOUS = Number(Visual.GrandTotal.INCOME.PreviousYear.value);
        const EBITDA_PREVIOUS = Number(Visual.GrandTotal.EBITDA_VALUE.PreviousYear.value)

        const INCOME_BUDGET = Number(Visual.GrandTotal.INCOME.Budget.value);
        const EBITDA_BUDGET = Number(Visual.GrandTotal.EBITDA_VALUE.Budget.value);


        const INCOME_CURRENTYEAR = Number(Visual.GrandTotal.INCOME.CurrentYear.value);
        const EBITDA_CURRENTYEAR = Number(Visual.GrandTotal.EBITDA_VALUE.CurrentYear.value);




        const CURRENT_YEAR = (((INCOME_CURRENTYEAR == 0 ? 0 : (EBITDA_CURRENTYEAR / INCOME_CURRENTYEAR))) * 100);
        const BUDGET = ((INCOME_BUDGET == 0 ? 0 : ((EBITDA_BUDGET / INCOME_BUDGET))) * 100)
        const DOLLAR = CURRENT_YEAR - BUDGET
        const PERCENTAGE = (BUDGET == 0 ? 0 : (DOLLAR / BUDGET))
        return {
            PreviousYear: ((EBITDA_PREVIOUS / INCOME_PREVIOUS) * 100),
            Budget: BUDGET,
            CurrentYear: CURRENT_YEAR,
            difDollar: DOLLAR,
            difPercentage: PERCENTAGE,
        }
    }

    private static ClearDataValues(__GROUP__: any = null) {

        Visual.GrandTotal[__GROUP__].categories.value = "";
        Visual.GrandTotal[__GROUP__].PreviousYear.value = 0;
        Visual.GrandTotal[__GROUP__].Budget.value = 0;
        Visual.GrandTotal[__GROUP__].CurrentYear.value = 0;
        Visual.GrandTotal[__GROUP__].difDollar.value = 0;
        Visual.GrandTotal[__GROUP__].difPercentage.value = 0;
    }
    private static SetDataValue(__GROUP__: any = null, __DATA_VAUES__: any = null) {




        Visual.GrandTotal[__GROUP__].categories.value = __DATA_VAUES__.categories;
        Visual.GrandTotal[__GROUP__].PreviousYear.value = __DATA_VAUES__.PreviousYear;
        Visual.GrandTotal[__GROUP__].Budget.value = __DATA_VAUES__.Budget;
        Visual.GrandTotal[__GROUP__].CurrentYear.value = __DATA_VAUES__.CurrentYear;
        Visual.GrandTotal[__GROUP__].difDollar.value = __DATA_VAUES__.difDollar;
        Visual.GrandTotal[__GROUP__].difPercentage.value = __DATA_VAUES__.difPercentage;
    }
    private static UpdateDataValues(__TYPE__: any = null, __DATA_VAUES__: any = null) {
        if (__TYPE__ !== null && __DATA_VAUES__ !== null) {
            if (__TYPE__ === "INCOME") {
                __DATA_VAUES__.categories = "OPERATING INCOME";
                Visual.SetDataValue("INCOME", __DATA_VAUES__);
            } else if (__TYPE__ === "EXPENSES") {
                __DATA_VAUES__.categories = "OPERATING EXPENSES";
                Visual.SetDataValue("EXPENSES", __DATA_VAUES__);
                Visual.GrandTotal.PROFIT.categories.value = "PROFIT OPERATION";
                Visual.GrandTotal.PROFIT.PreviousYear.value = Visual.GrandTotal.INCOME.PreviousYear.value - Visual.GrandTotal.EXPENSES.PreviousYear.value;
                Visual.GrandTotal.PROFIT.Budget.value = Visual.GrandTotal.INCOME.Budget.value - Visual.GrandTotal.EXPENSES.Budget.value;
                Visual.GrandTotal.PROFIT.CurrentYear.value = Visual.GrandTotal.INCOME.CurrentYear.value - Visual.GrandTotal.EXPENSES.CurrentYear.value;
                Visual.GrandTotal.PROFIT.difDollar.value = Visual.GrandTotal.INCOME.difDollar.value - Visual.GrandTotal.EXPENSES.difDollar.value;
                Visual.GrandTotal.PROFIT.difPercentage.value = Visual.GrandTotal.INCOME.difPercentage.value - Visual.GrandTotal.EXPENSES.difPercentage.value;

            } else if (__TYPE__ === "REVENUES") {
                __DATA_VAUES__.categories = "NON-OPERATING REVENUES";
                Visual.SetDataValue("REVENUES", __DATA_VAUES__);
                Visual.GrandTotal.NETRESULTOPERATION.categories.value = "NET RESULT OPERATION";
                Visual.GrandTotal.NETRESULTOPERATION.PreviousYear.value = Visual.GrandTotal.PROFIT.PreviousYear.value + Visual.GrandTotal.REVENUES.PreviousYear.value;
                Visual.GrandTotal.NETRESULTOPERATION.Budget.value = Visual.GrandTotal.PROFIT.Budget.value + Visual.GrandTotal.REVENUES.Budget.value;
                Visual.GrandTotal.NETRESULTOPERATION.CurrentYear.value = Visual.GrandTotal.PROFIT.CurrentYear.value + Visual.GrandTotal.REVENUES.CurrentYear.value;
                Visual.GrandTotal.NETRESULTOPERATION.difDollar.value = Visual.GrandTotal.PROFIT.difDollar.value + Visual.GrandTotal.REVENUES.difDollar.value;
                Visual.GrandTotal.NETRESULTOPERATION.difPercentage.value = Visual.GrandTotal.PROFIT.difPercentage.value + Visual.GrandTotal.REVENUES.difPercentage.value;
            }
        }
    }
    private static ReturnGroupedRow(_DATA_: any = null, _DATA_SUM_: any = null) {
        if (_DATA_ === null) {
            return {
                account: "",
                categories: "",
                group_account_name: "",
                PreviousYear: 0,
                Budget: 0,
                CurrentYear: 0,
                difDollar: 0,
                difPercentage: 0
            }
        } else {
            if (_DATA_SUM_ === null) {
                return {
                    account: _DATA_.account,
                    categories: _DATA_.categories,
                    group_account_name: _DATA_.group_account_name,
                    PreviousYear: _DATA_.PreviousYear,
                    Budget: _DATA_.Budget,
                    CurrentYear: _DATA_.CurrentYear,
                    difDollar: _DATA_.difDollar,
                    difPercentage: _DATA_.difPercentage,
                }
            } else {
                return {
                    account: _DATA_.account,
                    categories: _DATA_.categories,
                    group_account_name: _DATA_.group_account_name,
                    PreviousYear: _DATA_.PreviousYear + _DATA_SUM_.PreviousYear,
                    Budget: _DATA_.Budget + _DATA_SUM_.Budget,
                    CurrentYear: _DATA_.CurrentYear + _DATA_SUM_.CurrentYear,
                    difDollar: _DATA_.difDollar + _DATA_SUM_.difDollar,
                    difPercentage: _DATA_.difPercentage + _DATA_SUM_.difPercentage
                }
            }

        }
    }

    private static GenerateAccountTypeTable(type: string = null, DATA: any = null, HEADERS: any = null/*, FOOTERS: any = null, _id_event_: any = null*/) {
        let _TABLE_ = document.createElement("table");
        let _T_HEADERS_ = document.createElement("thead");
        let _T_FOOT_ = document.createElement("tfoot");
        let _T_BODY_ = document.createElement("tbody");
        let tmp_row = document.createElement("tr");
        _TABLE_.className = "tbl_style separator-bottom " + type;
        tmp_row.className = "is_row_title_type_account"
        if (type == "PROFIT" || type == "NETRESULTOPERATION" || type == "EBITDA_VALUE" || type == "EBITDA_PERCENTAGE") {
            let TotalLabel = Visual.returnTotalLabel(type);// "";
            let _difPercentage_ = ((((Visual.GrandTotal[TotalLabel].CurrentYear.value) - (Visual.GrandTotal[TotalLabel].Budget.value)) / (Visual.GrandTotal[TotalLabel].Budget.value)) * 100).toFixed(1);
            if ("EBITDA_PERCENTAGE" === type) {
                let EBITDA = Visual.returnJsonEBITDA_VALUE()
                tmp_row.appendChild(Visual.ReturnCell("th", Visual.returnStyleOutput(Visual.GrandTotal[TotalLabel].categories.value), "is_string_full"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((EBITDA.PreviousYear).toFixed(0), "%"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((EBITDA.Budget).toFixed(0), "%"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((EBITDA.CurrentYear).toFixed(0), "%"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((EBITDA.difDollar).toFixed(0), "%"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput((EBITDA.difPercentage).toFixed(0), "%"), "is_numeric"))

            } else {

                tmp_row.appendChild(Visual.ReturnCell("th", Visual.returnStyleOutput(Visual.GrandTotal[TotalLabel].categories.value), "is_string_full"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(Visual.GrandTotal[TotalLabel].PreviousYear.value, "$"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(Visual.GrandTotal[TotalLabel].Budget.value, "$"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(Visual.GrandTotal[TotalLabel].CurrentYear.value, "$"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(Visual.GrandTotal[TotalLabel].difDollar.value, "$"), "is_numeric"));
                tmp_row.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(_difPercentage_, "%"), "is_numeric"));

            }

            _T_HEADERS_.appendChild(tmp_row);
            _TABLE_.append(_T_HEADERS_);
        } else {

            let TotalAccount = Visual.ReturnGroupedRow(); //InitzialiceJSON();
            let AccountCategory: string = "";
            let SubTotalCategory = Visual.ReturnGroupedRow();;



            if (HEADERS != null) {

                _TABLE_.className = "tbl_style";
                if (type === "HEADERS") {
                    tmp_row.className = "headers"
                }
                for (let key in HEADERS) {
                    if ("HEADERS" === type) {
                        if ("account_name" != key && "categories" != key && "current_date" != key) {
                            const cells = ((HEADERS[key]).replace('"', '')).replace('"', '');
                            tmp_row.appendChild(Visual.ReturnCell("th", cells));
                        }
                    }

                }

                _T_HEADERS_.appendChild(tmp_row);
                _TABLE_.append(_T_HEADERS_);
            }
            else {
                _TABLE_.className = "tbl_style separator-bottom";

                if (Visual.settings_obj[type].Label != null) {
                    let tmp_row_title = document.createElement("tr");
                    tmp_row_title.className = "is_row_title_type_account";
                    tmp_row_title.appendChild(Visual.ReturnCell("th", Visual.returnStyleOutput(Visual.settings_obj[type].Label), "is_string_full", 6));
                    _T_HEADERS_.appendChild(tmp_row_title);

                }


                if (DATA) {
                    let GroupedRow = Visual.ReturnGroupedRow();
                    let GROUP_CAT = document.createElement("div");
                    let group_account_name = "";
                    let class_first_element = "";
                    let class_parent = "";
                    (DATA).forEach((_row_: any) => {

                        if (group_account_name == "") {
                            group_account_name = _row_.group_account_name
                            class_first_element = ' begin_group_' + Visual.doDashes(_row_.group_account_name) + " ";
                            class_parent = ' class_parent_' + Visual.doDashes(_row_.group_account_name) + " ";
                        }
                        if (group_account_name !== _row_.group_account_name) {
                            class_first_element = ' begin_group_' + Visual.doDashes(_row_.group_account_name) + " ";
                            class_parent = ' class_parent_' + Visual.doDashes(_row_.group_account_name) + " ";
                            group_account_name = _row_.group_account_name;
                            GroupedRow = Visual.ReturnGroupedRow(_row_);
                        } else {
                            GroupedRow = Visual.ReturnGroupedRow(GroupedRow, _row_);
                        }

                        if (AccountCategory != _row_.categories) {
                            if (AccountCategory != "") {
                                _T_BODY_.appendChild(Visual.ReturnRowWithData(SubTotalCategory, "is_row_category"));
                                _T_BODY_.innerHTML += GROUP_CAT.innerHTML;
                                GROUP_CAT.innerHTML = null;
                                TotalAccount.categories = Visual.settings_obj[type].LabelTotal;
                                TotalAccount = Visual.ReturnGroupedRow(TotalAccount, SubTotalCategory)
                                SubTotalCategory = Visual.ReturnGroupedRow();
                            }
                            GROUP_CAT = document.createElement("div");
                        }
                        SubTotalCategory.categories = _row_.categories;
                        SubTotalCategory = Visual.ReturnGroupedRow(SubTotalCategory, _row_);
                        GROUP_CAT.appendChild(Visual.ReturnRowWithData(_row_, "is_row_title " + class_first_element + " " + class_parent));
                        AccountCategory = _row_.categories;
                        class_first_element = ""
                    });
                    TotalAccount.categories = Visual.settings_obj[type].LabelTotal;
                    TotalAccount = Visual.ReturnGroupedRow(TotalAccount, SubTotalCategory);
                    _T_BODY_.appendChild(Visual.ReturnRowWithData(SubTotalCategory, "is_row_category"));
                    _T_BODY_.innerHTML += GROUP_CAT.innerHTML;
                    GROUP_CAT.innerHTML = null;
                }

                // if ("INCOME" === type) {
                if (Visual.settings_obj[type].Label != null) {
                    let tmp_row_footer = document.createElement("tr");
                    tmp_row_footer.className = "is_row_title_type_account";
                    //tmp_row_footer.appendChild(Visual.ReturnRowWithData(TotalAccount));
                    let difPercentage = (((TotalAccount.CurrentYear - TotalAccount.Budget) / TotalAccount.Budget) * 100).toFixed(1);

                    //tmp_row = Visual.ReturnRow(Visual.settings_obj[type].LabelTotal, TotalAccount, "$")

                    tmp_row_footer.appendChild(Visual.ReturnCell("th", Visual.returnStyleOutput(Visual.settings_obj[type].LabelTotal), "is_string_full"));
                    tmp_row_footer.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(TotalAccount.PreviousYear, "$"), "is_numeric"));
                    tmp_row_footer.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(TotalAccount.Budget, "$"), "is_numeric"));
                    tmp_row_footer.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(TotalAccount.CurrentYear, "$"), "is_numeric"));
                    tmp_row_footer.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(TotalAccount.difDollar, "$"), "is_numeric"));
                    tmp_row_footer.appendChild(Visual.ReturnCell("td", Visual.returnStyleOutput(difPercentage, "%", false), "is_numeric"));

                    _T_FOOT_.appendChild(tmp_row_footer);
                    Visual.UpdateDataValues(type, TotalAccount);

                }

                if ($.trim(_T_HEADERS_.innerHTML) !== "") {
                    _TABLE_.append(_T_HEADERS_);
                }
                if ($.trim(_T_BODY_.innerHTML) !== "") {
                    _TABLE_.append(_T_BODY_);
                }

                if ($.trim(_T_FOOT_.innerHTML) !== "") {
                    _TABLE_.append(_T_FOOT_);
                }


            }
        }





        return _TABLE_;

    }
    private static GetDataValues(_DATA_: any) {

        return {
            account: _DATA_.account.value,
            categories: _DATA_.categories.value,

            account_name: _DATA_.account_name.value,
            PreviousYear: _DATA_.PreviousYear.value,
            Budget: _DATA_.Budget.value,
            CurrentYear: _DATA_.CurrentYear.value,
            difDollar: _DATA_.difDollar.value,
            difPercentage: _DATA_.difPercentage.value
        }
    }
    public InitDataTable() {


        const TblContainerER = document.getElementById("TblContainerER");
        TblContainerER.innerHTML = "";


        let _ALL_TITLES_ = this.dataView.table;
        let _ALL_DB_ = this.returnDB_Json(_ALL_TITLES_);


        let mifecha: any = new Date("10/02/2019");
        const fechaInicial: any = new Date();
        Visual._id_event_click_global_ = "event_click_" + Math.abs(mifecha - fechaInicial) + Visual.getRandomArbitrary(100, 999);




        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("HEADERS", null, Visual.GetDataValues(_ALL_DB_.TITLE_COLUMNS.VALUES[0])))

        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("INCOME", _ALL_DB_.INCOME.VALUES))


        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("EXPENSES", _ALL_DB_.EXPENSES.VALUES))

        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("PROFIT", _ALL_DB_.PROFIT.VALUES))

        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("REVENUES", _ALL_DB_.REVENUES.VALUES))

        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("NETRESULTOPERATION"))

        Visual.GrandTotal.EBITDA_VALUE.categories.value = "EBITDA (US$)";
        Visual.GrandTotal.EBITDA_VALUE.PreviousYear.value = Number(Visual.GrandTotal.NETRESULTOPERATION.PreviousYear.value) + Number(Visual.GrandTotal.ITDA_VALUE.PreviousYear.value);
        Visual.GrandTotal.EBITDA_VALUE.Budget.value = Number(Visual.GrandTotal.NETRESULTOPERATION.Budget.value) + Number(Visual.GrandTotal.ITDA_VALUE.Budget.value);
        Visual.GrandTotal.EBITDA_VALUE.CurrentYear.value = Number(Visual.GrandTotal.NETRESULTOPERATION.CurrentYear.value) + Number(Visual.GrandTotal.ITDA_VALUE.CurrentYear.value);
        Visual.GrandTotal.EBITDA_VALUE.difDollar.value = Number(Visual.GrandTotal.NETRESULTOPERATION.difDollar.value) + Number(Visual.GrandTotal.ITDA_VALUE.difDollar.value);
        Visual.GrandTotal.EBITDA_VALUE.difPercentage.value = Number(Visual.GrandTotal.NETRESULTOPERATION.difPercentage.value) + Number(Visual.GrandTotal.ITDA_VALUE.difPercentage.value);


        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("EBITDA_VALUE"))



        Visual.GrandTotal.EBITDA_PERCENTAGE.categories.value = "EBITDA (%)";
        Visual.GrandTotal.EBITDA_PERCENTAGE.PreviousYear.value = (parseFloat(Visual.GrandTotal.EBITDA_VALUE.PreviousYear.value + "") / parseFloat(Visual.GrandTotal.INCOME.PreviousYear.value + ""))
        Visual.GrandTotal.EBITDA_PERCENTAGE.CurrentYear.value = Visual.GrandTotal.EBITDA_VALUE.CurrentYear.value / Visual.GrandTotal.INCOME.CurrentYear.value;
        Visual.GrandTotal.EBITDA_PERCENTAGE.difDollar.value = 0//Visual.GrandTotal.EBITDA_VALUE.difDollar.value / Visual.GrandTotal.INCOME.difDollar.value;
        Visual.GrandTotal.EBITDA_PERCENTAGE.difPercentage.value = 0//Visual.GrandTotal.EBITDA_VALUE.difPercentage.value / Visual.GrandTotal.INCOME.difPercentage.value;


        TblContainerER.appendChild(Visual.GenerateAccountTypeTable("EBITDA_PERCENTAGE"))


        Visual.ClearDataValues("INCOME");
        Visual.ClearDataValues("EXPENSES");
        Visual.ClearDataValues("PROFIT");
        Visual.ClearDataValues("REVENUES");
        Visual.ClearDataValues("NETRESULTOPERATION");
        Visual.ClearDataValues("ITDA_VALUE");
        Visual.ClearDataValues("EBITDA_VALUE");
        Visual.ClearDataValues("EBITDA_PERCENTAGE");

        Visual.target.appendChild(TblContainerER);
        //Visual.target.appendChild(consoleBox.GetDOM())
    }

    public update(options: VisualUpdateOptions) {


        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews);

        if (Visual.target) {

            Visual.settings_obj = new VisualCustomSettingsModel().getSettings(this.formattingSettings);

            this.dataView = options.dataViews[0];




            //return false;

            this.InitDataTable();
            let element: JQuery = $(".TblContainerER").parent();
            //let OBJ_TBL_BODY  $(".TblContainerER");
            element.css("background", Visual.settings_obj.BackGroundColor);
            element.find(".tbl_style tr.headers, .EBITDA_VALUE tr, .EBITDA_PERCENTAGE tr").css("background-color", Visual.settings_obj.BackGroundColorHeaders);
            element.find(".tbl_style tr.headers, .EBITDA_VALUE tr, .EBITDA_PERCENTAGE tr").css("color", Visual.settings_obj.BackGroundColorHeadersColor);

            element.find(".tbl_style tr.headers th").css("border-color", Visual.settings_obj.BackGroundColor);
            element.find(".tbl_style:not(.EBITDA_VALUE, .EBITDA_PERCENTAGE) .is_row_title_type_account").css("background", Visual.settings_obj.BackGroundColorAccount);

            $("body").on("click", "." + Visual._id_event_click_global_, function () {


                let CURRENT_OBJ = $(this);
                let objCategory = $.trim(CURRENT_OBJ.data("category"));
                // //console.log(objCategory);
                if (CURRENT_OBJ.hasClass("_show_")) {
                    $("tr." + objCategory).addClass("hidden");
                    CURRENT_OBJ.removeClass("_show_")
                } else {
                    $("tr." + objCategory).removeClass("hidden");
                    CURRENT_OBJ.addClass("_show_")
                }


            });
            //   Visual.agregarEventoClick();
            /* let LIST_CATEGORIES = "{";
             $("body .tbl_style tbody tr.is_row_category").each(function (i) {
                 let _str_cat_ = (($(this).find("td:first-child").text()).replace(" ", "-")).replace("/", "-")
                 LIST_CATEGORIES += '"' + _str_cat_ + '": {"open":false},';
                 //LIST_CATEGORIES += (LIST_CATEGORIES !== "" ? "," : "") + $(this).find("td:first-child").html();
     
             });
             LIST_CATEGORIES += "}";*/

            /* 
 
 
             let SHOW_HIDDEN_DIV: JQuery = $("#show_hidden");
             if (SHOW_HIDDEN_DIV.length) {
                 SHOW_HIDDEN_DIV.on("click", (event) => {
                     if ($("#logbox").hasClass("open")) {
                         $("#logbox").removeClass("open");
                     } else {
                         $("#logbox").addClass("open");
                     }
 
                 });
             }*/

            //consoleBox.html();
        }

    }
    public static agregarEventoClick() {
        console.log("EVENT CLICK CREATED");
        var BOX_CONSOLE = document.getElementById("show_hidden");

        if (BOX_CONSOLE) {
            BOX_CONSOLE.addEventListener("click", function (event) {
                console.log("EVENT CLICK");

                let BOXCONTENT = document.getElementById("logbox");

                if (BOXCONTENT.classList.contains("open")) {

                    BOXCONTENT.classList.remove("open")
                } else {

                    BOXCONTENT.classList.add("open")
                }
                /*if (event.target.tagName === 'TD') {
                    var fila = event.target.parentNode;

                    // Remover la clase "seleccionada" de todas las filas
                    var filas = document.querySelectorAll("#miTabla tr");
                    filas.forEach(function (f) {
                        f.classList.remove("fila-seleccionada");
                    });

                    // Agregar la clase "fila-seleccionada" a la fila clickeada
                    fila.classList.add("fila-seleccionada");
                }*/
            });
        }
    }
    private static PrintFormatNumeric(TheValue: any, dec_point: any = false, thousands_point: any = false, rounded: boolean = true): string {

        let number = (TheValue);
        let decimals = Number(Visual.settings_obj.ValueDecimalPlaces);
        if (number == null || !isFinite(number)) {
            throw new TypeError("number is not valid");
        }

        if (!decimals) {
            let len = number.toString().split('.').length;
            decimals = len > 1 ? len : 0;
        }

        if (!dec_point) {
            dec_point = '.';
        }

        if (!thousands_point) {
            thousands_point = ',';
        }
        if (rounded) {
            number = parseFloat(number).toFixed(0);

        } else {
            number = parseFloat(number).toFixed(1);

        }

        number = number.replace(".", dec_point);

        let splitNum = number.split(dec_point);
        splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
        number = splitNum.join(dec_point);

        let _return_ = ((parseFloat(number) < 0 ? "(" + (number).replace("-", "") + ")" : number).replace("(0)", "-"));

        return (_return_ === "0") ? "-" : _return_;
    }
    private static formatMoney(amount: any, decimalCount: number = 2, decimal: string = ".", thousands: string = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            const i: any = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            const j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign +
                (j ? i.substr(0, j) + thousands : '') +
                i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
                (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            return "error";
            ////console.log(e)
        }
    }
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */



    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

}