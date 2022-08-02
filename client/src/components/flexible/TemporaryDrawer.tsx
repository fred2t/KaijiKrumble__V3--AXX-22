import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { DrawerItem } from "../../types/utility";

interface TemporaryDrawerProps {
    drawerItems: DrawerItem[];
}

function TemporaryDrawer({ drawerItems }: TemporaryDrawerProps): JSX.Element {
    const [anchorOpen, setAnchorOpen] = useState(false);

    const toggleDrawer = (newStatus: boolean) => {
        return () => setAnchorOpen(newStatus);
    };

    return (
        <div className="banner-icon">
            <Button variant="contained" onClick={toggleDrawer(true)}>
                <MenuIcon />
            </Button>

            <Drawer
                className="play-drawer"
                anchor={"left"}
                open={anchorOpen}
                onClose={toggleDrawer(false)}
                onMouseLeave={toggleDrawer(false)}
            >
                <List className="anchor-list">
                    {drawerItems.map(
                        // rename the component to react node and take the rest of the props separately
                        ({ icon: DrawerItemIcon, ...drawerItem }) => (
                            <ListItem key={drawerItem.text} button onClick={drawerItem.onClick}>
                                <ListItemIcon>
                                    <DrawerItemIcon />
                                </ListItemIcon>
                                <ListItemText primary={drawerItem.text} />
                            </ListItem>
                        )
                    )}
                </List>
                <Divider />
            </Drawer>
        </div>
    );
}

export default TemporaryDrawer;
