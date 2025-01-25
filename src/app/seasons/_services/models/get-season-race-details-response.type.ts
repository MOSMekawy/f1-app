import { Race } from "./get-season-races-response.type";

export type GetSeasonRaceDetailsResponse = {
    MRData: {
        RaceTable: {
            season: string;
            round: string;
            Races: Array<RaceWithResults>
        }
    }
};

export type RaceWithResults = Race & { Results: Array<RaceResult> };

export type RaceResult = {
    number: string;
    position: string;
    positionText: string;
    points: string;
    Driver: {
        driverId: string;
        url: string;
        givenName: string;
        familyName: string;
        dateOfBirth: string;
        nationality: string;
    }
    Constructor: {
        constructorId: string;
        url: string;
        name: string;
        nationality: string;
    }
    grid: string;
    laps: string;
    status: string;
    Time?: {
        millis: string;
        time: string;
    }
};