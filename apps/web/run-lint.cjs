const { execSync } = require("node:child_process");
try {
	const out = execSync("npx tsc --noEmit", {
		cwd: "C:\\Users\\Admin\\Desktop\\Projects\\MG Drive Autoschools\\apps\\web",
		encoding: "utf-8",
		stdio: "pipe",
		shell: "cmd.exe",
	});
	console.log(out);
	console.log("EXIT_CODE: 0");
} catch (e) {
	console.log(e.stdout || "");
	console.error(e.stderr || "");
	console.log(`EXIT_CODE: ${e.status}`);
}
