"use client";

import { getSeasons } from "./_services/seasons.service";
import { GetSeasonsResponse } from "@/app/seasons/_services/models/get-seasons-response.type";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Divider,
  Group,
  Loader,
  Pagination,
  SegmentedControl,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { Text } from "@mantine/core";
import styles from "./page.module.scss";
import { useCallback, useMemo } from "react";
import { parseIntegerOrDefault } from "../../shared/utils";
import { SeasonsInfoView } from './_components/seasons-info-view/seasons-info-view.component';
import { SeasonsCardView } from './_components/seasons-card-view/seasons-card-view.component';



export default function Seasons() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewType = searchParams.get("view") ?? "list";
  const limit = parseIntegerOrDefault(searchParams.get("limit"), 10);
  const offset = parseIntegerOrDefault(searchParams.get("offset"), 0);

  const { data, isLoading, isError } = useQuery<GetSeasonsResponse>({
    queryKey: ["seasons", limit, offset],
    queryFn: () => getSeasons({ limit, offset }),
    retry: 5
  });

  const numberOfPages = useMemo(() => Math.ceil((data?.MRData?.total ?? 0) / limit), [limit, data]);
  const currentPage = useMemo(() => (offset / limit) + 1, [limit, offset]);

  const onPageChange = useCallback((pageNum: number) => {
    router.push(`/seasons?limit=${limit}&offset=${Math.floor((pageNum - 1) * limit)}&view=${viewType}`);
  }, [router, limit, viewType]);

  const onChangeViewType = useCallback((type: string) => {
    router.push(`/seasons?limit=${limit}&offset=${Math.floor((currentPage - 1) * limit)}&view=${type}`);
  }, [limit, currentPage, router]);

  if (isLoading)
    return (
      <div className={styles.preload_seasons_list_container} data-testid="loader-container">
        <Loader color="white" size="lg" />
      </div>
    );

  if (isError)
    return (
      <div className={styles.preload_seasons_list_container}>
        <Text size="md">An error has occurred.</Text>
        <Button variant="filled" radius="lg">
          Retry
        </Button>
      </div>
    );

  return (
    <div className={styles.seasons_list_container}>
      <Group justify="space-between">
        <Breadcrumbs>
          <Anchor href="/seasons">Seasons</Anchor>
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

      {viewType === "grid" && <SeasonsCardView seasons={data?.MRData.SeasonTable?.Seasons} />}
      {viewType === "list" && <SeasonsInfoView seasons={data?.MRData.SeasonTable?.Seasons} />}

      <Pagination data-testid="navigation" mt="20" value={currentPage} total={numberOfPages} onChange={onPageChange} />
    </div>
  );
}
