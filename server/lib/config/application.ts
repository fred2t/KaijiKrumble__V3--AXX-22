import express, { Express } from "express";

export function initializedApplication(): Express {
    const application = express();

    return application;
}
