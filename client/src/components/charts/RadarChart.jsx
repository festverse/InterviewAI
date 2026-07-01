import { ResponsiveContainer, RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const RadarChart = ({ scores }) => {
  // Map scores (1-10) for the chart
  const data = [
    { subject: 'Clarity', A: scores.clarity || 0, fullMark: 10 },
    { subject: 'Depth', A: scores.technicalDepth || 0, fullMark: 10 },
    { subject: 'Structure', A: scores.structure || 0, fullMark: 10 },
    { subject: 'Pacing', A: scores.pacing || 0, fullMark: 10 },
    { subject: 'No Fillers', A: scores.fillerWords || 0, fullMark: 10 }, // Assuming higher is better here
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="A"
            stroke="var(--accent-primary)"
            fill="var(--accent-primary)"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--text-primary)' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
