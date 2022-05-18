import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/legacy";
import { signIn, useSession } from "next-auth/react";
import { SubscribeButton } from ".";
import { useRouter } from "next/router";

jest.mock("next-auth/client");

jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionsMocked = mocked(useSession);
    useSessionsMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it("redirect user to sign in when user is not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionsMocked = mocked(useSession);

    useSessionsMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);
    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionsMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionsMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "John.doe@example.com" },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
      false,
    ]);

    useRouterMocked.mockReturnValue({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(pushMock.push).toHaveBeenCalledWith("/posts");
  });
});
