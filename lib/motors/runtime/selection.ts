export type MotorSelectionState = {
  selectedIndex: number;
  focusIndex: number;
  previewIndex: number | null;
};

export type MotorSelectionEvent =
  | { type: "FOCUS"; index: number }
  | { type: "PREVIEW"; index: number | null }
  | { type: "ACTIVATE"; index: number };

export type MotorFocusCommand =
  | "previous"
  | "next"
  | "first"
  | "last";

function assertCount(count: number) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("La banda necesita al menos un motor.");
  }
}

function assertIndex(index: number, count: number) {
  if (!Number.isInteger(index) || index < 0 || index >= count) {
    throw new Error(`Índice de motor inválido: ${index}`);
  }
}

export function createMotorSelectionState(
  count: number,
  selectedIndex = 0,
): MotorSelectionState {
  assertCount(count);
  assertIndex(selectedIndex, count);

  return {
    selectedIndex,
    focusIndex: selectedIndex,
    previewIndex: null,
  };
}

export function nextMotorFocusIndex(
  currentIndex: number,
  command: MotorFocusCommand,
  count: number,
) {
  assertCount(count);
  assertIndex(currentIndex, count);

  if (command === "first") return 0;
  if (command === "last") return count - 1;
  if (command === "next") return (currentIndex + 1) % count;
  return (currentIndex - 1 + count) % count;
}

export function transitionMotorSelection(
  state: MotorSelectionState,
  event: MotorSelectionEvent,
  count: number,
): MotorSelectionState {
  assertCount(count);
  assertIndex(state.selectedIndex, count);
  assertIndex(state.focusIndex, count);

  if (event.type === "PREVIEW") {
    if (event.index !== null) assertIndex(event.index, count);
    return { ...state, previewIndex: event.index };
  }

  assertIndex(event.index, count);

  if (event.type === "FOCUS") {
    return { ...state, focusIndex: event.index };
  }

  return {
    selectedIndex: event.index,
    focusIndex: event.index,
    previewIndex: null,
  };
}
