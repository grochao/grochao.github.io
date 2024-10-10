import powerbi from "powerbi-visuals-api";
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
type SubDataTypeComparativeValues = {
    label: string;
    value: number;
    percentage: number;
    index: number;
};
export interface VData {
    previous: SubDataTypeComparativeValues;
    current: SubDataTypeComparativeValues;
    next: SubDataTypeComparativeValues;
    scope: SubDataTypeComparativeValues;
}
export declare function TransformData(options: VisualUpdateOptions): VData | null;
export {};
