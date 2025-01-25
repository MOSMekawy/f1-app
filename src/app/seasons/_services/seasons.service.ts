import { baseUrl } from "@/environment";
import { GetSeasonsResponse } from "./models/get-seasons-response.type";
import { GetSeasonRacesResponse } from "./models/get-season-races-response.type";
import { GetSeasonRaceDetailsResponse } from "./models/get-season-race-details-response.type";
import axios from 'axios';

export async function getSeasons({ limit, offset }: {
    limit?: number,
    offset?: number
}): Promise<GetSeasonsResponse> {

    const params = new URLSearchParams([
        ["limit", limit?.toString() ?? "0"],
        ["offset", offset?.toString() ?? "0"]
    ]);

    const response = await axios.get<GetSeasonsResponse>(`${baseUrl}/api/f1/seasons.json`, { params });

    return response.data;
}

export async function getSeasonRaces({ seasonId, limit, offset }: { 
    seasonId: string, 
    limit: number, 
    offset: number 
}): Promise<GetSeasonRacesResponse> {
    const params = new URLSearchParams([
        ["limit", limit?.toString() ?? "0"],
        ["offset", offset?.toString() ?? "0"]
    ]);

    const response = await axios.get<GetSeasonRacesResponse>(`${baseUrl}/api/f1/${seasonId}/races.json`, { params });

    return response.data;
}

export async function getSeasonRaceDetails({ seasonId, round }: {
    seasonId: string,
    round: string
}): Promise<GetSeasonRaceDetailsResponse> {
    const response = await axios.get<GetSeasonRaceDetailsResponse>(`${baseUrl}/api/f1/${seasonId}/${round}/results.json?limit=100`);

    return response.data;
}