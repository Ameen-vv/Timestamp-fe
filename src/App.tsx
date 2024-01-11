import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

interface AppState {
  timestamp1: Date | null;
  timestamp2: Date | null;
  differenceInSeconds: number | null;
  error: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    timestamp1: null,
    timestamp2: null,
    differenceInSeconds: null,
    error: null,
  });

  const handleChange = (
    key: "timestamp1" | "timestamp2",
    date: Date | null
  ): void => {
    setState((prev) => ({ ...prev, [key]: date }));
  };

  const calculateDifference = async (): Promise<void> => {
    const { timestamp1, timestamp2 } = state;

    try {
      const response = await fetch(
        "http://localhost:3001/calculate-difference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timestamp1, timestamp2 }),
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
      setState((prev) => ({
        ...prev,
        differenceInSeconds: null,
        error: error as string,
      }));
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
      <button onClick={calculateDifference}>Calculate Difference</button>
      {state.differenceInSeconds !== null && (
        <div>
          <p>Difference in seconds: {state.differenceInSeconds}</p>
        </div>
      )}
    </div>
  );
};

export default App;
