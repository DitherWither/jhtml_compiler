# jHTML Compiler

This library is a compiler for the jHTML language.

This is intended to be imported as a npm module inside node, but might support running
in the browser in the future.

## Library Usage

```javascript
const jhtml = require("jhtml-compiler");

const src = `{
    {
        $: "div",
        body: {
            $: "h1",
            body: "Hello World!"
        }
    }
}`;

const html = jhtml.compile(src);

console.log(html);
```

The snippet above will output the following html:

```html
<div>
  <h1>Hello World!</h1>
</div>
```

## Writing jHTML

jHTML uses a JSON-like syntax to represent HTML.

It uses a superset of JSON (called JSON5) for the syntax, 
which supports many quality of life improvements over JSON.

Unlike JSON, you don't need to wrap attribute names in quotes,
can use single quotes for strings, and can use comments.

It also supports trailing commas, which is useful when you
are writing a list of elements.

`elem` and `$` can be used interchangably for the tag name

The `body` contains any children of the element.

The top level and the `body` attributes can contain

- a string
- a tag
- an array of strings and tags

This means that this html:

```html
<h1>Hello, World!</h1>
```

can be written as:

```javascript
{
  $: "h1",
  body: "Hello, World!",
}
```

For most elements, you should use the same tag name as you
would in vanilla html.

The `doctype` element is a special case, and should be used
for the doctype like this

```javascript
{
  $: "doctype",
  body: "html",
}
```

The doctype element is handled differently from other elements,
as it is different from the other elements in the sense that it
 - does not have a closing tag
 - doesn't have attributes in the same way as other elements do
 - doesn't have a body in the same way as other elements do

As a result, we have to handle it differently.

## Example

```javascript
[
  {
    elem: "doctype",
    body: "html",
  },
  {
    $: "html",
    lang: "en",
    body: [
      {
        $: "head",
        body: [
          {
            $: "title",
            body: "Hello",
          },
          {
            $: "meta",
            charset: "utf-8",
          },
          {
            $: "meta",
            name: "viewport",
            content: "width=device-width, initial-scale=1",
          },
        ],
      },
      {
        $: "body",
        body: [
          {
            $: "div",
            body: [
              {
                $: "h1",
                style: "color: red;",
                body: "Hello, World!",
              },
              {
                $: "p",
                body: "This is a demo page for jHTML",
              },
            ],
          },
        ],
      },
    ],
  },
];
```
