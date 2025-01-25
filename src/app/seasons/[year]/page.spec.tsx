import { render, screen, within } from "@testing-library/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import userEvent from "@testing-library/user-event";
import SeasonRaces from "./page";
import React from "react";
import "@testing-library/jest-dom";

// Mock dependencies
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../_services/seasons.service");
jest.mock("@tanstack/react-query");

jest.mock("./_components/races-info-view/races-info-view.component", () => ({
  RacesInfoView: jest.fn(() => React.createElement("div", null, "InfoView")),
}));

jest.mock("./_components/races-card-view/races-card-view.component", () => ({
  RacesCardView: jest.fn(() => React.createElement("div", null, "CardView")),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockRacesData = {
  MRData: {
    total: "40",
    RaceTable: {
      Races: [
        { raceName: "Race 1", round: "1", url: "/race/1" },
        { raceName: "Race 2", round: "2", url: "/race/2" },
      ],
    },
  },
};

describe("SeasonRaces Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ year: "2023" });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  test("renders loading state", () => {
    mockUseQuery.mockReturnValue({ isLoading: true });

    render(
      <MantineProvider>
        <SeasonRaces />
      </MantineProvider>
    );

    expect(screen.getByTestId("loader-container")).toBeInTheDocument();
  });

  describe("successful data rendering", () => {
    beforeEach(() => {
      mockUseQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockRacesData,
      });
    });

    test("renders breadcrumbs with correct structure", () => {
      render(
        <MantineProvider>
          <SeasonRaces />
        </MantineProvider>
      );

      const breadcrumbs = screen.getAllByRole("link");
      expect(breadcrumbs[0]).toHaveAttribute("href", "/seasons");
      expect(breadcrumbs[1]).toHaveAttribute("href", "/seasons/2023");
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
          <SeasonRaces />
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
          <SeasonRaces />
        </MantineProvider>
      );

      expect(screen.getByText("CardView")).toBeInTheDocument();
    });

    test("handles pagination correctly", async () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("view=grid&limit=10&offset=0")
      );

      (useRouter as jest.Mock).mockReturnValue({
        push: mockPush
      });

      mockUseQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockRacesData,
      });

      render(
        <MantineProvider>
          <SeasonRaces />
        </MantineProvider>
      );

      const pagination = screen.getByTestId("navigation");
      expect(within(pagination).getByText("4")).toBeInTheDocument(); // total pages (20/5)

      const page2 = within(pagination).getByText("2");
      await userEvent.click(page2);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("offset=10")
      );
    });
  });

  test("handles URL parameters correctly", () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("view=grid&limit=15&offset=30")
    );

    render(
      <MantineProvider>
        <SeasonRaces />
      </MantineProvider>
    );

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["season-races", 15, 30, { year: "2023" }],
      })
    );
  });

  test("handles empty race data gracefully", () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { MRData: { total: "0", RaceTable: { Races: [] } } },
    });

    render(
      <MantineProvider>
        <SeasonRaces />
      </MantineProvider>
    );

    expect(screen.queryByText("RacesInfoView")).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
