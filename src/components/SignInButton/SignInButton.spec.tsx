import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/legacy";
import { useSession } from "next-auth/react";
import { SignInButton } from ".";

jest.mock("next-auth/client");

describe("SignInButton component", () => {
  it("renders correctly when user is not autheticated", () => {
    const useSessionsMocked = mocked(useSession);
    useSessionsMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when user is autheticated", () => {
    const useSessionsMocked = mocked(useSession);

    useSessionsMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "John.doe@example.com" },
        expires: "fake-expires",
      },
      false,
    ]);
    render(<SignInButton />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
