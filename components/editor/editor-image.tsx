import React from "react";

interface EditorImageProps extends React.HTMLAttributes<HTMLImageElement> {}

export const EditorImage = React.forwardRef<HTMLImageElement, EditorImageProps>(
    ({ ...rest }, ref) => {
        return <img ref={ref} {...rest} />;
    }
);
EditorImage.displayName = "EditorImage";
