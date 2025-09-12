import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Risk = "Safe" | "Warning" | "Outbreak";

interface Village {
  id: number;
  name: string;
  lat: number;
  lng: number;
  risk: Risk;
}

const VILLAGES: Village[] = [
  { id: 1, name: "Guwahati (Assam)", lat: 26.1445, lng: 91.7362, risk: "Warning" },
  { id: 2, name: "Shillong (Meghalaya)", lat: 25.5788, lng: 91.8933, risk: "Outbreak" },
  { id: 3, name: "Imphal (Manipur)", lat: 24.8170, lng: 93.9368, risk: "Safe" },
  { id: 4, name: "Aizawl (Mizoram)", lat: 23.7271, lng: 92.7176, risk: "Warning" },
  { id: 5, name: "Kohima (Nagaland)", lat: 25.6740, lng: 94.1077, risk: "Safe" },
  { id: 6, name: "Agartala (Tripura)", lat: 23.8315, lng: 91.2868, risk: "Safe" },
];

export default function MapView() {
  const [filter, setFilter] = useState<Risk | "All">("All");
  const [zoom, setZoom] = useState(1);
  const [active, setActive] = useState<number | null>(null);
  const [src, setSrc] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665352.7454585633!2d92.06795144788524!3d26.21469283022108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374f651182a461ab%3A0xd8b5c2e1f67bebf0!2sNortheast%20India!5e0!3m2!1sen!2sin!4v1757688948044!5m2!1sen!2sin",
  );

  useEffect(() => {
    if (active == null) {
      setSrc(
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665352.7454585633!2d92.06795144788524!3d26.21469283022108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374f651182a461ab%3A0xd8b5c2e1f67bebf0!2sNortheast%20India!5e0!3m2!1sen!2sin!4v1757688948044!5m2!1sen!2sin",
      );
      return;
    }
    const v = VILLAGES.find((x) => x.id === active)!;
    // center map on village using simple q=lat,lng embed
    setSrc(`https://www.google.com/maps?q=${v.lat},${v.lng}&z=11&output=embed`);
  }, [active]);

  const points = useMemo(
    () => VILLAGES.filter((v) => (filter === "All" ? true : v.risk === filter)),
    [filter],
  );

  function openExternal(v: Village) {
    window.open(`https://www.google.com/maps?q=${v.lat},${v.lng}`, "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Community Map — Northeast India</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Filter:</span>
                <Button variant={filter === "All" ? "default" : "outline"} size="sm" onClick={() => setFilter("All")}>All</Button>
                <Button variant={filter === "Safe" ? "default" : "outline"} size="sm" onClick={() => setFilter("Safe")}>Safe</Button>
                <Button variant={filter === "Warning" ? "default" : "outline"} size="sm" onClick={() => setFilter("Warning")}>Warning</Button>
                <Button variant={filter === "Outbreak" ? "default" : "outline"} size="sm" onClick={() => setFilter("Outbreak")}>Outbreak</Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Map zoom (visual):</span>
                <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}>-</Button>
                <span className="w-8 text-center">{zoom.toFixed(1)}x</span>
                <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(1)))}>+</Button>
              </div>
            </div>

            <div className="aspect-[16/10] w-full overflow-hidden rounded-lg border bg-white" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
              <iframe
                src={src}
                title="Northeast India Map"
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-3 text-sm text-muted-foreground">Click a place on the right to focus the map. Use Open in Maps to view full interactive map.</div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Places & Risk Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {points.map((v) => (
                <div key={v.id} className={`w-full rounded-md border p-3 transition-colors ${active === v.id ? "bg-emerald-50 border-emerald-200" : "hover:bg-muted/50"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">Lat {v.lat.toFixed(3)}, Lng {v.lng.toFixed(3)}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={v.risk === "Outbreak" ? "destructive" : v.risk === "Warning" ? "secondary" : "default"}>{v.risk}</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setActive(v.id)}>Focus</Button>
                        <Button size="sm" variant="ghost" onClick={() => openExternal(v)}>Open</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
