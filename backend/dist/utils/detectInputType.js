"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function detectInputType(input) {
    const trimmed = input.trim();
    if (/^https?:\/\//i.test(trimmed))
        return "url";
    if (trimmed.length > 300)
        return "news";
    return "message";
}
module.exports = { detectInputType };
//# sourceMappingURL=detectInputType.js.map