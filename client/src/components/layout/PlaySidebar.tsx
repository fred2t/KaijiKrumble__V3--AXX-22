import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import { useRef } from "react";

import { PageRoutes } from "../../../settings/clientInstances";
import TemporaryDrawer from "../flexible/TemporaryDrawer";
import { DrawerItem } from "../../types/utility";

interface SidebarProps {}

function Sidebar({}: SidebarProps): JSX.Element {
    const router = useRouter();

    const drawerItems = useRef<DrawerItem[]>([
        {
            text: "Home",
            icon: HomeIcon,
            onClick: function () {
                router.push(PageRoutes.Home);
            },
        },
        {
            text: "Information",
            icon: UpcomingIcon,
            onClick: function () {
                router.push(PageRoutes.Information);
            },
        },
        {
            text: "Contact",
            icon: ContactPageIcon,
            onClick: function () {
                router.push(PageRoutes.Contact);
            },
        },
    ]);

    return (
        <div className="app-sidebar">
            <TemporaryDrawer drawerItems={drawerItems.current} />
        </div>
    );
}

export default Sidebar;
