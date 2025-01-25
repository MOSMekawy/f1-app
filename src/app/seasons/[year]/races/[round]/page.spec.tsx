import { render, screen } from '@testing-library/react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import RaceView from './page';
import { MantineProvider } from '@mantine/core';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../../../_services/seasons.service', () => ({
  getSeasonRaceDetails: jest.fn(),
}));

jest.mock('@mantine/charts', () => ({
  BarChart: jest.fn(() => <div>BarChart</div>),
}));

const mockUseQuery = useQuery as jest.Mock;
const mockUseParams = useParams as jest.Mock;

const mockRaceData = {
  MRData: {
    RaceTable: {
      Races: [{
        Results: [
          {
            number: "44",
            Driver: {
              driverId: "hamilton",
              familyName: "Hamilton",
              givenName: "Lewis",
              nationality: "British"
            },
            Constructor: { name: "Mercedes" },
            position: "1",
            Time: { millis: "360000" },
            laps: "57",
            status: "Finished"
          },
          {
            number: "33",
            Driver: {
              driverId: "verstappen",
              familyName: "Verstappen",
              givenName: "Max",
              nationality: "Dutch"
            },
            Constructor: { name: "Red Bull" },
            position: "2",
            Time: null,
            laps: "57",
            status: "Finished"
          }
        ]
      }]
    }
  }
};

describe('RaceView Component', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ year: '2023', round: '1' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    mockUseQuery.mockReturnValue({ isLoading: true });
    
    render(
      <MantineProvider>
        <RaceView />
      </MantineProvider>
    );

    expect(screen.getByTestId('loader-container')).toBeInTheDocument();
  });

  describe('with successful data', () => {
    beforeEach(() => {
      mockUseQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        data: mockRaceData
      });
    });

    test('renders breadcrumbs with correct structure', () => {
      render(
        <MantineProvider>
          <RaceView />
        </MantineProvider>
      );

      const breadcrumbs = screen.getAllByRole('link');
      expect(breadcrumbs).toHaveLength(4);
      expect(breadcrumbs[0]).toHaveAttribute('href', '/seasons');
      expect(breadcrumbs[3]).toHaveAttribute('href', '/seasons/2023/races/1');
    });

    test('renders driver cards with correct information', () => {
      render(
        <MantineProvider>
          <RaceView />
        </MantineProvider>
      );

      const cards = screen.getAllByTestId('driver-card');
      expect(cards).toHaveLength(2);

      const firstDriver = screen.getByText(/Hamilton Lewis/i);
      const secondDriver = screen.getByText(/Verstappen Max/i);
      expect(firstDriver).toBeInTheDocument();
      expect(secondDriver).toBeInTheDocument();

      const nationalities = screen.getAllByTestId("nationality");
      expect(nationalities[0]).toHaveTextContent('British');
      expect(nationalities[1]).toHaveTextContent('Dutch');
    });

  });
});