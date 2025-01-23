import { Season } from "@/shared/services/formula-seasons/models/get-seasons-response.type";
import { ActionIcon, Table } from "@mantine/core";
import { IconLink } from "@tabler/icons-react"
import Link from "next/link";

export function SeasonsInfoView({seasons}: { seasons?: Array<Season> }) {

    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Year</Table.Th>
                <Table.Th>Wikipedia</Table.Th>
            </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
            {
                seasons?.map((s) => (
                    <Table.Tr key={s.season}>
                        <Table.Td>{s.season}</Table.Td>
                        <Table.Td><Link href={s.url}>{s.url}</Link></Table.Td>
                        <Table.Td>
                            <Link href={`/seasons/${s.season}`}>
                                <ActionIcon mt="5">
                                    <IconLink />
                                </ActionIcon >
                            </Link>
                        </Table.Td>
                    </Table.Tr>
                ))
            }
        </Table.Tbody>
    </Table>;
}