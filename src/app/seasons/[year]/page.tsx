"use client";

import { getSeasonRaces } from "../_services/seasons.service";
import { GetSeasonRacesResponse } from "@/app/seasons/_services/models/get-season-races-response.type";
import { parseIntegerOrDefault } from "@/shared/utils";
import { Text, Button, Loader, Group, Breadcrumbs, Anchor, SegmentedControl, Divider, Pagination } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import styles from "./page.module.scss";
import { RacesInfoView } from "@/app/seasons/[year]/_components/races-info-view/races-info-view.component";
import { RacesCardView } from "@/app/seasons/[year]/_components/races-card-view/races-card-view.component";

export default function SeasonRaces() {

    const params = useParams<{ year: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();

    const viewType = searchParams.get("view") ?? "list";
    const limit = parseIntegerOrDefault(searchParams.get("limit"), 10);
    const offset = parseIntegerOrDefault(searchParams.get("offset"), 0);

    const { data, isLoading, isError } = useQuery<GetSeasonRacesResponse>({
      queryKey: ["season-races", limit, offset, params],
      queryFn: () => getSeasonRaces({ seasonId: params.year, limit, offset }),
    });
  
    const numberOfPages = useMemo(() => Math.ceil((data?.MRData?.total ?? 0) / limit), [limit, data]);
    const currentPage = useMemo(() => (offset / limit) + 1, [limit, offset]);
  
    const onPageChange = useCallback((pageNum: number) => {
      router.push(`/seasons/${params.year}?limit=${limit}&offset=${Math.floor((pageNum - 1) * limit)}&view=${viewType}`);
    }, [router, limit, viewType, params]);
  
    const onChangeViewType = useCallback((type: string) => {
      router.push(`/seasons/${params.year}?limit=${limit}&offset=${Math.floor((currentPage - 1) * limit)}&view=${type}`);
    }, [router, limit, currentPage, params]);
  
    if (isLoading)
      return (
        <div className={styles.preload_races_list_container} data-testid="loader-container">
          <Loader color="white" size="lg" />
        </div>
      );
  
    if (isError)
      return (
        <div className={styles.preload_races_list_container}>
          <Text size="md">An error has occurred.</Text>
          <Button variant="filled" radius="lg">
            Retry
          </Button>
        </div>
      );
  
    return (
      <div>
        <Group justify="space-between">
          <Breadcrumbs>
            <Anchor href="/seasons">Seasons</Anchor>
            <Anchor href={`/seasons/${params.year}`}>{params.year}</Anchor>
          </Breadcrumbs>
  
          <SegmentedControl 
              data-testid="view-control"
              data={[
                  { label: "List View", value: "list" }, 
                  { label: "Card View", value: "grid" }
              ]} 
              value={viewType}
              onChange={onChangeViewType}
          />
        </Group>
  
        <Divider my="md" />
  
        {viewType === "list" && <RacesInfoView year={params.year} races={data?.MRData.RaceTable?.Races} />}
        {viewType === "grid" && <RacesCardView year={params.year} races={data?.MRData.RaceTable?.Races} />}
  
        <Pagination data-testid="navigation" mt="20" value={currentPage} total={numberOfPages} onChange={onPageChange} />
      </div>
    );
}