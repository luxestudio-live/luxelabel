/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";

import express = require("express");
import path = require("path");
const next = require("next");

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

setGlobalOptions({ maxInstances: 10 });


console.log("[nextjs-fn] Function cold start: initializing Next.js SSR...");
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  dir: path.resolve(__dirname, "../../"), // Point to project root
});
const handle = app.getRequestHandler();

const server = express();




app.prepare().then(() => {
	console.log("[nextjs-fn] Next.js app prepared, setting up request handler...");
	server.use((req: express.Request, res: express.Response) => {
		console.log(`[nextjs-fn] Incoming request: ${req.method} ${req.url}`);
		res.on("finish", () => {
			console.log(`[nextjs-fn] Response: ${req.method} ${req.url} - ${res.statusCode}`);
		});
		return handle(req, res);
	});

	// If running locally or in a container, listen on the provided port
	if (process.env.NODE_ENV !== "production" || process.env.FUNCTION_NAME === undefined) {
		const port = process.env.PORT || 8080;
		server.listen(port, () => {
			console.log(`[nextjs-fn] Server listening on port ${port}`);
		});
	}
	console.log("[nextjs-fn] Express handler ready.");
}).catch((err: unknown) => {
	console.error("[nextjs-fn] Error during Next.js app.prepare:", err);
});

export const nextjs = onRequest({ maxInstances: 10 }, server);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
