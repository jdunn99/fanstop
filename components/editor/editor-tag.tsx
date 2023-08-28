import React from "react";
import { callbackify } from "util";

type ValidTags = "h1" | "p" | "a";

interface EditorTagProps extends React.HTMLAttributes<HTMLElement> {
    tag: ValidTags;
    index: number;
    callback(data: string, index: number): void;
}

export const EditorTag = React.forwardRef(
    (
        { tag, callback, index, ...rest }: EditorTagProps,
        ref: React.Ref<any>
    ) => {
        const Tag = tag;
        const [data, setData] = React.useState<string>("");

        const temp = React.useRef<any>();

        return (
            <Tag
                contentEditable
                className="w-full resize-none appearance-none focus:outline-none"
                ref={temp}
                {...rest}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        if (temp.current) {
                            console.log(index);
                            callback(temp.current.innerHTML, index);
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
