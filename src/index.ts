import JSON5 from 'json5'

export { compile, objectToHTML, parseTag, parseAttributes };

function compile(srcText: string): string {
    // Parse the source code
    const src = JSON5.parse(srcText);

    const out = objectToHTML(src);

    return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectToHTML(srcObject: any): string {
    if (!srcObject) return "";

    // If the object is an array, then it is a list of HTML objects
    if (Array.isArray(srcObject)) {
        // map each item to its HTML representation
        return srcObject.map(objectToHTML).join("");
    }

    if (typeof srcObject === "string") {
        return srcObject;
    }

    return parseTag(srcObject);
}

function parseAttributes(srcObject: { [key: string]: { value: string } } | undefined): string {
    const attrs = [];
    let hasAttrs = false;

    for (const key in srcObject) {
        // these are keys that are not attributes
        if (key === "$" || key === "body") continue;
        attrs.push(`${key}="${srcObject[key]}"`);

        hasAttrs = true;
    }
    // if there are no attributes, return an empty string.
    // This will prevent the output from having a leading space
    if (!hasAttrs) return "";


    return " " + attrs.join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTag(srcObject: any): string {
    const tag = srcObject.$;

    const attrs = srcObject;

    const body = srcObject.body;

    if (tag == "doctype") {
        if (body)
            return `<!DOCTYPE ${srcObject.body}>`;
        else
            return "<!DOCTYPE html>";
    }
    if (body)
        return `<${tag}${parseAttributes(attrs)}>${objectToHTML(body)}</${tag}>`;
    else
        return `<${tag}${parseAttributes(attrs)} />`;

}