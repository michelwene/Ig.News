import { render, screen } from "@testing-library/react";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicCliente } from "../../services/prismic";
import { mocked } from "ts-jest/legacy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post excerpt</p>",
  updatedAt: "March, 10",
};
jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockResolvedValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to  full post when is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockResolvedValueOnce([
      { activeSubscription: "fake-active-subscription" },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data", async () => {
    const getPrisimicClienteMocked = mocked(getPrismicCliente);

    getPrisimicClienteMocked.mockResolvedValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: "heading",
              text: "My new post",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "Post content",
            },
          ],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getStaticProps({
      params: {
        slug: "my-new-post",
      },
    });

    expect(response).toEquals(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
