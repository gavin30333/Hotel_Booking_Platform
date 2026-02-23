---
name: "cache-components"
description: "Cache components to improve performance. Invoke when optimizing component rendering or managing component state."
---

# Cache Components

This skill helps you identify and cache React components to improve application performance.

## Instructions

1. Analyze the component tree to identify expensive re-renders.
2. Use `React.memo` for functional components that render the same output given the same props.
3. Use `useMemo` and `useCallback` to memoize values and functions passed as props.
4. Verify the performance improvement using React DevTools or performance profiling.
