import { AppHeader as Navbar } from "@/components/navigation/Navbar";
import { KPICard } from "../components/StatCard";
import { mockServiceRequests } from "../services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/helpers";

export function StaffDashboard() {
  // In a real app, we'd filter by user ID
  const myRequests = mockServiceRequests;

  return (
    <>
      <Navbar
        title="Staff Portal"
        subtitle="Track your service requests"
        actions={
          <Button asChild size="sm">
            <Link to="/service-requests/new">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        }
      />

      <div className="space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard
            title="My Requests"
            value={myRequests.length}
            icon="work-orders"
          />
          <KPICard
            title="In Progress"
            value={myRequests.filter((r) => r.status === "in_progress").length}
            icon="clock"
            variant="warning"
          />
          <KPICard
            title="Resolved"
            value={myRequests.filter((r) => r.status === "resolved").length}
            icon="completed"
            variant="success"
          />
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{request.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {request.category}
                      </span>
                      <span>
                        Submitted{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize text-[10px]",
                      request.status === "resolved"
                        ? "text-emerald-400 border-emerald-400/20"
                        : request.status === "in_progress"
                        ? "text-blue-400 border-blue-400/20"
                        : "text-amber-400 border-amber-400/20",
                    )}
                  >
                    {request.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
