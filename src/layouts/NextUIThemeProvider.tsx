import React, { useEffect } from "react";
import useDarkMode from "use-dark-mode";

type NextUIThemeProviderProps = { children: React.ReactNode };
const NextUIThemeProvider = (props: NextUIThemeProviderProps) => {
  const darkMode = useDarkMode(true);

  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];
    if (darkMode.value) body.className = "dark text-foreground bg-background";
    else body.className = "text-foreground bg-background";
  }, [darkMode.value]);

  return props.children;
};

export default NextUIThemeProvider;
