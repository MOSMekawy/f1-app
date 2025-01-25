import React from "react";
import { render, screen, within } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import Seasons from "./page";
import { SeasonsInfoView } from "./_components/seasons-info-view/seasons-info-view.component";
import { MantineProvider } from "@mantine/core";
import '@testing-library/jest-dom'

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock(
  "./_components/seasons-info-view/seasons-info-view.component.tsx",
  () => ({
    SeasonsInfoView: jest.fn(() =>
      React.createElement("div", null, "InfoView")
    ),
  })
);

jest.mock(
  "./_components/seasons-card-view/seasons-card-view.component",
  () => ({
    SeasonsCardView: jest.fn(() =>
      React.createElement("div", null, "CardView")
    ),
  })
);

jest.mock("./_services/seasons.service", () => ({
  getSeasons: jest.fn(),
}));

const mockSeasonsData = {
  MRData: {
    total: "30",
    SeasonTable: {
      Seasons: [
        { season: "2023", url: "/2023" },
        { season: "2022", url: "/2022" },
      ],
    },
  },
};

describe("Seasons Page Component", () => {
  const mockUseQuery = useQuery as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockPush = jest.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockSeasonsData,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    mockUseQuery.mockReturnValue({ isLoading: true });
    render(
      <MantineProvider>
        <Seasons />
      </MantineProvider>
    );
    expect(screen.getByTestId("loader-container")).toBeInTheDocument();
  });

  test("renders error state with retry functionality", async () => {
    mockUseQuery.mockReturnValue({
      isError: true,
    });

    render(
      <MantineProvider>
        <Seasons />
      </MantineProvider>
    );
    expect(screen.getByText(/An error has occurred/i)).toBeInTheDocument();
  });

  describe("successful data rendering", () => {
    test("renders breadcrumbs and view controls", () => {
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );
      expect(
        screen.getByRole("link", { name: /seasons/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    test("defaults to list view", () => {
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );
      expect(screen.getByText("InfoView")).toBeInTheDocument();
    });

    test("switches between views and updates URL", async () => {
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );

      const gridButton = screen.getByLabelText(/card view/i);
      await userEvent.click(gridButton);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("view=grid")
      );
    });

        test("switches between list and grid views", async () => {
          (useSearchParams as jest.Mock).mockReturnValueOnce(
            new URLSearchParams("view=list&limit=10&offset=0")
          );
    
          (useRouter as jest.Mock).mockReturnValue({
            push: mockPush
          });
    
          const { rerender } = render(
            <MantineProvider>
              <Seasons />
            </MantineProvider>
          );
    
          expect(screen.getByText("InfoView")).toBeInTheDocument();
      
          const viewControl = screen.getByTestId("view-control");
          await userEvent.click(within(viewControl).getByLabelText("Card View"));
    
          expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("view=grid"));
          (useSearchParams as jest.Mock).mockReturnValueOnce(
            new URLSearchParams("view=grid&limit=10&offset=0")
          );
      
          rerender(
            <MantineProvider>
              <Seasons />
            </MantineProvider>
          );
    
          expect(screen.getByText("CardView")).toBeInTheDocument();
        });

    test("renders pagination with correct values", () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams("limit=10&offset=20")
      );
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );

      const pagination = screen.getByTestId("navigation");
      expect(pagination).toBeInTheDocument();
      expect(within(pagination).getByText("3")).toBeInTheDocument(); // current page
    });

    test("handles page changes correctly", async () => {
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );

      const pagination = screen.getByTestId("navigation");
      const page2 = within(pagination).getByText("2");
      await userEvent.click(page2);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("offset=10")
      );
    });
  });

  describe("URL parameter handling", () => {
    test("uses default parameters when none are provided", () => {
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );
      expect(SeasonsInfoView).toHaveBeenCalledWith(
        expect.objectContaining({
          seasons: expect.arrayContaining([
            expect.objectContaining({ season: "2023" }),
            expect.objectContaining({ season: "2022" }),
          ]),
        }),
        undefined
      );
    });

    test("handles invalid limit/offset values", () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams("limit=invalid&offset=nan")
      );
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining(["seasons", 10, 0]),
          retry: 5,
        })
      );
    });

    test("calculates pagination correctly", () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams("limit=5&offset=10")
      );
      render(
        <MantineProvider>
          <Seasons />
        </MantineProvider>
      );

      const pagination = screen.getByTestId("navigation");
      expect(within(pagination).getByText("3")).toBeInTheDocument(); // current page
      expect(within(pagination).getByText("6")).toBeInTheDocument(); // total pages (30/5)
    });
  });
});
