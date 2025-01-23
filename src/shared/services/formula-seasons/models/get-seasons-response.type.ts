export type GetSeasonsResponse = {
    MRData: {
        offset: number;
        limit: number;
        total: number;
        SeasonTable: {
            Seasons: Array<Season>
        };
    };
};

export type Season = {
    season: string;
    url: string;
};