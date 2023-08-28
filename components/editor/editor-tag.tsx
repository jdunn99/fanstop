import React from "react";

type ValidTags = "h1" | "p" | "a";

interface EditorTagProps extends React.HTMLAttributes<HTMLElement> {
    tag: ValidTags;
    index: number;
    callback(data: string, index: number): void;
}

export const EditorTag = React.forwardRef<any, EditorTagProps>(
    ({ tag, callback, index, ...rest }) => {
        const Tag = tag;
        const [data, setData] = React.useState<string>("");

        const contentRef = React.useRef<any>();

        return (
            <Tag
                contentEditable
                autoFocus
                ref={contentRef}
                {...rest}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        if (contentRef.current) {
                            console.log(index);
                            callback(contentRef.current.innerHTML, index);
                        }
                    }
                }}
                onBlur={(e) => {
                    setData(e.target.innerHTML);
                }}
            />
        );
    }
);
EditorTag.displayName = "EditorTag";
