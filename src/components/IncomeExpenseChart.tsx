import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function IncomeExpenseChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#94A3B8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={20} animationDuration={1500} />
          <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={20} animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
