import Link from "next/link";

import { Elements } from "../../utils/namespaces";

interface Props extends Elements.Div {
    href: string;
    children: React.ReactNode;
    icon: Elements.MUIIcon;
}

function LinkWithIcon({ href, children, icon: Icon, ...otherProps }: Props): JSX.Element {
    const editedClass = `LinkWithIcon ${otherProps.className ?? ""}`;

    return (
        <Link href={href}>
            <div {...{ ...otherProps, className: editedClass }}>
                <Icon />
                {children}
            </div>
        </Link>
    );
}

export default LinkWithIcon;
