import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface Props extends CircularProgressProps {
    value: number;
}

function CircularProgressWithLabel({ value, ...other }: Props): JSX.Element {
    const limitedValue = Math.min(value, 100);

    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress variant="determinate" {...{ ...other, value: limitedValue }} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">{`${Math.round(
                    value
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default CircularProgressWithLabel;
