import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";

function StockPricePrediction() {
  const [symbol, setSymbol] = useState("AAPL"); // default symbol is Apple
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Define the Finnhub API endpoint URL with your API key
    const API_URL = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=cg3bua9r01qh2qlffs90cg3bua9r01qh2qlffs9g`;

    // Fetch stock price data from the API every 5 seconds
    const interval = setInterval(() => {
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data
          if (data.error) {
            setError(data.error);
            setPrice(null);
            setChartData([]);
          } else {
            setError(null);
            setPrice(data.c);
            setChartData([
              ["Time", "Price"],
              ["9:30", data.o],
              ["10:00", data.h],
              ["10:30", data.l],
              ["11:00", data.c]
            ]);
          }
        })
        .catch((error) => {
          // Handle API fetch errors
          setError("Error fetching stock price data.");
          setPrice(null);
          setChartData([]);
        });
    }, 5000);

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [symbol]);

  function handleSymbolChange(event) {
    setSymbol(event.target.value);
  }
  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Stock Price Prediction</h1>
      <form className="mb-4">
        <label htmlFor="symbol" className="block text-gray-700 font-bold mb-2">
          Enter a stock symbol:
        </label>
        <input
          type="text"
          id="symbol"
          className="border border-gray-400 p-2 w-full"
          value={symbol}
          onChange={handleSymbolChange}
        />
      </form>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {price && (
        <>
          <p className="text-green-500 mb-4">
            The current stock price for {symbol} is ${price}.
          </p>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="LineChart"
            loader={<div>Loading Chart...</div>}
            data={chartData}
            options={{
              hAxis: {
                title: "Time"
              },
              vAxis: {
                title: "Price"
              },
              legend: "none"
            }}
            rootProps={{ "data-testid": "1" }}
          />
        </>
      )}
    </div>
  );
}

export default StockPricePrediction;
