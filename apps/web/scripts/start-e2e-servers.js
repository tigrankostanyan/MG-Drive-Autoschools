import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const serverDir = path.resolve(root, "..", "server");

const apiReady = pollPort("http://localhost:3300/api/v1/user/csrf-token", 30000, 500);
const webReady = pollPort("http://localhost:3000/", 30000, 500);

let apiProcess = null;
let webProcess = null;
let shuttingDown = false;

function log(prefix, msg) {
	console.log(`[${prefix}] ${msg}`);
}

function startApi() {
	return new Promise((resolve, reject) => {
		const env = { ...process.env, NODE_ENV: process.env.NODE_ENV || "test" };
		log("api", "starting Express server...");
		apiProcess = spawn("node", ["app.js"], {
			cwd: serverDir,
			env,
			stdio: ["pipe", "pipe", "pipe"],
		});

		apiProcess.stdout.on("data", (data) => log("api", data.toString().trim()));
		apiProcess.stderr.on("data", (data) => log("api", data.toString().trim()));

		apiProcess.on("error", (err) => {
			log("api", `failed to start: ${err.message}`);
			reject(err);
		});

		apiProcess.on("exit", (code) => {
			if (!shuttingDown) {
				log("api", `exited with code ${code}`);
				reject(new Error(`API server exited with code ${code}`));
			}
		});

		apiReady
			.wait()
			.then(() => {
				log("api", "server is ready");
				resolve();
			})
			.catch((err) => reject(err));
	});
}

function startWeb() {
	return new Promise((resolve, reject) => {
		const env = {
			...process.env,
			API_URL: "http://localhost:3300",
		};
		log("web", "starting web app (vite preview)...");
		webProcess = spawn("npx", ["vite", "preview", "--port", "3000", "--host"], {
			cwd: root,
			env,
			stdio: ["pipe", "pipe", "pipe"],
			shell: process.platform === "win32",
		});

		webProcess.stdout.on("data", (data) => log("web", data.toString().trim()));
		webProcess.stderr.on("data", (data) => log("web", data.toString().trim()));

		webProcess.on("error", (err) => {
			log("web", `failed to start: ${err.message}`);
			reject(err);
		});

		webProcess.on("exit", (code) => {
			if (!shuttingDown) {
				log("web", `exited with code ${code}`);
				reject(new Error(`Web server exited with code ${code}`));
			}
		});

		webReady
			.wait()
			.then(() => {
				log("web", "server is ready");
				resolve();
			})
			.catch((err) => reject(err));
	});
}

function pollPort(url, maxWaitMs, intervalMs) {
	const controller = new AbortController();
	const wait = () =>
		new Promise((resolve, reject) => {
			let waited = 0;
			const signal = controller.signal;
			const tryConnect = async () => {
				if (signal.aborted) return reject(new Error("Polling aborted"));
				try {
					const res = await fetch(url, { method: "GET", signal });
					if (res.status === 200 || res.status === 403) {
						resolve();
					} else {
						waited += intervalMs;
						if (waited >= maxWaitMs) {
							reject(new Error(`Server at ${url} did not become ready in time`));
						} else {
							setTimeout(tryConnect, intervalMs);
						}
					}
				} catch {
					waited += intervalMs;
					if (waited >= maxWaitMs) {
						reject(new Error(`Server at ${url} did not become ready in time`));
					} else {
						setTimeout(tryConnect, intervalMs);
					}
				}
			};
			setTimeout(tryConnect, 1000);
		});
	return { wait, abort: () => controller.abort() };
}

function shutdown() {
	if (shuttingDown) return;
	shuttingDown = true;
	log("main", "shutting down servers...");
	apiReady.abort();
	webReady.abort();
	if (apiProcess) {
		apiProcess.kill("SIGTERM");
	}
	if (webProcess) {
		webProcess.kill("SIGTERM");
	}
	setTimeout(() => {
		if (apiProcess) apiProcess.kill("SIGKILL");
		if (webProcess) webProcess.kill("SIGKILL");
		process.exit(0);
	}, 5000);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

(async () => {
	try {
		await startApi();
		await startWeb();
		log("main", "All servers ready. Press Ctrl+C to stop.");
	} catch (err) {
		log("main", `Error: ${err.message}`);
		shutdown();
		process.exit(1);
	}
})();
