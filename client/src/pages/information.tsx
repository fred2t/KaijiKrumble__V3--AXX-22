function Coming() {
    return (
        <div className="history-page">
            <h1>Probably coming</h1>
            <ul className="list history-list">
                <li>
                    <span className="cdblue">Currencies</span> - allows gambling in games.
                </li>
                <li>
                    <span className="cdblue">Mute</span> - Block all emotes by opponent.
                </li>
                <li>
                    <span className="cdblue">Bad layout experience</span> - Users of some browsers
                    (Safari) may notice an inconsistent layout. I&apos;ll learn these browser specs
                    and fix them when I get the time.
                </li>
                <li>
                    <span className="cdblue">Create accounts</span>
                </li>
                <li>
                    <span className="cdblue">Reactions</span> - Tag opponents with features like
                    Cheerful or Smart and future opponents will be able to see them.
                </li>
            </ul>

            <h3>Random ideas</h3>
            <ul className="list random-ideas-list">
                <li>
                    <span className="cdblue">Ranking system</span> - Matchmaking will match players
                    with similar stats.
                </li>
                <li>
                    <span className="cdblue">Game spectating</span> - Spectate leaderboard or
                    high-bet games?
                </li>
            </ul>

            <h3>Not happening but thought of</h3>
            <ul className="list wish-list">
                <li>
                    <span className="cdblue">Facecam + voicechat (optional)</span> - Not happening
                    because no money to afford servers or free time <br />
                    <div style={{ all: "initial" }}>lmao</div>
                </li>
            </ul>

            <h3 className="cred">Removed features</h3>
            <h4>**Features are removed for cost and/or headache reasons.</h4>

            <ul></ul>
        </div>
    );
}

export default Coming;
