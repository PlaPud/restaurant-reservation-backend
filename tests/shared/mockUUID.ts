jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

export const getMockedUUIDString = (n: number) => `${n}-${n}-${n}-${n}-${n}`;
