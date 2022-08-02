import Button from "@mui/material/Button";
import { useRouter } from "next/router";

import { PageRoutes } from "../../settings/clientInstances";

export default function Custom404(): JSX.Element {
    const router = useRouter();

    return (
        <div className="error-page">
            <div>Where are you going, go back to base</div>
            <Button
                variant="contained"
                onClick={() => router.push(PageRoutes.Home)}
            >
                Go Back
            </Button>
        </div>
    );
}
