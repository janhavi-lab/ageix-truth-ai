export {};
export type AnalyzeResult = {
    status: "Fake";
    reason: string[];
    suggestion: string[];
};
export type AnalyzeServiceOutput = {
    inputType: import("../utils/detectInputType").InputType;
    result: AnalyzeResult;
};
//# sourceMappingURL=analyzeService.d.ts.map