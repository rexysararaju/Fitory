import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Pages/Dashboard'; 
import API from '../api/api';

// 1. Mock API module to prevent actual network requests
vi.mock('../api/api');

// 2. Mock useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 3. Mock Child Components (Navbar) to isolate Dashboard testing
vi.mock('../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

describe('<Dashboard /> Unit Tests', () => {
  // Mock data for testing
  const mockWorkouts = [
    {
      _id: '1',
      name: 'Leg Day',
      date: new Date().toISOString(), // Today
      description: 'Heavy squats',
      exercises: [{ name: 'Squat', sets: 5, reps: 5, weight: 100 }]
    },
    {
      _id: '2',
      name: 'Cardio',
      date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
      description: 'Morning run',
      exercises: [{ name: 'Running', duration: 30, distance: 5 }]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mock history before each test
  });

  test('renders loading state initially then displays data', async () => {
    // Setup API to return mock data
    API.get.mockResolvedValue({ data: mockWorkouts });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Verify initial render (Title)
    expect(screen.getByText('My Workout Log')).toBeInTheDocument();

    // Wait for data to load and verify elements are present
    await waitFor(() => {
      expect(screen.getByText('Leg Day')).toBeInTheDocument();
      expect(screen.getByText('Cardio')).toBeInTheDocument();
    });
  });

  test('calculates statistics correctly', async () => {
    API.get.mockResolvedValue({ data: mockWorkouts });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for statistics to render
    await waitFor(() => {
      // Check Total Workouts (Should be 2)
      expect(screen.getByText('Total Workouts').previousSibling).toHaveTextContent('2');
      // Check Streak (Should be 2 days based on dates)
      expect(screen.getByText('Current Streak 🔥').previousSibling).toHaveTextContent('2 days');
    });
  });

  test('navigates to edit page when Edit button is clicked', async () => {
    API.get.mockResolvedValue({ data: mockWorkouts });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Wait for data loading
    await waitFor(() => screen.getByText('Leg Day'));

    // Click the Edit button on the first item
    const editBtns = screen.getAllByText('Edit');
    fireEvent.click(editBtns[0]);

    // Verify navigation was called with correct path and state
    expect(mockNavigate).toHaveBeenCalledWith('/create-workout', {
      state: { workoutToEdit: mockWorkouts[0] }
    });
  });

  test('handles delete interaction correctly', async () => {
    API.get.mockResolvedValue({ data: mockWorkouts });
    API.delete.mockResolvedValue({}); // Mock successful delete response

    // Spy on window.confirm to simulate clicking "OK"
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Leg Day'));

    // Click Delete button
    const deleteBtns = screen.getAllByText('Delete');
    fireEvent.click(deleteBtns[0]);

    // 1. Verify confirmation dialog was triggered
    expect(confirmSpy).toHaveBeenCalledWith('Delete this workout?');

    // 2. Verify API delete call
    expect(API.delete).toHaveBeenCalledWith(`/workouts/${mockWorkouts[0]._id}`, expect.anything());

    // 3. Verify item is removed from the DOM
    await waitFor(() => {
        expect(screen.queryByText('Leg Day')).not.toBeInTheDocument();
        expect(screen.getByText('Cardio')).toBeInTheDocument();
    });
  });

  test('displays zero statistics when there are no workouts', async () => {
    // Setup API to return empty array
    API.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Check Total Workouts (Should be 0)
      expect(screen.getByText('Total Workouts').previousSibling).toHaveTextContent('0');
      // Check Streak (Should be 0 days)
      expect(screen.getByText('Current Streak 🔥').previousSibling).toHaveTextContent('0 days');
    });
  });

  test('handles API error gracefully', async () => {
    // Setup API to fail
    const errorMessage = 'Network Error';
    API.get.mockRejectedValue(new Error(errorMessage));

    // Spy on console.error to prevent cluttering test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Verify app still renders main structure even after error
    await waitFor(() => {
      expect(screen.getByText('My Workout Log')).toBeInTheDocument();
    });

    // Verify error was logged to console
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching workouts:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});