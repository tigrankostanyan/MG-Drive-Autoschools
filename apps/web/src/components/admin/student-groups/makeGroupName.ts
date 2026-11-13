const NAME_LENGTH_THRESHOLD = 0.5;
const SHORT_NAME_LENGTH = 4;
const LONG_NAME_LENGTH = 5;

/** Random alternating letter/digit group name, e.g. "A1B2" or "A1B2C". */
export function makeGroupName(): string {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const digits = "123456789";
	const len = Math.random() > NAME_LENGTH_THRESHOLD ? SHORT_NAME_LENGTH : LONG_NAME_LENGTH;
	let result = "";
	for (let i = 0; i < len; i++) {
		if (i % 2 === 0) {
			result += letters.charAt(Math.floor(Math.random() * letters.length));
		} else {
			result += digits.charAt(Math.floor(Math.random() * digits.length));
		}
	}
	return result;
}
