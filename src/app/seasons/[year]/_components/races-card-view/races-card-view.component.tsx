import { Race } from "@/app/seasons/_services/models/get-season-races-response.type";
import { Card, Divider, Grid, Group, Switch } from "@mantine/core";
import Link from "next/link";
import styles from "./races-card-view.module.scss";
import { usePinItem } from "@/shared/hooks/use-pin-item/use-pin-item";
import { pinnedRacesLocalStoragePrefix } from "@/environment";

export function RacesCardView({
  races,
  year,
}: {
  races?: Array<Race>;
  year: string;
}) {
  const [formattedRaces, onPinRace] = usePinItem({
    items: races,
    localStorageKey: `${pinnedRacesLocalStoragePrefix}-${year}`,
    keySelectorFn: (race) => race.raceName,
    sortFn: (raceA, raceB) =>
      new Date(raceA.date).getMilliseconds() -
      new Date(raceB.date).getMilliseconds(),
  });

  return (
    <Grid>
      {formattedRaces?.map((r, i) => (
        <Grid.Col key={r.raceName} span={{ base: 12, md: 6, lg: 3 }}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className={styles.races_card}
          >
            <Switch
              checked={r.isPinned}
              onChange={() => onPinRace(i)}
              label="pinned"
            ></Switch>
            <Link href={`/seasons/${r.season}/races/${r.round}`}>
              <span className={styles.race_name}>{r.raceName}</span>
            </Link>
            <div>
              <Divider />
              <Group mt="sm" justify="space-between">
                <span>
                  <b>Circuit:</b> {r.Circuit.circuitName}
                </span>
                <span>
                  {new Date(r.date).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                  })}
                </span>
              </Group>
            </div>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}
