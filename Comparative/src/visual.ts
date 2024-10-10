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

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";
import { TransformData } from "./data";
import { setStyle } from "./setstyle"; // Import the style

import { select, arc, interpolate, interpolateBasis } from "d3"; // Import d3 moduls
type Selection<T extends d3.BaseType> = d3.Selection<T, any, any, any>;

export class Visual implements IVisual {
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private svg: Selection<SVGElement>;
    private parentGroup: Selection<SVGElement>;
    private backgroundArc: Selection<SVGElement>;
    private progressArc: Selection<SVGElement>;
    private pctLabel: Selection<SVGElement>;
    private arrowLabel: Selection<SVGElement>;
    private gradient: Selection<SVGElement>;

    static margin = { top: 5, right: 5, bottom: 5, left: 5 };
    /*private target: HTMLElement;
    private updateCount: number;
    private textNode: Text;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;*/
    constructor(options: VisualConstructorOptions) {

        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;

        if (document) {
            // Create the DOM element classes and ids
            this.svg = select(this.target).append('svg').classed('mainGroup', true);
            this.parentGroup = this.svg.append('g').classed('parentGroup', true);
            this.backgroundArc = this.parentGroup.append('path').classed('backgroundArc', true);
            this.progressArc = this.parentGroup.append('path').classed('progressArc', true);
            this.pctLabel = this.parentGroup.append('text').classed('pctLabel', true);
            this.arrowLabel = this.parentGroup.append('text').classed('arrow', true);
            this.gradient = this.parentGroup.append("defs").append("linearGradient").attr("id", "gradient")
            this.gradient.append("stop").attr("id", "gradientFirst")
            this.gradient.append("stop").attr("id", "gradientSecond")
        }
    }
    /* constructor(options: VisualConstructorOptions) {
         console.log('Visual constructor', options);
         this.formattingSettingsService = new FormattingSettingsService();
         this.target = options.element;
         this.updateCount = 0;
         if (document) {
             const new_p: HTMLElement = document.createElement("p");
             new_p.appendChild(document.createTextNode("Update count:"));
             const new_em: HTMLElement = document.createElement("em");
             this.textNode = document.createTextNode(this.updateCount.toString());
             new_em.appendChild(this.textNode);
             new_p.appendChild(new_em);
             this.target.appendChild(new_p);
         }
     }
 */
    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, options.dataViews[0]);

        //debugger;

        this.target.innerHTML = `
        <table style="width:100%">
            <tbody>
                <tr>
                    <td>${(options.dataViews[0].table.rows[0][0])}</td>
                    <td>${(options.dataViews[0].table.rows[0][1])}</td>
                    <td>${(options.dataViews[0].table.rows[0][2])}</td>
                    <td>${(options.dataViews[0].table.rows[0][3])}</td>

                </tr>
            </tbody>
        </table>
        <p  style="display:block;width:100%;height:80px"><textarea style="display:block;width:100%;height:80px">${(JSON.stringify(options.dataViews[0]))}</textarea></p>`;

        /*`
        <table style="width:100%">
            <tbody>
                <tr>
                    <td>${(result.previous.label)}</td>
                    <td>${(result.current.label)}</td>
                    <td>${(result.next.label)}</td>
                    <td>${(result.scope.label)}</td>
                </tr>
                <tr>
                    <td>${(result.previous.value)}<br>${(result.previous.percentage)}<br>${(result.previous.index)}</td>
                    <td>${(result.current.value)}<br>${(result.current.percentage)}<br>${(result.current.index)}</td>
                    <td>${(result.next.value)}<br>${(result.next.percentage)}<br>${(result.next.index)}</td>
                    <td>${(result.scope.value)}<br>${(result.scope.percentage)}<br>${(result.scope.index)}</td>

                </tr><tr>
                    <td>${(options.dataViews[0].table.rows[0][0])}</td>
                    <td>${(options.dataViews[0].table.rows[0][1])}</td>
                    <td>${(options.dataViews[0].table.rows[0][2])}</td>
                    <td>${(options.dataViews[0].table.rows[0][3])}</td>

                </tr>
            </tbody>
        </table>
        <p  style="display:block;width:100%;height:80px"><textarea style="display:block;width:100%;height:80px">${(JSON.stringify(options.dataViews[0]))}</textarea></p>`;*/

        /*
         const result = TransformData(options)


        setStyle(this.formattingSettings);

        //this.target.innerHTML = `<p>Result.current.value: <textarea>${(JSON.stringify(result))}</textarea></p>`
        //const pct = result.current.value; //result.value

        const pct = 0.36 // Static value until data binding
        // console.log('result.current.value', JSON.stringify(result.current.value));



        const { width, height } = options.viewport;
        const margin = Visual.margin;
        const chartHeight = (height - margin.top - margin.bottom);
        const chartWidth = width - margin.left - margin.right;
        const fullCircle = Math.PI * 2;
        const r = Math.min(chartWidth, chartHeight) / 2;

        const animationSettings = this.formattingSettings.animationSettingsCard;
        const duration = animationSettings.duration.value;

        this.svg.attr('width', width).attr('height', height)
        this.parentGroup.attr('transform', `translate(${margin.left},${margin.top})`);
        // .innerRadius(r / 1.5)
        const bgArc = arc()

            .innerRadius((r * (80)) / 100)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(fullCircle / 2)
        const progArc = arc()
            .innerRadius((r * (80)) / 100)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(fullCircle / 2)

        this.backgroundArc
            .attr('d', bgArc)
            .attr('transform', `translate(${r}, ${r})`);
        // Attach the progress arc label and the animation
        this.progressArc
            .attr('d', progArc)
            .attr('transform', `translate(${r}, ${r})rotate(-90)`)

            .transition()
            .duration(duration)
            .attrTween('d', () => {
                const minimumInterpValue = 0.4;
                const interp = interpolate(minimumInterpValue, Math.max(fullCircle * pct, minimumInterpValue));
                const interpBasis = interpolateBasis(Array(40).fill(60).concat([0]));
                return (t: number) => {
                    progArc.endAngle(interp(t));
                    if (pct >= 1) {
                        progArc.cornerRadius(interpBasis(t));
                    }
                    return progArc(null);
                };
            });
        // Attach the percentage text label, and the animation for it
        const pctLabel = this.pctLabel
            .attr('x', r)
            .attr('y', r * 1.14 - ((r * 1.14) * 0.10))
            .attr('font-size', r / 2.5)
        pctLabel
            .transition()
            .duration(duration)
            .tween('text', function () {
                return function (t) {
                    pctLabel.text(Math.round((pct * 100) * t) + '%');
                }
            })

        // Attach the design arrow on the top
        this.arrowLabel
            .attr('x', r * 1.18)
            .attr('y', r * 0.25)
            .attr('font-size', r / 4)
            .text('>');

        this.gradient
            .attr("x1", "50%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")
        this.gradient.select('#gradientFirst')
            .attr("offset", "0%");
        this.gradient.select('#gradientSecond')
            .attr("offset", "100%");

*/
    }

    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property. 
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
