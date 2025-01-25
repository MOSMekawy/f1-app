import { Season } from "@/app/seasons/_services/models/get-seasons-response.type";
import { Anchor, Table } from "@mantine/core";

export function SeasonsInfoView({seasons}: { seasons?: Array<Season> }) {

    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Season</Table.Th>
            </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
            {
                seasons?.map((s) => (
                    <Table.Tr key={s.season}>
                        <Table.Td>                            
                            <Anchor href={`/seasons/${s.season}`}>{s.season}</Anchor>
                        </Table.Td>
                    </Table.Tr>
                ))
            }
        </Table.Tbody>
    </Table>;
}