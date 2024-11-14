import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private WidthDisplay;
    private AllWidthJSON;
    private VarPersistent;
    private dataView;
    private target;
    private updateCount;
    private textNode;
    private previousDataHash;
    private formattingSettings;
    private formattingSettingsService;
    private visualHost;
    private ClickRezise;
    private _TABLE_HTML_;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    /**
     * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
     * This method is called once every time we open properties pane or when the user edit any format property.
     */
    getFormattingModel(): powerbi.visuals.FormattingModel;
    private getAllWidth;
    private calculateHash;
    private ResetColumnsWidth;
    private setColumnWidth;
}
