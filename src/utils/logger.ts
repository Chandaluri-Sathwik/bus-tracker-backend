/* eslint-disable no-console */
function getMeta() {
	// Amaze method to get trace:
	// https://stackoverflow.com/a/53339452/12172493
	const e = new Error();
	const frame = e.stack?.split("\n")[5];

	const fileName = frame?.split("/").reverse()[0].split(":")[0];
	const lineNumber = frame?.split(":").reverse()[1];

	return `${fileName}:${lineNumber}`;
}

type messageType = "info" | "error" | "debug";
type messageTypeUppercase = "INFO" | "ERROR" | "DEBUG";

const getTime = () => Date().toString().split(" ")[4];

const getHeader = (type: messageTypeUppercase) => {
	const meta = getMeta();
	const time = getTime();
	return `[${type} | ${time} | ${meta}]`;
};

const cyanStart = "\x1b[36m";
const cyanEnd = "\x1b[0m";

type objectOrString = object | string;

const print = (type: messageType, messages: objectOrString[]) => {
	const header = getHeader(type.toUpperCase() as messageTypeUppercase);

	console[type](cyanStart + header + cyanEnd, messages[0]);
	messages.slice(1).forEach((message) => {
		if (typeof message === "object" && !(message instanceof Error)) {
			message = JSON.stringify(message, null, 2);
		}
		console[type](message);
	});

	if (messages.length > 1) {
		console.debug("--------------------");
	}
};

const info = (...messages: objectOrString[]) => print("info", messages);
const error = (...messages: objectOrString[]) => print("error", messages);
const debug = (...messages: objectOrString[]) => print("debug", messages);

export default { info, error, debug };
