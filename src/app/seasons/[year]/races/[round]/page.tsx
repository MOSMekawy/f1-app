"use client";

import { GetSeasonRaceDetailsResponse } from "../../../_services/models/get-season-race-details-response.type";
import { getSeasonRaceDetails } from "../../../_services/seasons.service";
import {
  Anchor,
  Breadcrumbs,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import styles from "./page.module.scss";
import { useMemo } from "react";
import { BarChart } from "@mantine/charts";
import { IconSearch } from "@tabler/icons-react";
import { useDebouncedState } from "@mantine/hooks";

export default function RaceView() {
  const params = useParams<{ year: string; round: string }>();

  const { data, isLoading, isError } = useQuery<GetSeasonRaceDetailsResponse>({
    queryKey: ["season-races", params],
    queryFn: () =>
      getSeasonRaceDetails({ seasonId: params.year, round: params.round }),
  });

  const [searchTerm, setSearchTerm] = useDebouncedState("", 500);

  const highlightedDriversSet = useMemo(() => {
    const set = new Set();

    const matchingRegex = new RegExp(searchTerm, "i");

    if (searchTerm.length)
      data?.MRData?.RaceTable?.Races?.at(0)?.Results?.forEach((r) => {
        const isMatch = matchingRegex.test(
          `${r.Driver.givenName} ${r.Driver.familyName}`
        );
        if (isMatch) set.add(`${r.number}-${r.Driver.driverId}`);
      });

    return set;
  }, [data, searchTerm]);

  const graphData = useMemo(
    () =>
      data?.MRData?.RaceTable.Races.at(0)?.Results.map((r) => ({
        driverId: `#${r.number} ${r.Driver.driverId}`,
        time: r.Time?.millis ? parseInt(r.Time.millis) / 6e4 : "N/A",
        laps: parseInt(r.laps),
        status: r.status,
      })) ?? [],
    [data]
  );

  if (isLoading)
    return (
      <div
        className={styles.preload_race_details_container}
        data-testid="loader-container"
      >
        <Loader color="white" size="lg" />
      </div>
    );

  if (isError)
    return (
      <div className={styles.preload_race_details_container}>
        <Text size="md">An error has occurred.</Text>
      </div>
    );

  return (
    <div className={styles.race_details_container}>
      <Group justify="space-between" mb="md">
        <Breadcrumbs>
          <Anchor href="/seasons">Seasons</Anchor>
          <Anchor href={`/seasons/${params.year}`}>{params.year}</Anchor>
          <Anchor href={`/seasons/${params.year}`}>Races</Anchor>
          <Anchor href={`/seasons/${params.year}/races/${params.round}`}>
            {params.round}
          </Anchor>
        </Breadcrumbs>

        <TextInput
          placeholder="Search by driver's name"
          size="xs"
          leftSection={<IconSearch size={12} stroke={1.5} />}
          rightSectionWidth={70}
          styles={{ section: { pointerEvents: "none" } }}
          onChange={(ev) => setSearchTerm(ev.target.value)}
          mb="sm"
        />
      </Group>

      <Grid>
        {data?.MRData.RaceTable.Races.at(0)?.Results?.map((r) => (
          <Grid.Col
            key={`${r.number}-${r.Driver.driverId}`}
            span={{ base: 12, md: 6, lg: 3 }}
          >
            <Card
              data-testid="driver-card"
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className={styles.driver_card}
            >
              <div>
                <span>#{r.position}</span>
                <span
                  className={
                    highlightedDriversSet.has(
                      `${r.number}-${r.Driver.driverId}`
                    )
                      ? styles.highlighted_driver_name
                      : ""
                  }
                >
                  {`${r.Driver.givenName} ${r.Driver.familyName}`}
                </span>
              </div>
              <div>
                <Divider mt="sm" mb="md" />
                <Group justify="space-between">
                  <p>
                    <b>{r.Constructor.name}</b>
                  </p>
                  <p data-testid="nationality">
                    <b>Nationality:</b> {r.Driver.nationality}
                  </p>
                </Group>
              </div>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Divider mt="md" mb="md" />

      <div className={styles.driver_performance_section_title}>
        Drivers Performances
      </div>

      <Card shadow="sm" padding="lg" mb="lg" radius="md" withBorder>
        <BarChart
          h={800}
          data={graphData}
          barProps={{ radius: 10 }}
          dataKey="driverId"
          orientation="vertical"
          series={[
            { name: "time", color: "green" },
            { name: "laps", color: "darkgray" },
          ]}
        ></BarChart>
      </Card>
    </div>
  );
}
