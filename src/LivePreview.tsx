import { useEffect, useRef } from "react";

export default function LivePreview({ html }: { html: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(html);
                doc.close();
            }
        }
    }, [html]);

    return (
        <div className="rounded border border-gray-50 mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-50 px-4 pt-4">Live Preview</h2>
            <iframe
                ref={iframeRef}
                className="w-full h-[500px] bg-white rounded-b"
                sandbox="allow-same-origin"
                title="Generated Preview"
            />
        </div>
    );
}
