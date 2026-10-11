"use client";

import { useEffect, useEffectEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function useUrlSettingsSync(
  synchronize: (params: URLSearchParams) => void,
) {
  const searchParams = useSearchParams();
  const onQueryChange = useEffectEvent(synchronize);

  useEffect(() => {
    if (searchParams != null) {
      onQueryChange(new URLSearchParams(searchParams.toString()));
    }
  }, [searchParams]);
}
