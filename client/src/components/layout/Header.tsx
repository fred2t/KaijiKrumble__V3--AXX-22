import { useRouter } from "next/router";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";

import img from "../../../public/images/banner.png";
import LinkWithIcon from "../flexible/LinkWithIcon";
import { PageRoutes } from "../../../settings/clientInstances";
import { GENERAL_METAS_DATA } from "../../../settings/metas";

interface Props {}

function Header({}: Props): JSX.Element {
    const router = useRouter();

    return (
        <header className="app-header">
            <div className="app-logo" onClick={() => router.push(PageRoutes.Home)}>
                <img className="banner" src={img.src} alt="KaijiKrack banner" />
                <div className="text">{GENERAL_METAS_DATA.title}</div>
            </div>

            <nav className="page-navigator">
                <section className="layer">
                    <LinkWithIcon href={PageRoutes.Information} icon={InfoIcon}>
                        Information
                    </LinkWithIcon>
                    <LinkWithIcon href={PageRoutes.Contact} icon={ContactPageIcon}>
                        Contact
                    </LinkWithIcon>
                </section>
            </nav>
        </header>
    );
}

export default Header;
