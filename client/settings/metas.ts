import { OGCardTypes, TwitterCardTypes } from "../src/utils/enums";
import banner from "../public/images/banner.png";
import { SEO } from "../src/utils/namespaces";

export const appDescription = "Play the E-Card from the anime, Kaiji: Ultimate Survivor.";

export const GENERAL_METAS_DATA: SEO.GeneralMetasData = {
    title: "KaijiKrumble",
    keywords: "kaiji, krumble, kaijikrack, card, game, anime, emotes, social",
    description: appDescription,

    image: banner,
    author: "Fred",
};

export const SOCIAL_MEDIA_METAS_DATA: SEO.SocialMediaMetasData = {
    // twit
    twitterCard: TwitterCardTypes.SummaryLargeImage,
    twitterCompanyUser: "n/a",
    twitterCreatorUser: "n/a",

    // og
    url: "n/a",
    type: OGCardTypes.Website,

    // general
    title: "KaijiKrack",
    description: appDescription,
    image: banner,
};

export const MY_SELF_MARKINGS: SEO.MarkingMyselfMetaData[] = [
    {
        name: "my-message",
        content: "SUp, ",
    },
    {
        name: "my-github",
        content: "https://github.com/khyreek",
    },
    {
        name: "my-linkedin",
        content: "https://www.linkedin.com/in/frederic-tu/",
    },
    { name: "my-professional-email", content: "frederictu.me@gmail.com" },
];
