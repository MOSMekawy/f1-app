import { Environment } from "@/environment";
import { GetSeasonsResponse } from "./models/get-seasons-response.type";
import axios from 'axios';
import { GetSeasonRacesResponse } from "./models/get-season-races-response.type";

export async function getSeasons({ limit, offset }: {
    limit?: number,
    offset?: number
}): Promise<GetSeasonsResponse> {

    const params = new URLSearchParams([
        ["limit", limit?.toString() ?? "0"],
        ["offset", offset?.toString() ?? "0"]
    ]);

    const response = await axios.get<GetSeasonsResponse>(`${Environment.baseUrl}/api/f1/seasons.json`, { params });

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

    const response = await axios.get<GetSeasonRacesResponse>(`${Environment.baseUrl}/api/f1/${seasonId}/races.json`, { params });

    return response.data;
}