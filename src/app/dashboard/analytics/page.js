//dashbaord/analytics/page.js

'use client';
import { useState, useEffect } from 'react';
import { WorldMap, TimeChart, DeviceChart, Leaderboard } from '../../components/Charts';
import { useAuth } from '../../hooks/useAuth';
import { FiLock, FiUnlock } from 'react-icons/fi';
// import { ProtectedRoute } from '../components/ProtectedRoute':
import DashboardLayout from '../layout';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

export default function AnalyticsPage() {
  const { sessionId } = useAuth();
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
    uniqueVisitors: 0,
    countryStats: [],
    deviceStats: [],
    leaderboard: [],
    timelineData: null,
    loading: true,
    error: null
  });

  const [isMapLocked, setIsMapLocked] = useState(true);

  const fetchAnalyticsData = async () => {
    if (!sessionId) return;

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      const res = await fetch(`/api/analytics?sessionId=${sessionId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      
      const transformTimelineData = (timeline) => ({
        labels: timeline?.map(item => new Date(item.date).toLocaleDateString()) || [],
        datasets: [{
          label: 'Clicks',
          data: timeline?.map(item => item.clicks) || [],
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f620',
          fill: true,
          tension: 0.4
        }]
      });

      setStats({
        totalLinks: data.totalLinks || 0,
        totalClicks: data.totalClicks || 0,
        activeLinks: data.activeLinks || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        countryStats: data.countryStats || [],
        deviceStats: data.deviceStats || [],
        leaderboard: data.leaderboard || [],
        timelineData: transformTimelineData(data.timeline?.daily),
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Fetch error:', error);
      setStats(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };

  useEffect(() => { fetchAnalyticsData(); }, [sessionId]);

  return (
    <ProtectedRoute>
    <DashboardLayout>
    <div className="space-y-8 bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Cards */}
        {['totalLinks', 'totalClicks', 'uniqueVisitors', 'activeLinks'].map((stat, i) => (
          <div key={stat} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              {stat.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
            </h2>
            <p className={`text-4xl font-bold ${
              ['text-blue-400', 'text-purple-400', 'text-green-400', 'text-yellow-400'][i]
            }`}>
              {stats.loading ? '--' : stats[stat]}
            </p>
          </div>
        ))}
      </div>

      {stats.error && (
        <div className="bg-red-800/20 p-4 rounded-xl border border-red-700">
          <p className="text-red-400">Error: {stats.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6">Device Distribution</h2>
          {stats.loading ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading device data...
            </div>
          ) : (
            <DeviceChart deviceData={stats.deviceStats} />
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-200 mb-6">Top Performing Links</h2>
          {stats.loading ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Loading leaderboard...
            </div>
          ) : (
            <Leaderboard data={stats.leaderboard} />
          )}
        </div>
      </div>

      {/* Existing Timeline and World Map Sections */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-200">Clicks Timeline</h2>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
          >
            Refresh Data
          </button>
        </div>
        {stats.loading ? (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Loading click data...
          </div>
        ) : (
          <TimeChart chartData={stats.timelineData} />
        )}
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-200">Geographic Distribution</h2>
          <button
            onClick={() => setIsMapLocked(!isMapLocked)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 rounded-lg text-white flex items-center gap-2"
          >
            {isMapLocked ? <FiUnlock className="text-lg" /> : <FiLock className="text-lg" />}
            {isMapLocked ? 'Unlock Map' : 'Lock Map'}
          </button>
        </div>

        {stats.loading ? (
          <div className="h-96 flex items-center justify-center text-gray-500">
            Loading map data...
          </div>
        ) : (
          <div className="relative">
            {isMapLocked && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4 rounded-lg">
                <div className="text-center space-y-4">
                  <FiLock className="text-6xl text-purple-500 mx-auto" />
                  <h3 className="text-2xl font-semibold text-gray-200">
                    Upgrade to Unlock Geographic Insights
                  </h3>
                  <p className="text-gray-400 max-w-md">
                    View detailed geographic distribution of your link clicks by upgrading 
                    to our premium plan. Track clicks by country, city, and region.
                  </p>
                </div>
              </div>
            )}
            
            <WorldMap countryData={stats.countryStats} totalClicks={stats.totalClicks} />
          </div>
        )}
      </div>
    </div>
    
    </DashboardLayout>
</ProtectedRoute>
  );
}