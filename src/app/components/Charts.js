'use client';
import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// World Map Component
// components/Charts.js
export function WorldMap({ countryData, totalClicks }) {
  const [tooltip, setTooltip] = useState(null);
  const [maxClicks, setMaxClicks] = useState(1);

  useEffect(() => {
    if (countryData?.length) {
      const clicks = countryData.map(c => c.clicks);
      setMaxClicks(Math.max(...clicks, 1));
    }
  }, [countryData]);

  const colorScale = scaleQuantile()
    .domain([0, maxClicks])
    .range(['#e0f2fe', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0369a1']);

  return (
    <div className="relative h-[600px] w-full bg-gray-700 rounded-lg shadow-xl overflow-hidden">
      <ComposableMap projection="geoMercator">
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) => geographies.map((geo) => {
              const country = countryData?.find(
                c => c.countryCode === geo.properties.isoA2
              );
              const clicks = country?.clicks || 0;
              const percentage = totalClicks > 0 
                ? ((clicks / totalClicks) * 100).toFixed(1)
                : 0;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={clicks > 0 ? colorScale(clicks) : '#4b5563'}
                  stroke="#374151"
                  strokeWidth={0.5}
                  onMouseMove={(e) => {
                    const { clientX, clientY } = e;
                    setTooltip({
                      name: geo.properties.name,
                      clicks,
                      uniqueVisitors: country?.uniqueVisitors || 0,
                      percentage,
                      x: clientX,
                      y: clientY
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { outline: 'none' },
                    hover: {
                      fill: '#f59e0b',
                      outline: 'none'
                    }
                  }}
                />
              );
            })}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Enhanced Tooltip */}
      {tooltip && (
        <div 
          className="absolute pointer-events-none bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-700"
          style={{
            left: tooltip.x + 5,  // Reduced from 15 to 5
            top: tooltip.y - 20, 
            transform: 'translateY(-50%)'
          }}
        >
          <h3 className="font-semibold text-gray-200 mb-2">{tooltip.name}</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">Total Clicks: {tooltip.clicks}</p>
            <p className="text-gray-400">Unique Visitors: {tooltip.uniqueVisitors}</p>
            <p className="text-blue-400">Percentage: {tooltip.percentage}%</p>
          </div>
        </div>
      )}

      {/* Color Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/80 p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          {colorScale.range().map((color, i) => (
            <div 
              key={color}
              className="h-4 w-8"
              style={{ 
                backgroundColor: color,
                borderLeftRadius: i === 0 ? '4px' : 0,
                borderRightRadius: i === colorScale.range().length - 1 ? '4px' : 0
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>{maxClicks} clicks</span>
        </div>
      </div>
    </div>
  );
}

// Time Chart Component
export function TimeChart({ chartData }) {
  if (!chartData?.labels?.length) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        No click data available
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f3f4f6',
        bodyColor: '#f3f4f6',
        borderColor: '#4b5563',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: '#374151' },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: '#374151' },
        ticks: { color: '#9ca3af', precision: 0 },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  );
}

// Device Chart Component
export function DeviceChart({ deviceData }) {
  if (!deviceData?.length) return (
    <div className="h-96 flex items-center justify-center text-gray-400">
      No device data available
    </div>
  );

  const chartData = {
    labels: deviceData.map(d => d.device),
    datasets: [{
      data: deviceData.map(d => d.count),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderColor: '#1f2937',
      borderWidth: 2
    }]
  };

  return (
    <div className="h-96">
      <Doughnut 
        data={chartData}
        options={{
          plugins: {
            legend: { 
              position: 'right',
              labels: { color: '#9ca3af', font: { size: 14 } }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const value = context.parsed || 0;
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${context.label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
}

// Leaderboard Component
export function Leaderboard({ data }) {
  if (!data?.length) return (
    <div className="h-96 flex items-center justify-center text-gray-400">
      No leaderboard data available
    </div>
  );

  return (
    <div className="space-y-4">
      {data.map((link, index) => {
        const lastClicked = link.lastClicked ? 
          new Date(link.lastClicked).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'Never';

        return (
          <div key={link._id} className="bg-gray-800 p-4 rounded-lg group hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <a
                    href={link.fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-mono hover:text-blue-300 transition-colors truncate"
                    title={`Original URL: ${link.originalUrl}`}
                  >
                    {link.fullShortUrl || `/${link.shortUrl}`}
                  </a>
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">
                    Clicks: {link.totalClicks}
                  </span>
                  <span className="text-gray-500">
                    Last: {lastClicked}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end pl-4">
                <span className="text-xs text-gray-400 mb-1">Total</span>
                <span className="text-2xl font-bold text-purple-400">
                  {link.totalClicks}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}