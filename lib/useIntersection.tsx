import React from "react";
import { useEffect, useRef, useState } from "react";

import type { RefObject } from "react";

type IntersectionObserverResult = {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

type IntersectionResult = [
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined
];

export function useIntersectionObserver(options: any): IntersectionResult {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    initialIsIntersecting = false,
  } = options ?? {};

  const [ref, setRef] = React.useState<Element | null>(null);

  const [state, setState] = React.useState<IntersectionObserverResult>(() => ({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  }));

  useEffect(() => {
    if (!ref) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some(
              (threshold) => entry.intersectionRatio >= threshold
            );

          setState({ isIntersecting, entry });
        });
      },
      { threshold, root, rootMargin }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, JSON.stringify(threshold), root, rootMargin]);

  const prevRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!ref && state.entry?.target && prevRef.current !== state.entry.target) {
      prevRef.current = state.entry.target;
      setState({ isIntersecting: initialIsIntersecting, entry: undefined });
    }
  }, [ref, state.entry, initialIsIntersecting]);

  return [setRef, !!state.isIntersecting, state.entry] as IntersectionResult;
}
