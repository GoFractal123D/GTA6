import { Crown, Shield, Zap } from "lucide-react";

interface AdminBadgeProps {
  role?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AdminBadge({
  role,
  size = "md",
  className = "",
}: AdminBadgeProps) {
  if (!role || role === "user") return null;

  const getBadgeConfig = () => {
    switch (role) {
      case "admin":
        return {
          icon: <Crown className="w-3 h-3" />,
          label: "ADMIN",
          colors:
            "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500/30",
          glow: "shadow-lg shadow-purple-500/25",
          animation: "",
        };
      case "moderator":
        return {
          icon: <Shield className="w-3 h-3" />,
          label: "MOD",
          colors:
            "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-500/30",
          glow: "shadow-lg shadow-blue-500/25",
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();
  if (!config) return null;

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const iconSizeClasses = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-full font-bold 
        uppercase tracking-wider border-2 ${config.colors} ${config.glow}
        ${sizeClasses[size]} ${config.animation} ${className}
        transform hover:scale-105 transition-all duration-200
        backdrop-blur-sm
      `}
      title={`${config.label} - Utilisateur avec privilèges spéciaux`}
    >
      <div
        className={`${iconSizeClasses[size]} flex items-center justify-center`}
      >
        {config.icon}
      </div>
      <span className="font-extrabold">{config.label}</span>
    </span>
  );
}
