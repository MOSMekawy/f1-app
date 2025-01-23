import { Season } from "@/shared/services/formula-seasons/models/get-seasons-response.type";
import { Button, Card, Grid } from "@mantine/core";
import styles from "./seasons-card-view.module.scss";
import Link from "next/link";

export function SeasonsCardView({ seasons }: { seasons?: Array<Season> }) {
    
    return <Grid>
        {
            seasons?.map(s => (
                <Grid.Col key={s.season} span={{ base: 12, md: 6, lg: 3 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                            <Link href={`/seasons/${s.season}`}>
                                <Card.Section p="sm" className={styles.season_card}>
                                    <span>year</span>
                                    <span>{s.season}</span>
                                </Card.Section>
                            </Link>
                            <Link href={s.url}>
                                <Button variant="outline" fullWidth>Visit Wikipedia Page</Button>
                            </Link>
                        </Card>
  
                </Grid.Col>
            ))
        }
    </Grid>
}