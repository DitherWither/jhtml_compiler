import JSON5 from 'json5'

export { compile, objectToHTML, parseTag, parseAttributes };

function compile(srcText: string, useHtml5 = true): string {
    // Parse the source code
    const src = JSON5.parse(srcText);

    const out = objectToHTML(src);

    if (useHtml5) {
        return `<!DOCTYPE html>${out}`;
    }
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
    if (!srcObject) return "";

    const attrs = [];
    for (const key in srcObject) {
        attrs.push(`${key}="${srcObject[key]}"`);
    }

    return " " + attrs.join(" ");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTag(srcObject: any): string {
    let tag = srcObject.tag;

    if (!tag) tag = srcObject.e;

    let attrs = srcObject.attrs;
    if (!attrs) attrs = srcObject.a;

    let children = srcObject.children;

    if (!children) children = srcObject.c;

    if (children) {
        return `<${tag}${parseAttributes(attrs)}>${objectToHTML(children)}</${tag}>`;
    } else {
        return `<${tag}${parseAttributes(attrs)} />`;
    }
}