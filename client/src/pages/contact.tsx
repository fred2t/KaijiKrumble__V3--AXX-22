import Button from "@mui/material/Button";

interface Props {}

function Contact({}: Props): JSX.Element {
    return (
        <div className="contact-page">
            <Button variant="contained">
                <a href="mailto:kaijikrumble@gmail.com" className="email-link">
                    Send an email over
                </a>
            </Button>
        </div>
    );
}

export default Contact;
