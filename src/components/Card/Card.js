import * as React from "react";
import PropTypes from 'prop-types'; // Importa prop-types
import cn from "./cn";

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            className
        )}
        ref={ref}
        {...props}
    />
));

Card.displayName = "Card";

// Prop Types per Card
Card.propTypes = {
    className: PropTypes.string,
    // Le altre props sono gestite da {...props} e non hanno un ordine specifico
};

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        ref={ref}
        {...props}
    />
));

CardHeader.displayName = "CardHeader";

// Prop Types per CardHeader
CardHeader.propTypes = {
    className: PropTypes.string,
};

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        ref={ref}
        {...props}
    />
));

CardTitle.displayName = "CardTitle";

// Prop Types per CardTitle
CardTitle.propTypes = {
    className: PropTypes.string,
};

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={cn("text-sm text-muted-foreground", className)}
        ref={ref}
        {...props}
    />
));

CardDescription.displayName = "CardDescription";

// Prop Types per CardDescription
CardDescription.propTypes = {
    className: PropTypes.string,
};

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div className={cn("p-6 pt-0", className)} ref={ref} {...props} />
));

CardContent.displayName = "CardContent";

// Prop Types per CardContent
CardContent.propTypes = {
    className: PropTypes.string,
};

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        className={cn("flex items-center p-6 pt-0", className)}
        ref={ref}
        {...props}
    />
));

CardFooter.displayName = "CardFooter";

// Prop Types per CardFooter
CardFooter.propTypes = {
    className: PropTypes.string,
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
