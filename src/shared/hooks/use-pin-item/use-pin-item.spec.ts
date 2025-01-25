import { renderHook, act } from '@testing-library/react';
import { usePinItem } from './use-pin-item';
import { useLocalStorage } from '@mantine/hooks';

jest.mock('@mantine/hooks');

// Mock items interface for testing
type TestItem = { id: string; date: Date };
const testItems: () => TestItem[] = () =>[
  { id: '1', date: new Date('2023-01-01') },
  { id: '2', date: new Date('2023-01-02') },
  { id: '3', date: new Date('2023-01-03') },
];

// Mock localStorage implementation
const mockSetValue = jest.fn();
(useLocalStorage as jest.Mock).mockImplementation(() => [[], mockSetValue]);

describe('usePinItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initially return items sorted with none pinned', () => {
    const { result } = renderHook(() => usePinItem({
      items: testItems(),
      localStorageKey: 'test',
      keySelectorFn: (item: TestItem) => item.id,
      sortFn: (a: TestItem, b: TestItem) => b.date.getTime() - a.date.getTime() // Newest first
    }));

    expect(result.current[0]).toEqual([
      { id: '3', date: new Date('2023-01-03') },
      { id: '2', date: new Date('2023-01-02') },
      { id: '1', date: new Date('2023-01-01') },
    ]);
  });

  test('should maintain pinned items at top when toggled', () => {
    const { result } = renderHook(() => usePinItem({
      items: testItems(),
      localStorageKey: 'test',
      keySelectorFn: (item: TestItem) => item.id,
      sortFn: (a: TestItem, b: TestItem) => b.date.getTime() - a.date.getTime() // Newest first
    }));

    // Pin first item (index 0 - newest item)
    act(() => {
      result.current[1](0);
    });

    // Check updated state
    const [pinnedItems] = result.current;
    expect(pinnedItems[0]).toEqual(expect.objectContaining({
      id: '3',
      isPinned: true
    }));
    
    // Verify localStorage update
    expect(mockSetValue).toHaveBeenCalled();
  });

  test('should merge and sort unpinned items below pinned items', () => {
    // Initial pinned state
    (useLocalStorage as jest.Mock).mockImplementationOnce(() => [[
      { id: '2', date: new Date('2023-01-02'), isPinned: true }
    ], mockSetValue]);

    const { result } = renderHook(() => usePinItem({
      items: testItems(),
      localStorageKey: 'test',
      keySelectorFn: (item: TestItem) => item.id,
      sortFn: (a: TestItem, b: TestItem) => b.date.getTime() - a.date.getTime() // Newest first
    }));

    expect(result.current[0]).toEqual([
      { id: '2', date: new Date('2023-01-02'), isPinned: true }, // Pinned
      { id: '3', date: new Date('2023-01-03') }, // Sorted unpinned
      { id: '1', date: new Date('2023-01-01') }
    ]);
  });

  test('should handle unpinning existing pinned items', () => {
    // Initial pinned state
    (useLocalStorage as jest.Mock).mockImplementationOnce(() => [[
      { id: '1', date: new Date('2023-01-01'), isPinned: true },
      { id: '3', date: new Date('2023-01-03'), isPinned: true }
    ], mockSetValue]);

    const { result } = renderHook(() => usePinItem({
      items: testItems(),
      localStorageKey: 'test',
      keySelectorFn: (item: TestItem) => item.id,
      sortFn: (a: TestItem, b: TestItem) => b.date.getTime() - a.date.getTime() // Newest first
    }));

    // Unpin second pinned item (index 1)
    act(() => {
      result.current[1](1);
    });

    expect(mockSetValue).toHaveBeenCalled();
  });
});