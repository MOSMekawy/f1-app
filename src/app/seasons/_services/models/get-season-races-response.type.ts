export type GetSeasonRacesResponse = {
    MRData: {
        limit: number;
        offset: number;
        total: number;
        RaceTable: {
            season: string,
            Races: Array<Race>
        }
    };
};

export type Race = {
    season: string;
    round: string;
    url: string;
    raceName: string;
    Circuit: {
        circuitId: string;
        url: string;
        circuitName: string;
        Location: {
            lat: string;
            long: string;
            locality: string;
            country: string;
        }
    },
    date: string;
};