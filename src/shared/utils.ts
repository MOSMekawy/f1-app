export const parseInteger = (param: string | null) => {
    if (param && !isNaN(+param)) return parseInt(param);
    return 0;
};