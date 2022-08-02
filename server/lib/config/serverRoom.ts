/**
 * Server and state management outside of index.ts to avoid circular importing.
 *
 * There will be methods to manage the rooms that index.ts may import in the
 * future.
 */

import KaijiController from "../classes/KaijiController";

import { initializedApplication } from "./application";
import { initializedServer } from "./server";
import { initializedWebSocketServer } from "./webSocketServer";

export const application = initializedApplication();
export const server = initializedServer({}, application);
export const wss = initializedWebSocketServer({ server });

// state
export const kaijiController = new KaijiController({ rooms: [] });
