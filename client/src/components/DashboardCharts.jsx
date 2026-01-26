import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#059669', '#eab308', '#f97316', '#06b6d4', '#8b5cf6'];

const DashboardCharts = ({ monthlyData, pieData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends */}
            <div className="card h-96 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white shrink-0">Monthly Trends</h3>
                <div className="flex-1 min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #292524', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="income" fill="#059669" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#f97316" radius={[4, 4, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Expense Breakdown */}
            <div className="card h-96 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white shrink-0">Expense Breakdown</h3>
                <div className="flex-1 min-h-0 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #292524', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardCharts;
