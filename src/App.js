import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const KalmanFilterDemo = () => {
  const [noise, setNoise] = useState(1.0);
  const [alpha, setAlpha] = useState(1.2);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timesteps = 100;
    let trueState = d3.range(timesteps).map((d) => d / 10);
    let noisyMeasurements = trueState.map((d) => d + d3.randomNormal(0, noise)());

    let estimates = [];
    let P_k = 1; // Initial covariance

    noisyMeasurements.forEach((z) => {
      let R_k = alpha * noise; // Adaptive noise adjustment
      let K_k = P_k / (P_k + R_k); // Kalman Gain
      let x_k = K_k * z;
      estimates.push(x_k);
      P_k = (1 - K_k) * P_k;
    });

    setData({ trueState, noisyMeasurements, estimates });
  }, [noise, alpha]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Live Kalman Filter Demo</h1>
      <div>
        <label>Noise Level: </label>
        <input type="range" min="0.1" max="5" step="0.1" value={noise} onChange={(e) => setNoise(parseFloat(e.target.value))} />
        <span> {noise.toFixed(1)}</span>
      </div>
      <div>
        <label>Adaptive Factor (α): </label>
        <input type="range" min="1.0" max="2.5" step="0.1" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} />
        <span> {alpha.toFixed(1)}</span>
      </div>
      <svg width={500} height={300} style={{ border: "1px solid black" }}>
        <path d={d3.line()(data.trueState)} stroke="green" strokeWidth="2" fill="none" />
        <path d={d3.line()(data.noisyMeasurements)} stroke="red" strokeWidth="2" fill="none" />
        <path d={d3.line()(data.estimates)} stroke="blue" strokeWidth="2" fill="none" />
      </svg>
      <p>Green: True Path | Red: Noisy Measurements | Blue: Filtered Path</p>
    </div>
  );
};

export default KalmanFilterDemo;
