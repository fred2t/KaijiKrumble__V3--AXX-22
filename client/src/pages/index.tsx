import { Button } from "@mui/material";
import { useRouter } from "next/router";

import emperorCard from "../../public/images/emperor-card.png";
import citizenCard from "../../public/images/citizen-card.png";
import slaveCard from "../../public/images/slave-card.png";
import redX from "../../public/images/redX.png";
import startingHands from "../../public/images/starting-hands.png";
import rotateIcon from "../../public/images/rotate-icon.png";
import { PageRoutes } from "../../settings/clientInstances";
import { Kaiji } from "../utils/namespaces";
import { useAppSelector } from "../redux/hooks";
import { addTransition } from "../utils/namespaces/Aesthetics";

interface Props {}

function Home({}: Props): JSX.Element {
    const router = useRouter();
    const { transitionController } = useAppSelector((s) => s.aesthetic);

    return (
        <div>
            <section className="section section-one">
                <div className="game-explanation-container">
                    <ul className="card card-1" ref={addTransition(transitionController, "r")}>
                        <li>The three playable cards are: Emperor, Citizen, and Slave</li>

                        <div className="card-images">
                            <img src={emperorCard.src} alt="emperor card" />
                            <img src={citizenCard.src} alt="citizen card" />
                            <img src={slaveCard.src} alt="slave card" />
                        </div>

                        <li>Hands will start with 4 citizens, and an emperor or slave</li>

                        <img
                            src={startingHands.src}
                            alt="starting hands"
                            className="starting-hands"
                        />
                    </ul>

                    <div className="card card-2" ref={addTransition(transitionController, "t")}>
                        <div className="rule">
                            <div className="visual-helper">
                                <img src={emperorCard.src} alt="emperor card" />
                                <img src={redX.src} alt="crossing out X symbol" className="red-x" />
                                <img src={citizenCard.src} alt="citizen card" />
                            </div>
                            <div>King beats citizen</div>
                        </div>

                        <div className="rule">
                            <div className="visual-helper">
                                <img src={citizenCard.src} alt="citizen card" />
                                <img src={redX.src} alt="crossing out X symbol" className="red-x" />
                                <img src={slaveCard.src} alt="slave card" />
                            </div>
                            <div>citizen beats slave</div>
                        </div>

                        <div className="rule">
                            <div className="visual-helper">
                                <img src={slaveCard.src} alt="slave card" />
                                <img src={redX.src} alt="crossing out X symbol" className="red-x" />
                                <img src={emperorCard.src} alt="emperor card" />
                            </div>
                            <div>Slave beats emperor</div>
                            <div>(They have nothing to lose)</div>
                        </div>
                    </div>

                    <ul className="card card-3" ref={addTransition(transitionController, "l")}>
                        <li>
                            Wins with <span className="k-emperor">emperor</span> or{" "}
                            <span className="k-citizen">citizen</span> gain{" "}
                            <span className="cred">{Kaiji.CARD_WIN_POINTS.Emperor}</span> point, and
                            wins with the <span className="k-slave">slave</span> hand gain{" "}
                            <span className="cgreen">{Kaiji.CARD_WIN_POINTS.Slave}</span> points
                        </li>
                        <li>
                            First to <span className="ddred">{Kaiji.POINTS_TO_WIN}</span> wins the
                            game
                        </li>
                        <li>Starting hands alternate after each round</li>

                        {/* div created to center image and not the <li> */}
                        <div className="rotate-icon-container">
                            <img src={rotateIcon.src} alt="rotating icon" className="rotate-icon" />
                        </div>
                    </ul>
                </div>

                <div className="play-button-container">
                    <Button
                        variant="contained"
                        className="play-button"
                        onClick={() => router.push(PageRoutes.Play)}
                    >
                        Play Now
                    </Button>
                </div>
            </section>
            <div className="section-separator separator-1"></div>

            <section className="section section-two">
                <h1 ref={addTransition(transitionController, "t")}>
                    If you want to contact me, you&apos;ll find an email at the header.
                </h1>
                {/* <div ref={addTransition(transitionController, "t")}>
                    Want to play in real life? These links will guide you to a purchasable set. Yes,
                    I do get paid a bit if you make a purchase from this link 🙏.
                </div>

                <div className="purchase-links"> </div> */}
            </section>
            <div className="section-separator separator-2"></div>

            <section className="section section-three">
                <h1>Credits</h1>
                <p className="credits-message" ref={addTransition(transitionController, "r")}>
                    This origin of this game comes from the anime, Kaiji: Ultimate Survivor. Kaiji
                    is a Japanese anime television series, based on Gambling Apocalypse: Kaiji, the
                    first part of the manga series Kaiji, written and illustrated by Nobuyuki
                    Fukumoto. Produced by Nippon Television, D.N. Dream Partners, VAP and Madhouse,
                    the series was directed by Yuzo Sato, with Hideo Takayashiki handling series
                    composition, Haruhito Takada designing the characters and Hideki Taniuchi
                    composing the music. The story centers on Kaiji Itō, an impoverished young man,
                    and his misadventures around gambling. **I am not the original creator of this
                    game.
                </p>
                <a href="https://en.wikipedia.org/wiki/Kaiji:_Ultimate_Survivor">Read more.</a>

                <h1>Notice</h1>
                <p className="large notice-message" ref={addTransition(transitionController, "l")}>
                    The game may be far from an identical match to the one found in anime which was
                    done for the sake of simplifying user experience.
                </p>

                <h1>Author note</h1>
                <div className="large" ref={addTransition(transitionController, "r")}>
                    Sup.
                </div>
            </section>

            <div className="section-separator last-section-separator"></div>
        </div>
    );
}

export default Home;
