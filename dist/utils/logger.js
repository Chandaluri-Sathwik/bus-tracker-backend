"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
function getMeta() {
    var _a;
    // Amaze method to get trace:
    // https://stackoverflow.com/a/53339452/12172493
    const e = new Error();
    const frame = (_a = e.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[5];
    const fileName = frame === null || frame === void 0 ? void 0 : frame.split("/").reverse()[0].split(":")[0];
    const lineNumber = frame === null || frame === void 0 ? void 0 : frame.split(":").reverse()[1];
    return `${fileName}:${lineNumber}`;
}
const getTime = () => Date().toString().split(" ")[4];
const getHeader = (type) => {
    const meta = getMeta();
    const time = getTime();
    return `[${type} | ${time} | ${meta}]`;
};
const cyanStart = "\x1b[36m";
const cyanEnd = "\x1b[0m";
const print = (type, messages) => {
    const header = getHeader(type.toUpperCase());
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
const info = (...messages) => print("info", messages);
const error = (...messages) => print("error", messages);
const debug = (...messages) => print("debug", messages);
exports.default = { info, error, debug };
//# sourceMappingURL=logger.js.map