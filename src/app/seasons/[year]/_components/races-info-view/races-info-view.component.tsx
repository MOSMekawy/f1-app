import { usePinItem } from "@/shared/hooks/use-pin-item/use-pin-item";
import { Race } from "@/app/seasons/_services/models/get-season-races-response.type";
import { Anchor, Switch, Table } from "@mantine/core";
import { pinnedRacesLocalStoragePrefix } from "@/environment";

export function RacesInfoView({
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
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Race Name</Table.Th>
          <Table.Th>Circuit Name</Table.Th>
          <Table.Th>Date</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {formattedRaces?.map((r, i) => (
          <Table.Tr key={r.raceName}>
            <Table.Td>
              <Anchor href={`/seasons/${r.season}/races/${r.round}`}>
                {r.raceName}
              </Anchor>
            </Table.Td>
            <Table.Td>{r.Circuit.circuitName}</Table.Td>
            <Table.Td>
              {new Date(r.date).toLocaleString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </Table.Td>

            <Table.Td>
              <Switch
                checked={r.isPinned}
                onChange={() => onPinRace(i)}
                label="pinned"
              ></Switch>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
