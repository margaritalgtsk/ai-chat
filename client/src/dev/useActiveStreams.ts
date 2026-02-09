import { useEffect, useState } from 'react';
import { streamRegistry } from './activeStreams';

export const useActiveStreams = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceUpdate((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return streamRegistry.list();
};
