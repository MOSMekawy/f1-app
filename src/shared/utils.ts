export const parseIntegerOrDefault = (param: string | null, defaultVal: number) => {
    if (param && !isNaN(+param)) return parseInt(param);
    return defaultVal;
};