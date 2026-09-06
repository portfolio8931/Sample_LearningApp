import type React from "react";

type Props = {
  label: string;
  isActive?: boolean;
  variant: "normal" | "alert" | "mono";
  onClick?: () => void;
  disabled?: boolean;
};

const baseStyle =
  "px-4 py-[8px] rounded-lg font-midium shadow-sm text-sm text-white transition-colors";

const variantStyle: Record<Props["variant"], string> = {
  normal: "bg-blue-600",
  alert: "bg-red-600",
  mono: "bg-gray-500",
};

const variantHoverStyles: Record<Props["variant"], string> = {
  normal: "hover:bg-blue-700",
  alert: "hover:bg-red-700",
  mono: "hover:bg-gray-600",
};

const inactiveStyle = "opacity-40";

export const Button: React.FC<Props> = ({
  label,
  isActive = true,
  variant,
  onClick,
  disabled = false,
}) => {
  const className = `
    ${baseStyle}
    ${variantStyle[variant]}
    ${!isActive || disabled ? inactiveStyle : ""}
    ${isActive ? variantHoverStyles[variant] : inactiveStyle}
  `.trim();

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
