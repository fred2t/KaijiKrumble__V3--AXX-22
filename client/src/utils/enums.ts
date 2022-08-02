export enum IndexOfReturns {
    /**
     * not found return of Array.prototype.indexOf
     */

    NoValueFound = -1,
}

export enum NodeEnvironments {
    Development = "dev",
    Production = "prod",
}

export enum TwitterCardTypes {
    Summary = "summary",
    SummaryLargeImage = "summary_large_image",
    App = "app",
    Player = "player",
}

export enum OGCardTypes {
    // music
    MusicSong = "music.song",
    MusicAlbum = "music.album",
    MusicPlaylist = "music.playlist",
    MusicRadioStation = "music.radio_station",

    // videos
    VideoMovie = "video.movie",
    VideoEpisode = "video.episode",
    VideoTVShow = "video.tv_show",
    VideoOther = "video.other",

    // no verticals
    Article = "article",
    Book = "book",
    Profile = "profile",
    Website = "website",
}

export enum GameParticipant {
    Client = "client",
    Opponent = "opponent",
    System = "system",
}

export enum KeyDownKeys {
    Alt = "Alt",
    Enter = "Enter",
}

export enum LocalStorageKeys {
    ChatOpen = "chat-open",
    ChatNotificationsOn = "notifications-on",
}

export enum SessionStorageKeys {}

export enum CookieKeys {}
