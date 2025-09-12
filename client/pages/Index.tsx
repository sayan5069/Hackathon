import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BellRing, Droplets, Thermometer, Waves } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SensorRow {
  village: string;
  metric: string;
  value: number | string;
  status: "Safe" | "Warning" | "Outbreak";
}

const initialSeries = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i}:00`,
  ph: 6.8 + Math.sin(i / 3) * 0.3 + (Math.random() - 0.5) * 0.1,
  turbidity: 2 + Math.abs(Math.cos(i / 2) * 1.2) + Math.random() * 0.4,
  temperature: 22 + Math.sin(i / 2.5) * 4 + Math.random() * 0.8,
}));

export default function Index() {
  const [series, setSeries] = useState(initialSeries);
  const [alerts, setAlerts] = useState([
    { id: 1, type: "Warning", title: "Elevated turbidity", village: "Sundarpur", time: "5m ago" },
    { id: 2, type: "Outbreak", title: "Reported diarrhea cluster", village: "Nalanda", time: "1h ago" },
    { id: 3, type: "Warning", title: "Low pH levels", village: "Gopalganj", time: "2h ago" },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const nextHour = (parseInt(last.time) + 1) % 24;
        const next = {
          time: `${nextHour}:00`,
          ph: clamp(6.8 + (Math.random() - 0.5) * 0.4, 6.4, 7.6),
          turbidity: clamp(2 + Math.random() * 2.2, 0.5, 5.5),
          temperature: clamp(21 + Math.random() * 8, 18, 32),
        };
        return [...prev.slice(1), next];
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const latestReadings: SensorRow[] = useMemo(
    () => [
      { village: "Sundarpur", metric: "pH", value: series[series.length - 1].ph.toFixed(2), status: "Warning" },
      { village: "Nalanda", metric: "Turbidity (NTU)", value: series[series.length - 1].turbidity.toFixed(1), status: "Safe" },
      { village: "Gopalganj", metric: "Temperature (°C)", value: series[series.length - 1].temperature.toFixed(1), status: "Safe" },
      { village: "Rajpur", metric: "Turbidity (NTU)", value: (1.4 + Math.random() * 2).toFixed(1), status: "Warning" },
      { village: "Basantpur", metric: "pH", value: (7 + (Math.random() - 0.5) * 0.6).toFixed(2), status: "Safe" },
    ],
    [series],
  );

  return (
    <div className="space-y-6">
      {/* Top summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Waves className="h-5 w-5 text-sky-600" />} title="Total Villages" value="128" sub="monitored" />
        <StatCard icon={<BellRing className="h-5 w-5 text-amber-600" />} title="Active Alerts" value={alerts.length.toString()} sub="live" />
        <StatCard icon={<Droplets className="h-5 w-5 text-emerald-600" />} title="Recent Reports" value="32" sub="last 24h" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Water Quality Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ph" stroke="#10b981" strokeWidth={2} dot={false} name="pH" />
                <Line type="monotone" dataKey="turbidity" stroke="#0284c7" strokeWidth={2} dot={false} name="Turbidity" />
                <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} name="Temperature" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">pH Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="ph" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="ph" stroke="#10b981" fillOpacity={1} fill="url(#ph)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Readings + Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Latest Sensor Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Village</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestReadings.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.village}</TableCell>
                    <TableCell>{r.metric}</TableCell>
                    <TableCell>{r.value}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Alerts</CardTitle>
            <Button variant="outline" size="sm" onClick={() =>
              setAlerts((prev) => [
                ...prev,
                { id: Date.now(), type: Math.random() > 0.6 ? "Outbreak" : "Warning", title: "Auto-detected anomaly", village: "Rajpur", time: "just now" },
              ])
            }>Refresh</Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {alerts.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-md border p-3">
                  <div className={cnStatus(a.type)}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{a.title}</span>
                      <Badge variant={a.type === "Outbreak" ? "destructive" : "secondary"}>{a.type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.village} • {a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, sub }: { icon: React.ReactNode; title: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {sub ? <div className="text-xs text-muted-foreground mt-1">{sub}</div> : null}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: SensorRow["status"] }) {
  const map = {
    Safe: "border-emerald-200 text-emerald-700 bg-emerald-50",
    Warning: "border-amber-200 text-amber-700 bg-amber-50",
    Outbreak: "border-red-200 text-red-700 bg-red-50",
  } as const;
  return <span className={"inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium " + map[status]}>{status}</span>;
}

function cnStatus(type: "Warning" | "Outbreak") {
  return type === "Outbreak"
    ? "mt-1 grid h-7 w-7 place-items-center rounded-full bg-red-100 text-red-600"
    : "mt-1 grid h-7 w-7 place-items-center rounded-full bg-amber-100 text-amber-600";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
