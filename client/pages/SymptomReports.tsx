import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Report {
  id: number;
  name: string;
  village: string;
  symptoms: string[];
  date: string;
}

const VILLAGES = ["Sundarpur", "Nalanda", "Gopalganj", "Rajpur", "Basantpur", "Mithapur"];
const SYMPTOMS = ["Diarrhea", "Fever", "Vomiting", "Dehydration", "Abdominal Pain", "Fatigue"];

export default function SymptomReports() {
  const [name, setName] = useState("");
  const [village, setVillage] = useState(VILLAGES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem("sch-reports");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Rekha Devi", village: "Sundarpur", symptoms: ["Diarrhea", "Fever"], date: new Date().toISOString().slice(0,10) },
      { id: 2, name: "Arun Kumar", village: "Nalanda", symptoms: ["Vomiting"], date: new Date(Date.now()-86400000).toISOString().slice(0,10) },
    ];
  });

  useEffect(() => {
    localStorage.setItem("sch-reports", JSON.stringify(reports));
  }, [reports]);

  function toggle(sym: string, checked: boolean) {
    setSymptoms((prev) => (checked ? [...prev, sym] : prev.filter((s) => s !== sym)));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const r: Report = { id: Date.now(), name: name.trim(), village, symptoms: [...symptoms], date };
    setReports((prev) => [r, ...prev]);
    setName("");
    setSymptoms([]);
  }

  const counts = useMemo(() => ({
    total: reports.length,
    today: reports.filter((r) => r.date === new Date().toISOString().slice(0,10)).length,
  }), [reports]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submit Symptom Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div className="grid gap-2">
                <Label>Village</Label>
                <Select value={village} onValueChange={setVillage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent>
                    {VILLAGES.map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-3">
                <Label>Symptoms</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SYMPTOMS.map((sym) => {
                    const checked = symptoms.includes(sym);
                    return (
                      <label key={sym} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={checked} onCheckedChange={(c) => toggle(sym, !!c)} />
                        <span>{sym}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full">Submit Report</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <MiniStat title="Total Reports" value={counts.total} />
          <MiniStat title="Today" value={counts.today} />
        </div>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Submitted Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.village}</TableCell>
                    <TableCell className="text-xs">{r.symptoms.join(", ") || "—"}</TableCell>
                    <TableCell>{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border p-4 bg-white">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
