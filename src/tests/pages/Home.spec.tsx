import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import { mocked } from "ts-jest/legacy";
import Home, { getStaticProps } from "../../pages";

jest.mock("next-auth/react", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("next/router");
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceID: "fake-price-id", amount: "R$10,00" }} />);

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });

  it("load initiald data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEquals(
      expect.objectContaining({
        props: {
          product: {
            priceID: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
