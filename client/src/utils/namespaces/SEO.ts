import { StaticImageData } from "next/image";

import { TwitterCardTypes, OGCardTypes } from "../enums";

/**
 * Export to ./AppTypes
 */

export interface GeneralMetasData {
    /**
     * Stores the app information.
     * Combination of the core meta tags (things not seen by the client),
     * and things that will be seen by the client.
     */
    title: string;
    keywords: string;
    description: string;
    image: StaticImageData;
    author: string;
}

export interface SocialMediaMetasData {
    // twitter specific
    twitterCard: TwitterCardTypes;
    twitterCompanyUser: string; // make account for website - max 200 chars
    twitterCreatorUser: string; // link my twitter @account

    // og
    type: OGCardTypes;
    url: string;

    // general
    title: string; // max 70 chars
    description: string;
    image: StaticImageData; // .src: max 5mb
}

export interface MappableMetaTagData {
    name: string;
    content: string;
}

export interface MarkingMyselfMetaData {
    name: `my-${string}`;
    content: string;
}

export interface SocialMediaCardData {
    image: StaticImageData;
    alt: string;
    href: string;
}

export function getMappableMetaTags({
    twitterCard,
    twitterCompanyUser,
    twitterCreatorUser,

    type,
    url,

    title,
    description,
    image,
}: SocialMediaMetasData): MappableMetaTagData[] {
    return [
        { name: "twitter:card", content: twitterCard },
        {
            name: "twitter:site",
            content: twitterCompanyUser,
        },
        {
            name: "twitter:creator",
            content: twitterCreatorUser,
        },

        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image.src },

        { name: "og:title", content: title },
        { name: "og:description", content: description },
        { name: "og:image", content: image.src },

        { name: "og:type", content: type },
        { name: "og:url", content: url },
        {
            name: "og:url",
            content: url,
        },
    ];
}
