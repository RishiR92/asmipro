import { describe, expect, it } from "vitest";
import { queuePosition, waitlistTotals } from "../lib/waitlist-counts";

describe("verified launch waitlist counts", () => {
  it("starts with 304 existing pros and 200 available places", () => {
    expect(waitlistTotals(0)).toEqual({ total: 304, remaining: 200 });
  });
  it("numbers new confirmations from 305 and decreases remaining places", () => {
    expect(queuePosition(1)).toBe(305);
    expect(queuePosition(2)).toBe(306);
    expect(waitlistTotals(1)).toEqual({ total: 305, remaining: 199 });
  });
  it("never displays negative availability or moves ahead of the existing list", () => {
    expect(waitlistTotals(201).remaining).toBe(0);
    expect(queuePosition(1, 10)).toBe(305);
  });
});