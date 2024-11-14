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

import jsPDF from "jspdf";

import { ANSconsoleBox } from "./cls_consoleBox/consoleBox";

import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;


import { VisualFormattingSettingsModel } from "./settings";
import { Visual_GeneratorHTML } from "./generator_html";
import { Visual_CLS_resetData } from "./cls_resetDatas"
export class Visual implements IVisual {
    private WidthDisplay: any;
    private AllWidthJSON: any;
    private VarPersistent: any;
    private dataView: DataView;
    private target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private previousDataHash: number;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private visualHost: IVisualHost;
    private ClickRezise: boolean;
    private _TABLE_HTML_: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        // console.log('Visual constructor', options);
        this.previousDataHash = 0;
        this.visualHost = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.updateCount = 0;
        this.ClickRezise = false;



        this.AllWidthJSON = [];
        if (document) {
            this._TABLE_HTML_ = Visual_GeneratorHTML.CreateTable("DetailsInRows");

            this.target.appendChild(this._TABLE_HTML_);


            document.addEventListener('mousedown', (event: MouseEvent) => {
                const target = event.target as HTMLElement;

                // Verificamos si el elemento clicado tiene las clases 'cell', 'resizable' y 'top'
                if (target.matches('.cell.resizable.top')) {
                    this.ClickRezise = true;
                    // Verificamos si el clic está en el margen derecho de la celda
                    if (event.offsetX > target.offsetWidth - 10) { // 10px del borde derecho
                        const startX = event.clientX;
                        const startWidth = target.offsetWidth;
                        const dataColumnID = target.getAttribute('data-columnid') || '';

                        // Lógica para manejar el log
                        // Seleccionamos todos los elementos con la clase que coincide con dataColumnID
                        const column_reference = document.querySelectorAll<HTMLElement>(`.${dataColumnID}`);

                        const doDrag = (e: MouseEvent) => {
                            this.ClickRezise = true;
                            const newWidth = startWidth + (e.clientX - startX);
                            target.style.width = newWidth + 'px';

                            column_reference.forEach((div) => {
                                div.style.width = newWidth + 'px';
                            });

                            this.setColumnWidth();

                        };


                        const stopDrag_mouseup = (e: MouseEvent) => {
                            const newWidth = startWidth + (e.clientX - startX);
                            this.ClickRezise = false;
                            this.setColumnWidth(true);
                            document.removeEventListener('mousemove', doDrag);
                            document.removeEventListener('mouseup', stopDrag_mouseup);

                        };

                        document.addEventListener('mousemove', doDrag);
                        document.addEventListener('mouseup', stopDrag_mouseup);
                    }
                }
            });


        }
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);
        this.VarPersistent = options.dataViews[0]?.metadata.objects;
        this.WidthDisplay = options.viewport.width;


        const newData = options.dataViews && options.dataViews[0] ? options.dataViews[0] : null;

        const newDataHash = this.calculateHash(newData);

        // Comparar el hash actual con el anterior

        this.AllWidthJSON = this.getAllWidth();
        if (this.previousDataHash !== newDataHash) {

            this.previousDataHash = newDataHash;

            if (this.ClickRezise === false) {
                this.dataView = newData;
                const _CURRENT_DATA_ = Visual_CLS_resetData.ReturnDataJson(this.dataView.table);

                //this._TABLE_HTML_.remove();
                if (this._TABLE_HTML_) {
                    while (this._TABLE_HTML_.firstChild) {
                        this._TABLE_HTML_.removeChild(this._TABLE_HTML_.firstChild);
                    }
                }

                this._TABLE_HTML_.appendChild(Visual_GeneratorHTML.CreateTableHead(_CURRENT_DATA_, false));
                this._TABLE_HTML_.appendChild(Visual_GeneratorHTML.CreateTableBody(_CURRENT_DATA_))
                this._TABLE_HTML_.style.minWidth = parseInt(this.WidthDisplay) + "px";
                this.ResetColumnsWidth();

            }

            // ANSconsoleBox.Log(JSON.stringify(this.AllWidthJSON));
            ANSconsoleBox.Log("END: " + JSON.stringify(this.AllWidthJSON));
        }
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
    /*  ===========================================[CUSTOM METHODS]============================================= */

    private getAllWidth() {


        return JSON.parse(this.VarPersistent?.columnWidth.WidthsJson);


    }

    private calculateHash(data: any): number {
        return JSON.stringify(data).split("").reduce((hash, char) => {
            return Math.imul(31, hash) + char.charCodeAt(0);
        }, 0) | 0;
    }
    private ResetColumnsWidth() {
        //this.VarPersistent
        if (this.VarPersistent?.columnWidth) {
            const allWidths = JSON.parse(this.VarPersistent?.columnWidth.WidthsJson);
            allWidths.forEach((_column_: any) => {
                const column_reference = document.querySelectorAll<HTMLElement>(`.${_column_.columnName}`);
                column_reference.forEach((cell) => {
                    cell.style.width = _column_.width;
                });
            });
        }
        this.setColumnWidth(true);

    }
    private setColumnWidth(reset = false) {

        if (reset) {
            this.AllWidthJSON = [];
        }
        const _table_ = document.querySelectorAll<HTMLElement>("#DetailsInRows .top");
        if (_table_) {
            let new_table_width: number = 0;

            _table_.forEach((div) => {
                // Obtiene el estilo calculado de cada elemento
                const computedStyle = window.getComputedStyle(div);
                const _width_ = computedStyle.width;

                if (reset) {
                    this.AllWidthJSON.push({
                        columnName: div.getAttribute('data-columnid'),
                        width: _width_
                    });
                }

                new_table_width += Number(_width_.replace("px", "")) + 1;

            });
            this._TABLE_HTML_.style.width = (new_table_width - 1) + "px";

            if (reset) {
                const persistObject = {
                    merge: [
                        {
                            objectName: "columnWidth",
                            properties: {
                                ["WidthsJson"]: JSON.stringify(this.AllWidthJSON)
                            },
                            selector: null
                        }
                    ]
                };

                this.visualHost.persistProperties(persistObject);
            }

        }




    }

}