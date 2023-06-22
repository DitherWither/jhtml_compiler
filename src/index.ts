import JSON5 from 'json5'

export { compile, objectToHTML, parseTag, parseAttributes };

/**
 * Compiles a source code string into HTML
 * 
 * Internally, this parses the json5 source code into an object, and then calls objectToHTML
 * 
 * @param srcText The source code to compile
 * @returns The compiled HTML
 *  
 * @example
 * ```
 * const src = `
 * {
 *    $: "h1",
 *    body: "Hello World"
 * }
 * `;
 * 
 * const html = compile(src);
 * 
 * console.log(html);
 * ```
 * will print `<h1>Hello World</h1>`
 */
function compile(srcText: string): string {
    return objectToHTML(JSON5.parse(srcText));
}

/**
 * Converts an js object into HTML
 * 
 * This can take an object that is a valid jHTML tag, or an array of valid jHTML tags
 * 
 * It can also take a string, which will be returned as is. This is useful, as this function is recursive
 * 
 * @param srcObject The object to convert
 * @returns The HTML representation of the object
 * 
 * @example
 * ```
 * // Notice that unlike the compile function, this function takes an object, not a string
 * const src = {
 *   $: "h1",
 *   body: "Hello World"
 * };
 * 
 * const html = objectToHTML(src);
 * 
 * console.log(html);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectToHTML(srcObject: any): string {
    if (!srcObject) return "";

    // If the object is an array, then it is a list of HTML objects
    if (Array.isArray(srcObject)) {
        // map each item to its HTML representation
        return srcObject.map(objectToHTML).join("");
    }

    // Return strings as is.
    // This is useful, as this function is recursive
    if (typeof srcObject === "string") {
        // TODO: escape the string, and add support for not escaping
        return srcObject;
    }

    // Otherwise, the object is a valid jHTML tag
    return parseTag(srcObject);
}

/**
 * Converts an object's attributes into html attributes
 * 
 * @param srcObject The object to convert
 * @returns The HTML attributes in string form
 * 
 * @example
 * ```
 * // The $ and body properties are ignored, as they are not attributes
 * const src = {
 *  $: "h1",
 *  body: "Hello World",
 *  class: "title",
 *  id: "main-title"
 * };
 * 
 * const attrs = parseAttributes(src);
 * 
 * console.log(attrs);
 * ```
 * will print `class="title" id="main-title"`
 */
function parseAttributes(srcObject: { [key: string]: { value: string } } | undefined): string {
    const attrs = [];
    let hasAttrs = false;

    for (const key in srcObject) {
        // these are keys that are not attributes, so skip them
        if (key === "$" || key === "body" || key === "elem") continue;

        // Serialize the value, and add it to the list of attributes
        attrs.push(`${key}="${srcObject[key]}"`);

        hasAttrs = true;
    }
    // if there are no attributes, return an empty string.
    // This will prevent the output from having a leading space
    if (!hasAttrs) return "";

    // otherwise, return the attributes with a leading space
    return " " + attrs.join(" ");
}

/**
 * Converts an object into an HTML tag. 
 * This function is used by the objectToHTML function
 * 
 * It recursively calls itself and objectToHTML to convert the body of the tag
 * 
 * It will be assumed that the object is a valid HTML tag
 * It will also be assumed that the object is not an array or string
 * 
 * The object must have a `$` or `elem` property that is the tag name
 * 
 * The object may have a `body` property that is the body of the tag
 * 
 * The body may be a string, tag, or an array of tags and strings
 * 
 * The object may have any other property that is an attribute of the tag
 * 
 * You should probably not use this function directly, and instead use objectToHTML
 * 
 * @param srcObject The object to convert
 * @returns The HTML tag
 * 
 * @example
 * ```
 * // This is a valid jHTML tag
 * // This CAN NOT be an array or string, and MUST have a $ property
 * const src = {
 *  $: "h1",
 *  body: [
 *     "Hello ",
 *     {
 *         $: "span",
 *         body: "World"
 *    }
 * ],
 * ```
 * this will return `<h1>Hello <span>World</span></h1>`
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseTag(srcObject: any): string {
    let tag = srcObject.$;
    if (!tag) tag = srcObject.elem;
    if (!tag) throw new Error("Object must have a $ or elem property that is the tag name");

    const attrs = srcObject;
    const body = srcObject.body;

    // the doctype is special, as it doesn't have a closing tag
    // or end with a slash. It also doesn't have attributes
    //
    // And the "html" part of the doctype is not really a attribute,
    // as it doesn't have a value
    //
    // So we will just treat it as a special case
    //
    // And setting $ to "!DOCTYPE" is annoying, so just use "doctype"
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