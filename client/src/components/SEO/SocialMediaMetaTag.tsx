import { Elements } from "../../utils/namespaces";

interface Props extends Elements.Meta {}

function SocialMediaMetaTag({ name, content, ...rest }: Props): JSX.Element {
    /**
     * This component forces 'name' and 'content' props to be defined.
     */

    return <meta name={name} content={content} {...rest} />;
}

export default SocialMediaMetaTag;
