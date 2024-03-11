import { useEffect, useMemo, useState } from "react";

// types
import { UseOnScreenProps } from "../models";

export const useOnScreen = ({ infiniteScrollRef }: UseOnScreenProps) => {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  ), [infiniteScrollRef])


  useEffect(() => {
    const currentRef = infiniteScrollRef?.current;

    if (currentRef) {
      observer.observe(currentRef);
      return () => observer.disconnect();
    }

    return () => { };
  }, [observer, infiniteScrollRef]);

  return isIntersecting
}