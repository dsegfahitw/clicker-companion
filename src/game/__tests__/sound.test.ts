import { describe, it, expect } from "vitest";
import { sfx } from "../sound";

describe("sfx", () => {
  it("exposes all sound functions and they don't throw", () => {
    for (const key of Object.keys(sfx) as (keyof typeof sfx)[]) {
      expect(typeof sfx[key]).toBe("function");
      expect(() => sfx[key]()).not.toThrow();
    }
  });
});
