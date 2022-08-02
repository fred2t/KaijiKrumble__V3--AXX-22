import Head from "next/head";

import { SEO } from "../../utils/namespaces";

interface Props {
    GENERAL_METAS_DATA: SEO.GeneralMetasData;
}

function GeneralMetas({ GENERAL_METAS_DATA }: Props) {
    return (
        <Head>
            {/* delete when done */}
            <meta name="bruh" content="bruh" />

            <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport" />
            <meta charSet="UTF-8" key="charset" />
            <link rel="icon" href={GENERAL_METAS_DATA.image?.src} key="icon" />
            <title key="title">{GENERAL_METAS_DATA.title}</title>

            <meta name="keywords" content={GENERAL_METAS_DATA.keywords} key="keywords" />
            <meta name="description" content={GENERAL_METAS_DATA.description} key="description" />
            <meta name="author" content={GENERAL_METAS_DATA.author} key="author" />
        </Head>
    );
}

export default GeneralMetas;
