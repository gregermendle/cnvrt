import { useEffect, useState } from "react";
import { format } from "prettier/standalone";
// @ts-ignore
import prettierTs from "prettier/esm/parser-typescript.mjs";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

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

  function copyRemixToClipboard() {
    navigator.clipboard.writeText(remix);
  }

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
    <div className="grid grid-rows-1 grid-cols-[1fr_1px_1fr] h-full max-h-full">
      <div className="overflow-auto max-h-full">
        <CodeEditor
          value={html}
          language="html"
          placeholder="HTML goes here."
          onChange={(evn) => setHtml(evn.target.value)}
          padding={15}
          style={{
            backgroundColor: "rgb(249, 250, 251)",
            fontSize: "0.875rem",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
      </div>
      <div className="bg-black" />
      <div>
        <CodeEditor
          value={remix}
          language="typescript"
          placeholder="Remix comes out here."
          readOnly
          disabled
          padding={15}
          style={{
            backgroundColor: "rgb(249, 250, 251)",
            fontSize: "0.875rem",
            fontFamily:
              "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
          }}
        />
        <div className="bg-gray-50 p-2">
          <button
            className="w-full text-sm text-center text-gray-400 p-2 border-transparent border hover:border-gray-300"
            onClick={copyRemixToClipboard}
          >
            * click to copy *
          </button>
        </div>
      </div>
    </div>
  );
}
