// types/mathlive.d.ts
import type React from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "math-field": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                "virtual-keyboard-mode"?: "manual" | "onfocus" | "off";
                "virtual-keyboard-layout"?: string;
                "virtual-keyboard-theme"?: string;
                "smart-fence"?: boolean;
                "smart-mode"?: boolean;
            };
        }
    }
}

export { }; // để file được xem là module, tránh lỗi duplicate
