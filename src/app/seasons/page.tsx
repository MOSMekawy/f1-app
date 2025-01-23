"use client";

import { getSeasons } from "@/shared/services/formula-seasons/formula-seasons.service";
import { GetSeasonsResponse } from "@/shared/services/formula-seasons/models/get-seasons-response.type";
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
import { SeasonsInfoView } from "@/shared/components/seasons/seasons-info-view/seasons-info-view.component";
import { useCallback, useMemo } from "react";
import { SeasonsCardView } from "@/shared/components/seasons/seasons-card-view/seasons-card-view.component";
import { parseInteger } from "@/shared/utils";



export default function Seasons() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewType = searchParams.get("view") ?? "list";
  const limit = parseInteger(searchParams.get("limit") ?? "10");
  const offset = parseInteger(searchParams.get("offset"));

  const { data, isLoading, isError } = useQuery<GetSeasonsResponse>({
    queryKey: ["seasons", limit, offset],
    queryFn: () => getSeasons({ limit, offset }),
  });

  const numberOfPages = useMemo(() => Math.ceil((data?.MRData?.total ?? 0) / limit), [limit, data]);
  const currentPage = useMemo(() => (offset / limit) + 1, [limit, offset]);

  const onPageChange = useCallback((pageNum: number) => {
    router.push(`/seasons?limit=${limit}&offset=${Math.floor((pageNum - 1) * limit)}&view=${viewType}`);
  }, [router, limit]);

  const onChangeViewType = useCallback((type: string) => {
    router.push(`/seasons?limit=${limit}&offset=${Math.floor((currentPage - 1) * limit)}&view=${type}`);
  }, []);

  if (isLoading)
    return (
      <div className={styles.preload_seasons_list_container}>
        <Loader color="white" size="lg" />
      </div>
    );

  if (isError)
    return (
      <div className={styles.preload_seasons_list_container}>
        <Text size="md">An error has occured.</Text>
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
            data={[
                { label: "List View", value: "list" }, 
                { label: "Card View", value: "card" }
            ]} 
            value={viewType}
            onChange={onChangeViewType}
        />
      </Group>

      <Divider my="md" />

      {viewType === "card" && <SeasonsCardView seasons={data?.MRData.SeasonTable?.Seasons} />}
      {viewType === "list" && <SeasonsInfoView seasons={data?.MRData.SeasonTable?.Seasons} />}

      <Pagination mt="20" value={currentPage} total={numberOfPages} onChange={onPageChange} />
    </div>
  );
}
