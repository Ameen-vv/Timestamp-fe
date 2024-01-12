import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

interface AppState {
  timestamp1: Date | null;
  timestamp2: Date | null;
  differenceInSeconds: number | null;
  error: string | null;
  loading: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    timestamp1: null,
    timestamp2: null,
    differenceInSeconds: null,
    error: null,
    loading: false,
  });

  const handleChange = (
    key: "timestamp1" | "timestamp2",
    date: Date | null
  ): void => {
    setState((prev) => ({ ...prev, [key]: date }));
  };

  const calculateDifference = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(
        "https://cyberwarfare-be.onrender.com/calculate-seconds-difference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp1: state.timestamp1,
            timestamp2: state.timestamp2,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        differenceInSeconds: data.differenceInSeconds,
        error: null,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setState((prev) => ({
        ...prev,
        differenceInSeconds: null,
        error: errorMessage,
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="App">
      <h1>Timestamp Difference Calculator</h1>
      <div>
        <label>Timestamp 1:</label>
        <DatePicker
          selected={state.timestamp1}
          onChange={(date: Date) => handleChange("timestamp1", date)}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm:ss"
        />
      </div>
      <div>
        <label>Timestamp 2:</label>
        <DatePicker
          selected={state.timestamp2}
          onChange={(date: Date) => handleChange("timestamp2", date)}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm:ss"
        />
      </div>
      <button onClick={calculateDifference} disabled={state.loading}>
        Calculate Difference
      </button>
      {state.loading && <p>Please wait...</p>}
      {state.differenceInSeconds !== null && !state.loading && (
        <div>
          <p>
            Difference is:{" "}
            <span style={{ fontWeight: 700 }}>{state.differenceInSeconds}</span>{" "}
            seconds
          </p>
        </div>
      )}
      {state.error && (
        <div>
          <p style={{ color: "red" }}>{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default App;

