"use client";

import { useCallback, useEffect, useState } from "react";
import type { ActionResponse } from "@/lib/api";

/**
 * Loads data from a server action and reloads it when `params` change.
 * State is only set when the answer arrives (never synchronously in the
 * effect), and an answer for old params is ignored.
 */
export function useApiData<T, P>(
  fetcher: (params: P) => Promise<ActionResponse<T>>,
  params: P,
) {
  // JSON.stringify(undefined) is undefined, not a string: keep "no params" as "".
  const paramsKey = params === undefined ? "" : JSON.stringify(params);
  const [version, setVersion] = useState(0);
  const requestKey = `${paramsKey}#${version}`;
  const [result, setResult] = useState<{ key: string | null; data: T | null; error?: string }>({
    key: null,
    data: null,
  });

  useEffect(() => {
    let current = true;
    fetcher((paramsKey === "" ? undefined : JSON.parse(paramsKey)) as P).then((res) => {
      if (current) setResult({ key: requestKey, data: res.data ?? null, error: res.ok ? undefined : res.error });
    });
    return () => {
      current = false;
    };
  }, [fetcher, paramsKey, requestKey]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: result.data,
    error: result.error,
    /** True until the answer for the current params has arrived. */
    loading: result.key !== requestKey,
    reload,
    /** Replace the data locally (e.g. after an upload returns the new record). */
    setData: (data: T) => setResult({ key: requestKey, data }),
  };
}

/** A value that only updates after the user stops typing for `delay` ms. */
export function useDebounced<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
