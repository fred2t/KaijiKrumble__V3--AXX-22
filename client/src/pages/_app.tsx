import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Provider } from "react-redux";

import { PageRoutes } from "../../settings/clientInstances";
import {
    GENERAL_METAS_DATA,
    MY_SELF_MARKINGS,
    SOCIAL_MEDIA_METAS_DATA,
} from "../../settings/metas";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import GeneralMetas from "../components/SEO/GeneralMetas";
import MarkingMyselfMetas from "../components/SEO/MarkingMyselfMetas";
import SocialMediaMetas from "../components/SEO/SocialMediaMetas";
import InitializeApp from "../zstartup";
import store from "../redux/store";
import "../styles/app.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
    const routesWithoutHeader = [PageRoutes.Play];
    const router = useRouter();

    return (
        <Provider store={store}>
            <InitializeApp />

            <div className="app">
                {/* SEO */}
                <GeneralMetas GENERAL_METAS_DATA={GENERAL_METAS_DATA} />
                <SocialMediaMetas socialMediaMetasData={SOCIAL_MEDIA_METAS_DATA} />
                <MarkingMyselfMetas selfMarkingsData={MY_SELF_MARKINGS} />

                {/* page */}
                {!routesWithoutHeader.includes(router.pathname as PageRoutes) && (
                    <>
                        <Header />
                        <div className="section-separator header-separator"></div>
                    </>
                )}
                <Component {...pageProps} />
                <Footer />
            </div>
        </Provider>
    );
}
