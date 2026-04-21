import { Link } from "wouter";
import logoImage from "@/assets/logo.png";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    withText?: boolean;
    className?: string;
    textClassName?: string; // New prop for text color
    onClick?: () => void;
}

export function Logo({
                         size = "md",
                         withText = true,
                         className = "",
                         textClassName = "text-white", // Default white (for dashboard)
                         onClick,
                     }: LogoProps) {
    const sizes = {
        sm: 40,
        md: 56,
        lg: 72,
        xl: 96,
    };

    const dimensions = sizes[size];

    const imageElement = (
        <img
            src={logoImage}
            alt="Federal Crest Bank"
            width={dimensions}
            height={dimensions}
            className="object-contain"
        />
    );

    const textElement = withText && (
        <span className={`font-serif font-bold text-xl tracking-wide whitespace-nowrap ${textClassName}`}> CREST GLOBAL
    </span>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className={`flex items-center gap-3 ${className}`}>
                {imageElement}
                {textElement}
            </button>
        );
    }

    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            {imageElement}
            {textElement}
        </Link>
    );
}