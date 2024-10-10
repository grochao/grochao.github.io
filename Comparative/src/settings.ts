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

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
/*class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Default color",
        value: { value: "" }
    });

    showAllDataPoints = new formattingSettings.ToggleSwitch({
        name: "showAllDataPoints",
        displayName: "Show all",
        value: true
    });

    fill = new formattingSettings.ColorPicker({
        name: "fill",
        displayName: "Fill",
        value: { value: "" }
    });

    fillRule = new formattingSettings.ColorPicker({
        name: "fillRule",
        displayName: "Color saturation",
        value: { value: "" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 12
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.defaultColor, this.showAllDataPoints, this.fill, this.fillRule, this.fontSize];
}
*/
/**
* visual settings model class
*
*/

/*
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    dataPointCard = new DataPointCardSettings();

    cards = [this.dataPointCard];
}*/

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    colorSettingsCard = new ColorSettings();
    animationSettingsCard = new AnimationSettings();
    cards = [this.colorSettingsCard, this.animationSettingsCard];
}
/* ===================================================== */
class ColorSettings extends FormattingSettingsCard {
    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font color",
        value: { value: "black" }
    });

    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily",
        displayName: "Font style",
        value: 'Segoe UI Light'
    });

    gradiantColorFirst = new formattingSettings.ColorPicker({
        name: "gradiantColorFirst",
        displayName: "Gradient first color",
        value: { value: "#025d93" }
    });

    gradiantColorSecond = new formattingSettings.ColorPicker({
        name: "gradiantColorSecond",
        displayName: "Gradient second color",
        value: { value: "#86f4ee" }
    });

    arrowColor = new formattingSettings.ColorPicker({
        name: "arrowColor",
        displayName: "Arrow color",
        value: { value: "black" }
    });

    name: string = "colorSettings";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.fontColor, this.fontFamily, this.gradiantColorFirst, this.gradiantColorSecond, this.arrowColor];

}

class AnimationSettings extends FormattingSettingsCard {
    duration = new formattingSettings.NumUpDown({
        name: "duration",
        displayName: "Animation duration",
        value: 1000
    });

    name: string = "animationSettings";
    displayName: string = "Animation";
    slices: Array<FormattingSettingsSlice> = [this.duration];
}
