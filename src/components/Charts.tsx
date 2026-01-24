import {
    Area,
    AreaChart,
    Bar,
    BarChart as RechartsBarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { cn } from '../lib/utils';

// --- Types ---
export interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

export interface ChartProps {
    data: ChartData[];
    title?: string;
    description?: string;
    color?: string;
    className?: string;
    height?: number | string;
}

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.value.toLocaleString()}
                        {entry.name !== 'value' && <span className="text-xs text-gray-500 ml-1">({entry.name})</span>}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- Gradient Defs ---
const GlowDefs = ({ id, color }: { id: string; color: string }) => (
    <defs>
        <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.5} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={`glow-${id}`} height="300%" width="300%" x="-75%" y="-75%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
);

// --- Neon Line Chart ---
export const NeonLineChart = ({ data, title, description, color = "#8B5CF6", className, height = 300 }: ChartProps) => {
    return (
        <div className={cn("p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm", className)}>
            <div className="mb-6">
                {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
                {description && <p className="text-sm text-gray-400">{description}</p>}
            </div>
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <GlowDefs id="line" color={color} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#666"
                            tick={{ fill: '#999', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#999', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fill={`url(#gradient-line)`}
                            filter={`url(#glow-line)`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- Glass Bar Chart ---
export const GlassBarChart = ({ data, title, description, color = "#10B981", className, height = 300 }: ChartProps) => {
    return (
        <div className={cn("p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm", className)}>
            <div className="mb-6">
                {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
                {description && <p className="text-sm text-gray-400">{description}</p>}
            </div>
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#666"
                            tick={{ fill: '#999', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#666"
                            tick={{ fill: '#999', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                        <Bar
                            dataKey="value"
                            fill={color}
                            radius={[4, 4, 0, 0]}
                            animationDuration={1500}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={color} fillOpacity={0.6 + (index / data.length) * 0.4} /> // Gradient effect
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- Holo Pie Chart ---
const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const HoloPieChart = ({ data, title, description, className, height = 300 }: ChartProps) => {
    return (
        <div className={cn("p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm", className)}>
            <div className="mb-6">
                {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
                {description && <p className="text-sm text-gray-400">{description}</p>}
            </div>
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            animationDuration={1500}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{ filter: `drop-shadow(0px 0px 6px ${COLORS[index % COLORS.length]}60)` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
