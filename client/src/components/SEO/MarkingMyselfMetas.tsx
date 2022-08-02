import { SEO } from "../../utils/namespaces";

import SocialMediaMetaTag from "./SocialMediaMetaTag";

interface Props {
    selfMarkingsData: SEO.MarkingMyselfMetaData[];
}

function MarkingMyselfMetas({ selfMarkingsData }: Props): JSX.Element {
    return (
        <div>
            {selfMarkingsData.map((selfMarkingMetaData) => (
                <SocialMediaMetaTag
                    key={selfMarkingMetaData.name}
                    name={selfMarkingMetaData.name}
                    content={selfMarkingMetaData.content}
                />
            ))}
        </div>
    );
}

export default MarkingMyselfMetas;
