import React from 'react';

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
    <div
        className={`${className} rounded-lg border bg-gray-50 shadow-sm text-slate-800`}
        {...rest}
        ref={ref}
    />
));
Card.displayName = 'Card';

const CardHeading = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
    <div
        className={`${className}space-y-1 p-4 flex flex-col`}
        {...rest}
        ref={ref}
    />
));
CardHeading.displayName = 'CardHeading';

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, ref) => (
    <div ref={ref} className={`p-6 pt-0 ${className}`} {...rest} />
));
CardContent.displayName = 'CardContent';
export { Card, CardHeading, CardContent };
