import { render, screen } from "@testing-library/react";
import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter: () => ({
      pathname: "/",
    }),
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSessions() {
      return [null, false];
    },
  };
});

describe("Header componente", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
