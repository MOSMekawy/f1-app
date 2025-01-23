import Image from "next/image";
import styles from "./app-layout.module.scss";
import { Card } from "@mantine/core";

export function AppLayout({ children }: {
    children: React.ReactNode
}) {

    return <div className={styles.app_layout}>
        <div className={styles.heading}>
            <Image src="/chequered-flag.png" alt="chequered flag" width="120" height="120" />
            F1 Application
        </div>
        <Card className={styles.content_card} shadow="sm" padding="lg" radius="md" withBorder>
            {children}
        </Card>
    </div>;
}