Socket requests are namespaced with a route, ex. /play/start-game will be of
the the 'play' portion of the client, and start-game is a functionality of
that.

Files in this folder will be of the namespacing route and all proceeding
routes (functionalities) will be in the file, ex. play.ts contains
`function startGame`.

These will be stored in a enum [Name] {...} to avoid typo errors.
