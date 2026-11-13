module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"subject-case": [2, "always", "sentence-case"],
		"body-case": [2, "never"],
		"header-max-length": [2, "always", 72],
	},
};
