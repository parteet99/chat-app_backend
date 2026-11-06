import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { corsMiddleware } from "./config/cors";

const app = express();

app.use(helmet());
app.use(corsMiddleware);