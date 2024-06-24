import DOMPurify from "dompurify";
import { useMemo } from "react";

const purify = DOMPurify();

purify.addHook('afterSanitizeAttributes', node => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
})

export default function EmailRenderer(props: {
  body: string;
}) {
  const html = useMemo(() => purify.sanitize(props.body), [props.body]);

  // restrict the size of the email body
  return (
    <div
      style={{
        minHeight: '10rem',
      }}
      className="bg-light text-dark w-100 border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}