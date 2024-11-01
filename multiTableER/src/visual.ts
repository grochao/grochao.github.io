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

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import { ANSconsoleBox } from "./cls_consoleBox/consoleBox"

import { ANS_JsonDB } from "./process_data";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

//import { json } from "d3";

export class Visual implements IVisual {
    private target: HTMLElement;
    //private updateCount: number;
    //private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {

        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        // this.updateCount = 0;



        if (document) {



            /* const new_p: HTMLElement = document.createElement("p");
             new_p.appendChild(document.createTextNode("Update count:"));
             const new_em: HTMLElement = document.createElement("em");
             this.textNode = document.createTextNode(this.updateCount.toString());
             new_em.appendChild(this.textNode);
             new_p.appendChild(new_em);
             this.target.appendChild(new_p);*/
            ANSconsoleBox.Warn("-Guillermo Rocha-");


        }
    }
    /* private static reMapJSON(_DATA_: any = false, _TYPE_: string = ""): any {
         if (_DATA_) {
             return _DATA_.map((_rows_) => {
                 const _role_ = Object.keys(_rows_.source.roles)[0]
                 return {
                     index: Object.values(_rows_.source.rolesIndex[_role_][0])
                 }
             });
             //cosnt _json_ = _DATA_.
         } else {
 
             return _TYPE_
         }
     }
     private static ReturnData(_DATA_: any = false): any {
         if (_DATA_) {
             return {
                 rows: Visual.reMapJSON(_DATA_.categories, "rows"),
                 columns: Visual.reMapJSON(_DATA_.categories, "columns"),
 
             }
         } else {
 
             return false
         }
     }*/

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);


        if (document) {

            ANSconsoleBox.Clear();
            ANSconsoleBox.Group("type:" + ANSconsoleBox.returnDetectDataType(options.dataViews[0]));
            ANSconsoleBox.Warn(JSON.stringify(ANS_JsonDB.ReturnJSON(options.dataViews[0].categorical)))// .ReturnJSON());
            ANSconsoleBox.GroupEnd();
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