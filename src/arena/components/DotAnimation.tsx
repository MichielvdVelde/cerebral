import { type FC, useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";

const DotAnimation: FC = () => {
  const [count, oSetCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setCount = useCallback(() => {
    oSetCount((count) => count === 3 ? 0 : count + 1);
  }, [oSetCount]);

  useEffect(() => {
    timerRef.current = setTimeout(setCount, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [count, setCount]);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} display="inline" sx={{ mr: 0.5 }}>
          .
        </Box>
      ))}
    </>
  );
};

export default DotAnimation;
