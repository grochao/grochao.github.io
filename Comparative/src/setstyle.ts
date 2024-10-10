"use strict";

import { VisualFormattingSettingsModel } from "./settings";

export function setStyle(s: VisualFormattingSettingsModel): void {
    const style = document.documentElement.style
    style.setProperty('--fontColor', s.colorSettingsCard.fontColor.value.value)
    style.setProperty('--fontFamily', s.colorSettingsCard.fontFamily.value)
    style.setProperty('--arrowColor', s.colorSettingsCard.arrowColor.value.value)
    style.setProperty('--gradiantColorFirst', s.colorSettingsCard.gradiantColorFirst.value.value)
    style.setProperty('--gradiantColorSecond', s.colorSettingsCard.gradiantColorSecond.value.value)
}