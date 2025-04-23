import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sun,
    Moon,
    Monitor,
    Repeat1Icon,
    ScreenShare,
    KeyRoundIcon,
    Rotate3dIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const themeCycle = ["light", "dark", "system"];

const AppearanceDropdown = () => {
    const { setTheme, theme: activeTheme } = useTheme();
    const [themeIndex, setThemeIndex] = useState(0);

    useEffect(() => {
        const idx = themeCycle.indexOf(activeTheme ?? "system");
        setThemeIndex(idx === -1 ? 2 : idx);
    }, [activeTheme]);

    const handleClick = () => {
        const nextIndex = (themeIndex + 1) % themeCycle.length;
        setTheme(themeCycle[nextIndex]);
        setThemeIndex(nextIndex);
    };

    const icon =
        themeCycle[themeIndex] === "light" ? (
            <Sun className="h-5 w-5" />
        ) : themeCycle[themeIndex] === "dark" ? (
            <Moon className="h-5 w-5" />
        ) : (
            <Rotate3dIcon className="h-5 w-5" />
        );

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={cn("h-8 w-8")}
        >
            {icon}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

export default AppearanceDropdown;
