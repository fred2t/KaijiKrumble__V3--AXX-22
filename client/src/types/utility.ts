import { Elements } from "../utils/namespaces";

interface ClientBuildSettings {
    BASE_URL: string;
    WS_BASE_URL: string;
}

interface DrawerItem {
    text: string;
    icon: Elements.MUIIcon;
    onClick: () => void;
}

export type { ClientBuildSettings, DrawerItem };
