import { useControlled } from "@salt-ds/core";
import {
  type KeyboardEvent,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface Item {
  id: string;
  element?: HTMLElement | null;
}

function sortBasedOnDOMPosition(items: Item[]): Item[] {
  const indexedItems = items.map((item, index) => [index, item] as const);
  let orderChanged = false;
  indexedItems.sort(([itemAIndex, itemA], [itemBIndex, itemB]) => {
    const itemAElement = itemA.element;
    const itemBElement = itemB.element;
    if (itemAElement === itemBElement) return 0;
    if (!itemAElement || !itemBElement) return 0;

    if (
      itemAElement.compareDocumentPosition(itemBElement) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      if (itemAIndex > itemBIndex) {
        orderChanged = true;
      }
      return -1;
    }

    if (itemAIndex < itemBIndex) {
      orderChanged = true;
    }
    return 1;
  });

  if (orderChanged) {
    return indexedItems.map(([_, item]) => item);
  }
  return items;
}

interface UseCollectionProps {
  wrap: boolean;
}

function useCollection({ wrap }: UseCollectionProps) {
  const [items, setItems] = useState<Item[]>([]);
  const itemMap = useRef<Map<string, Item>>(new Map());

  const registerItem = (item: Item) => {
    setItems((old) => {
      const newItems = old.slice();
      const index = newItems.findIndex(({ id }) => id === item.id);
      if (index !== -1) {
        const newItem = { ...newItems[index], ...item };
        newItems[index] = newItem;
        itemMap.current.set(item.id, newItem);
      } else {
        newItems.push(item);
        itemMap.current.set(item.id, item);
      }
      return sortBasedOnDOMPosition(newItems);
    });

    return () => {
      setItems((old) => {
        itemMap.current.delete(item.id);
        return old.filter(({ id }) => id !== item.id);
      });
    };
  };

  return {
    registerItem,
    item: (id?: string | null) => {
      if (!id) return null;
      let item = itemMap.current.get(id);
      if (!item) {
        item = items.find((item) => item.id === id);
        if (item) {
          itemMap.current.set(item.id, item);
        }
      }
      return item ?? null;
    },
    getNext: (current: string) => {
      const index = items.findIndex(({ id }) => id === current);

      const newIndex = wrap
        ? (index + 1) % items.length
        : Math.min(index + 1, items.length - 1);

      return items[newIndex]?.id;
    },
    getPrevious: (current: string) => {
      const index = items.findIndex(({ id }) => id === current);

      const newIndex = wrap
        ? (index - 1 + items.length) % items.length
        : Math.max(index - 1, 0);

      return items[newIndex]?.id;
    },
    getFirst: () => {
      console.log(items);
      return items[0]?.id;
    },
    getLast: () => {
      return items[items.length - 1]?.id;
    },
    items,
  };
}

export function useTabstrip({
  selected: selectedProp,
  defaultSelected,
  onChange,
}: {
  selected?: string;
  defaultSelected?: string;
  onChange?: (event: SyntheticEvent, selected: string) => void;
}) {
  const { registerItem, item, getNext, getPrevious, getFirst, getLast, items } =
    useCollection({ wrap: true });
  const [selected, setSelectedState] = useControlled({
    controlled: selectedProp,
    default: defaultSelected,
    name: "TabstripNext",
    state: "selected",
  });
  const [active, setActive] = useState<string | undefined>(selected);
  const movedRef = useRef(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!active) return;
    const actionMap = {
      ArrowRight: getNext,
      ArrowLeft: getPrevious,
      Home: getFirst,
      End: getLast,
    };

    const action = actionMap[event.key as keyof typeof actionMap];

    if (action) {
      event.preventDefault();
      const nextId = action(active);
      if (nextId) {
        movedRef.current = true;
        setActive(nextId);
      }
    }
  };

  const handleClose = useCallback(
    (event: SyntheticEvent, id: string) => {
      const first = getFirst();
      const newActive = id === first ? getNext(id) : getPrevious(id);
      if (id === selected) {
        setSelected(event, newActive);
      } else {
        setActive(newActive);
      }
    },
    [getFirst, getNext, getPrevious, selected],
  );

  const setSelected = useCallback(
    (event: SyntheticEvent, action: string) => {
      setSelectedState(action);
      setActive(action);

      onChange?.(event, action);
    },
    [onChange],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!movedRef.current) return;
    const itemElement = item(active)?.element;
    if (itemElement) {
      itemElement.focus({ preventScroll: true });
      itemElement.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [active]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        const itemElement = item(selected)?.element;
        itemElement?.focus({ preventScroll: true });
        itemElement?.scrollIntoView({ block: "nearest", inline: "nearest" });
      }, 0);
    }
  }, [selected]);

  return {
    registerItem,
    items,
    setSelected,
    setActive,
    selected,
    active,
    handleKeyDown,
    handleClose,
  };
}
