import { describe, expect, it } from "vitest";
import {
  createMotorSelectionState,
  nextMotorFocusIndex,
  transitionMotorSelection,
} from "./selection";

describe("motor band selection", () => {
  it("starts with one stable selected and focusable motor", () => {
    expect(createMotorSelectionState(6)).toEqual({
      selectedIndex: 0,
      focusIndex: 0,
      previewIndex: null,
    });
  });

  it("lets focus and hover preview without changing selection", () => {
    const initial = createMotorSelectionState(6);
    const focused = transitionMotorSelection(
      initial,
      { type: "FOCUS", index: 2 },
      6,
    );
    const previewed = transitionMotorSelection(
      focused,
      { type: "PREVIEW", index: 4 },
      6,
    );

    expect(previewed).toEqual({
      selectedIndex: 0,
      focusIndex: 2,
      previewIndex: 4,
    });
  });

  it("activates immediately and clears transient preview state", () => {
    const previewed = transitionMotorSelection(
      createMotorSelectionState(6),
      { type: "PREVIEW", index: 5 },
      6,
    );

    expect(
      transitionMotorSelection(
        previewed,
        { type: "ACTIVATE", index: 3 },
        6,
      ),
    ).toEqual({
      selectedIndex: 3,
      focusIndex: 3,
      previewIndex: null,
    });
  });

  it("wraps arrow focus without activating another motor", () => {
    expect(nextMotorFocusIndex(0, "previous", 6)).toBe(5);
    expect(nextMotorFocusIndex(5, "next", 6)).toBe(0);
  });

  it("supports Home and End focus commands", () => {
    expect(nextMotorFocusIndex(3, "first", 6)).toBe(0);
    expect(nextMotorFocusIndex(3, "last", 6)).toBe(5);
  });

  it("rejects empty bands and out-of-range state", () => {
    expect(() => createMotorSelectionState(0)).toThrow(
      "La banda necesita al menos un motor.",
    );
    expect(() => createMotorSelectionState(6, 6)).toThrow(
      "Índice de motor inválido: 6",
    );
  });

  it("keeps selection and focus synchronized under rapid activation", () => {
    const final = [5, 1, 4, 2].reduce(
      (state, index) =>
        transitionMotorSelection(state, { type: "ACTIVATE", index }, 6),
      createMotorSelectionState(6),
    );

    expect(final.selectedIndex).toBe(2);
    expect(final.focusIndex).toBe(2);
  });
});
