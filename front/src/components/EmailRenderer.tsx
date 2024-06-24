import DOMPurify from "dompurify";
import { useEffect, useMemo, useRef } from "react";

const purify = DOMPurify();

purify.addHook('afterSanitizeAttributes', node => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
})

purify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'style') {
    node.textContent = node.textContent?.replace(/</g, '\\003c ') ?? null;
  }
});

export default function EmailRenderer(props: {
  body: string;
}) {
  const html = useMemo(() => {
    const html = purify.sanitize(props.body, {FORCE_BODY: true});
    return '<style>:host { all: initial; display: block; background: white; }</style>' + html;
  }, [props.body]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const root = import.meta.env.DEV ? ref.current : ref.current.attachShadow({ mode: 'open' });
      root.innerHTML = html;
    }
  }, [html]);

  return (
    <div style={{minHeight: '10rem'}} className="w-100 border" ref={ref} />
  );
}