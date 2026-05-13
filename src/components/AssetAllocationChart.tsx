import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E'];

export default function AssetAllocationChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            innerRadius={75} 
            outerRadius={95} 
            paddingAngle={5}
            dataKey="value" 
            nameKey="type"
            animationDuration={1500}
          >
            {data.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />)}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
