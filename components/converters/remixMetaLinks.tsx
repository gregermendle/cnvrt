import ReactCodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";
import { html as langHtml } from "@codemirror/lang-html";
import { javascript as langJs } from "@codemirror/lang-javascript";
import { format } from "prettier/standalone";
// @ts-ignore
import prettierTs from "prettier/esm/parser-typescript.mjs";

function attrsAsObject(el: HTMLElement) {
  const attrs: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes.item(i);
    if (attr) {
      attrs[attr.name] = attr.value;
    }
  }
  return attrs;
}

export default function RemixMetaLinks() {
  const [html, setHtml] = useState("");
  const [remix, setRemix] = useState("");

  useEffect(() => {
    const parser = new DOMParser();
    const tags = parser.parseFromString(html, "text/html");
    const links = tags.querySelectorAll("link");
    const metas = tags.querySelectorAll("meta");
    const title = tags.querySelector("title");

    let remixLinks: Array<Record<string, string>> = [];
    links.forEach((link) => {
      remixLinks.push(attrsAsObject(link));
    });

    let remixMeta: Record<string, string> = {};

    if (title) {
      remixMeta.title = title.innerHTML;
    }

    metas.forEach((meta) => {
      const attrs = attrsAsObject(meta);

      if ("name" in attrs) {
        remixMeta[attrs.name] = attrs?.content ?? "";
      } else {
        remixMeta = {
          ...remixMeta,
          ...attrs,
        };
      }
    });

    const remixCode = `
        export const links: LinksFunction = () => {
            return ${JSON.stringify(remixLinks)}
        }

        export const meta: MetaFunction = () => {
            return ${JSON.stringify(remixMeta)}
        } 
    `;

    setRemix(
      format(remixCode, {
        parser: "typescript",
        plugins: [prettierTs],
      })
    );
  }, [html]);

  return (
    <div className="grid grid-rows-[1fr_1fr] grid-cols-1 h-full max-h-full">
      <div className="overflow-auto max-h-full">
        <ReactCodeMirror
          onChange={setHtml}
          value={html}
          lang="html"
          extensions={[langHtml()]}
        />
      </div>
      <div>
        <h2>output:</h2>
        <ReactCodeMirror
          value={remix}
          lang="typescript"
          extensions={[langJs()]}
        />
      </div>
    </div>
  );
}
