import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useMemo } from "react";

type Pinnable<T> = T & { isPinned?: boolean };

/**
 * Persists and manages pinned items ordering in localStorage. 
 * Merges pinned items with unpinned ones, maintaining pinned status priority. 
 * Unpinned items are sorted according to the specified sortFn.
 * Provides a toggle callback to pin/unpin items by index, syncing both component state and localStorage.
 */
export const usePinItem = <T>({ items, localStorageKey, keySelectorFn, sortFn }: {
    items?: Array<T>, 
    localStorageKey: string,
    keySelectorFn: (item: T) => string | number,
    sortFn: (itemA: T, itemB: T) => number
}): [Array<Pinnable<T>>, (i: number) => void] => {
   
    const [pinnedItems, setPinnedItems] = useLocalStorage<Array<Pinnable<T>>>({
        key: localStorageKey,
        defaultValue: []
    });

    const computedItems: Array<Pinnable<T>> = useMemo(() => {
        // figure out which items are not pinned then sort based on date
        const notPinnedItems = items?.filter(i => !pinnedItems.find(pi => keySelectorFn(pi) === keySelectorFn(i)))
            .sort(sortFn);

        return [...pinnedItems, ...notPinnedItems ?? []] as Array<Pinnable<T>>;
    }, [items, pinnedItems, keySelectorFn, sortFn]);

    const onPinItem = useCallback((index: number) => {
        const targetItem = computedItems[index];

        if (targetItem) {
            targetItem.isPinned = !targetItem.isPinned;

            if (targetItem.isPinned) {
                setPinnedItems((items) => [...items.filter(item => keySelectorFn(item) !== keySelectorFn(targetItem)), targetItem]);
            } else {
                setPinnedItems((items) => items.filter(item => keySelectorFn(item) !== keySelectorFn(targetItem)))
            }
        }
    }, [computedItems, setPinnedItems, keySelectorFn]);

    return [computedItems, onPinItem];
} 