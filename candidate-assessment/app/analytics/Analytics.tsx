'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';

interface MetricData {
  subject: string;
  value: number;
  fullMark: number;
  color: string;
}

interface AnalyticsProps {
  metrics: {
    timeSpent: number;      
    hintReliance: number;      
    questionsAttempted: number;    
    codeStyle: number;     
    technicalExpertise: number;     
  };
}

const Analytics: React.FC<AnalyticsProps> = ({ metrics }) => {
  const data: MetricData[] = [
    {
      subject: 'Time Efficiency',
      value: metrics.timeSpent < 100 ? 100 - metrics.timeSpent : Math.max(Math.min(300 - metrics.timeSpent, 96), 18),
      fullMark: 100,
      color: '#ffc800',
    },
    {
      subject: 'Hint Independence',
      value: Math.max(0, 100 - (metrics.hintReliance * 20)),
      fullMark: 100,
      color: '#00FFE5',
    },
    {
      subject: 'Questions Attempted',
      value: metrics.questionsAttempted * 33,
      fullMark: 100,
      color: '#1A8CFF',
    },
    {
      subject: 'Code Style',
      value: metrics.codeStyle,
      fullMark: 100,
      color: '#33FF33',
    },
    {
      subject: 'Technical Expertise',
      value: metrics.technicalExpertise,
      fullMark: 100,
      color: '#CC33FF',
    },
  ];

  const renderPolygons = () => {
    const radius = 150;
    const angleOffset = -Math.PI / 2;
    const points = data.map((_, i) => {
      const angle = angleOffset + (i * 2 * Math.PI) / data.length;
      const value = data[i].value / 100;
      return {
        x: 300 + radius * value * Math.cos(angle),
        y: 300 + radius * value * Math.sin(angle),
      };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <g>
        <polygon
          points={polygonPoints}
          fill="url(#colorGradient)"
          fillOpacity={0.6}
          stroke="none"
        />
        {points.map((point, i) => {
          const nextPoint = points[(i + 1) % points.length];
          return (
            <polygon
              key={i}
              points={`300,300 ${point.x},${point.y} ${nextPoint.x},${nextPoint.y}`}
              fill={data[i].color}
              fillOpacity={0.6}
            />
          );
        })}
      </g>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Performance Analytics</h2>
      <div style={{ width: '600px', height: '500px', margin: '-50px auto -30px' }}>
        <RadarChart 
          cx={300} 
          cy={300} 
          outerRadius={150} 
          width={600} 
          height={600} 
          data={data}
        >
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="1">
              {data.map((entry, index) => (
                <stop
                  key={entry.subject}
                  offset={`${(index * 100) / (data.length - 1)}%`}
                  stopColor={entry.color}
                />
              ))}
            </linearGradient>
          </defs>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ 
              fill: '#374151', 
              fontSize: 14,
              fontWeight: 500,
              dy: 5
            }}
            tickLine={false}
            axisLine={false}
            cy={300}
            radius={180}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth={1}
            fill="none"
          />
          {renderPolygons()}
        </RadarChart>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((metric) => (
          <div
            key={metric.subject}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            style={{ borderLeftColor: metric.color, borderLeftWidth: '4px' }}
          >
            <h3 className="text-sm font-medium text-gray-600">{metric.subject}</h3>
            <p className="text-2xl font-bold" style={{ color: metric.color }}>
              {Math.round(metric.value)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;