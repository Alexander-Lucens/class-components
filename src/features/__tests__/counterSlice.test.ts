import counterReducer, { increment, decrement, incrementByAmount } from "../counterSlice";

describe("counterSlice", () => {
  it("increments, decrements and increments by amount", () => {
    let state = counterReducer(undefined as any, { type: "unknown" });
    state = counterReducer(state, increment());
    expect(state.value).toBe(1);
    state = counterReducer(state, decrement());
    expect(state.value).toBe(0);
    state = counterReducer(state, incrementByAmount(5));
    expect(state.value).toBe(5);
  });
});
