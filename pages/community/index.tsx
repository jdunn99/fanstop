import { useRouter } from "next/router";
import React from "react";

export default function reroute() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/community/dashboard");
  }, []);

  return null;
}
