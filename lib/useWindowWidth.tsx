import React from "react";

export function useWindowWidth() {
  const [width, setWidth] = React.useState<number>();

  function handleResize() {
    setWidth(window.innerWidth);
  }

  React.useEffect(() => {
    if (!window) {
      return;
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return !!width && width < 1024;
}
