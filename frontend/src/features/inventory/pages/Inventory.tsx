import { useState, useMemo, useEffect } from "react";
import { Plus, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/feedback/EmptyState";
import { SkeletonTable } from "@/components/feedback/Skeletons";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { AppHeader } from "@/components/navigation/Navbar";
import { PageIntro } from "@/components/layout/PageIntro";
import { toast } from "sonner";
import {
  inventoryService,
  type InventoryItemRecord,
} from "../services/inventory.service";
import { cn } from "@/utils/helpers";
import { EditInventoryItemDialog } from "../components/EditInventoryItemDialog";

export function Inventory() {
  const { canManageInventory } = useRoleAccess();
  const [viewMode, setViewMode] = useState<"items" | "overview">("items");
  const [inventoryItems, setInventoryItems] = useState<InventoryItemRecord[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItemRecord | null>(null);
  const [receiveItem, setReceiveItem] = useState<InventoryItemRecord | null>(
    null,
  );
  const [inventoryAction, setInventoryAction] = useState<
    "receive" | "issue" | "adjust" | "transfer"
  >("receive");
  const [transferDestinationId, setTransferDestinationId] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [receiveLocationId, setReceiveLocationId] = useState("");
  const [receiveQuantity, setReceiveQuantity] = useState("1");
  const [receiveReference, setReceiveReference] = useState("");
  const [receiving, setReceiving] = useState(false);
  const [stockLocations, setStockLocations] = useState<
    import("../services/inventory.service").StockLocation[]
  >([]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    unitCost: "15.00",
    minLevel: "5",
    unitOfMeasure: "each",
    reorderLevel: "10",
  });

  const fetchItems = () => {
    setLoading(true);
    setApiError(null);
    inventoryService
      .listItems()
      .then((result) => {
        setInventoryItems(result ?? []);
      })
      .catch((err: { message?: string }) => {
        setApiError(err.message || "Unable to load inventory from backend API");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    void inventoryService
      .listLocations()
      .then(setStockLocations)
      .catch(() => toast.error("Unable to load stock locations"));
  }, []);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    inventoryItems.forEach((item) => {
      if (item.categoryId && !seen.has(item.categoryId))
        seen.set(item.categoryId, item.categoryId);
    });
    // Category names are not included in the inventory response yet; use IDs until the API exposes them.
    return [...seen.entries()].map(([id, name]) => ({ _id: id, name }));
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        categoryFilter === "all" || item.categoryId === categoryFilter;
      const matchStat =
        statusFilter === "all" ||
        item.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchCat && matchStat;
    });
  }, [inventoryItems, search, categoryFilter, statusFilter]);

  return (
    <div className="min-h-full bg-background text-foreground">
      <AppHeader title="Inventory" hideQuickCreate />
      {/* Page Header */}
      <div className="border-b border-border bg-card px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <PageIntro
              title={
                viewMode === "overview"
                  ? "Inventory Overview"
                  : "Inventory Catalog"
              }
              description={
                viewMode === "overview"
                  ? "Monitor stock levels, critical restock thresholds, and parts distributions."
                  : "Comprehensive catalog lookup, available quantity monitoring, and physical tracking tags."
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("items")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  viewMode === "items"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All Items
              </button>
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className={cn(
                  "rounded-md px-3 py-1.5 transition-colors",
                  viewMode === "overview"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Dashboard
              </button>
            </div>

            {canManageInventory && viewMode === "items" && (
              <Button onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar (Items View) */}
        {viewMode === "items" && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-64">
              <SearchInput
                placeholder="Search items or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category: All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchItems}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="p-4 sm:p-6 lg:p-8">
        {viewMode === "items" ? (
          loading ? (
            <div role="status" aria-live="polite">
              <span className="sr-only">Loading inventory catalog…</span>
              <SkeletonTable rows={6} columns={7} />
            </div>
          ) : apiError ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive space-y-3">
              <AlertCircle className="h-10 w-10 text-destructive opacity-80" />
              <div>
                <h3 className="font-semibold text-lg">Backend API Notice</h3>
                <p className="text-sm text-destructive/80 mt-1 max-w-md">
                  {apiError}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Endpoint{" "}
                  <code className="bg-muted px-1 py-0.5 rounded font-mono">
                    GET /api/v1/inventory/items
                  </code>{" "}
                  returned an error.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchItems}
                className="mt-2"
              >
                Retry Connection
              </Button>
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No inventory items found"
              description={
                search
                  ? "Try adjusting your search criteria."
                  : "No items have been added to the inventory catalog yet."
              }
              actionLabel={canManageInventory ? "Add Item" : undefined}
              onAction={
                canManageInventory ? () => setShowAddModal(true) : undefined
              }
            />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Unit of Measure</TableHead>
                      <TableHead className="text-center">Min Stock</TableHead>
                      <TableHead className="text-center">Reorder Lvl</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-semibold text-foreground">
                          {item.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {item.sku}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.unitOfMeasure}
                        </TableCell>
                        <TableCell className="text-center font-medium text-foreground">
                          {item.minimumStockLevel}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {item.reorderLevel}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditItem(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInventoryAction("receive");
                                setReceiveItem(item);
                              }}
                            >
                              Receive
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInventoryAction("issue");
                                setReceiveItem(item);
                              }}
                            >
                              Issue
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInventoryAction("adjust");
                                setReceiveItem(item);
                              }}
                            >
                              Adjust
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setInventoryAction("transfer");
                                setReceiveItem(item);
                              }}
                            >
                              Transfer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        ) : (
          <InventoryOverviewView />
        )}
      </main>

      {/* Add Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="!max-w-4xl w-[calc(100vw-2rem)] !h-[calc(100dvh-2rem)] !max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <p className="text-sm text-muted-foreground">Add stock details so quantities and replenishment can be managed accurately.</p>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name || !form.sku) {
                toast.error("Name and SKU are required.");
                return;
              }
              inventoryService
                .createItem({
                  name: form.name,
                  sku: form.sku,
                  unitOfMeasure: form.unitOfMeasure,
                  minimumStockLevel: Number(form.minLevel) || 5,
                  reorderLevel: Number(form.reorderLevel) || 10,
                })
                .then(() => {
                  toast.success("Inventory item created");
                  setShowAddModal(false);
                  fetchItems();
                })
                .catch(() => toast.error("Failed to create inventory item"));
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input
                id="item-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Chiller Filter Cartridge"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="item-uom">Unit of Measure</Label>
                <Select
                  value={form.unitOfMeasure}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, unitOfMeasure: v }))
                  }
                >
                  <SelectTrigger id="item-uom">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="each">Each</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="case">Case</SelectItem>
                    <SelectItem value="gallon">Gallon</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                    <SelectItem value="ft">Feet</SelectItem>
                    <SelectItem value="m">Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-reorder">Reorder Level</Label>
                <Input
                  id="item-reorder"
                  type="number"
                  min={0}
                  value={form.reorderLevel}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reorderLevel: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="item-sku">SKU *</Label>
                <Input
                  id="item-sku"
                  value={form.sku}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sku: e.target.value }))
                  }
                  placeholder="CHL-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-min">Min Stock Level</Label>
                <Input
                  id="item-min"
                  type="number"
                  value={form.minLevel}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, minLevel: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <EditInventoryItemDialog
        item={editItem}
        open={!!editItem}
        onOpenChange={(open) => {
          if (!open) setEditItem(null);
        }}
        onSaved={() => {
          setEditItem(null);
          fetchItems();
        }}
      />
      <Dialog
        open={!!receiveItem}
        onOpenChange={(open) => {
          if (!open) setReceiveItem(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {inventoryAction === "receive"
                ? "Receive stock"
                : inventoryAction === "issue"
                ? "Issue stock"
                : inventoryAction === "adjust"
                ? "Adjust stock"
                : "Transfer stock"}
            </DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (
                !receiveItem ||
                !receiveLocationId ||
                Number(receiveQuantity) === 0 ||
                (inventoryAction !== "adjust" && Number(receiveQuantity) < 0) ||
                (inventoryAction === "adjust" && !adjustReason.trim()) ||
                (inventoryAction === "transfer" &&
                  (!transferDestinationId ||
                    transferDestinationId === receiveLocationId))
              )
                return;
              setReceiving(true);
              const payload = {
                itemId: receiveItem._id,
                stockLocationId: receiveLocationId,
                quantity: Number(receiveQuantity),
                reference: receiveReference || undefined,
                reason: adjustReason || undefined,
              };
              void (
                inventoryAction === "receive"
                  ? inventoryService.receive(payload)
                  : inventoryAction === "issue"
                  ? inventoryService.issue(payload)
                  : inventoryAction === "adjust"
                  ? inventoryService.adjust({
                      itemId: payload.itemId,
                      stockLocationId: payload.stockLocationId,
                      quantity: payload.quantity,
                      reason: payload.reason!,
                    })
                  : inventoryService.transfer({
                      itemId: payload.itemId,
                      sourceLocationId: payload.stockLocationId,
                      destinationLocationId: transferDestinationId,
                      quantity: payload.quantity,
                      reference: payload.reference,
                    })
              )
                .then(() => {
                  toast.success(
                    `${
                      inventoryAction === "receive"
                        ? "Received"
                        : inventoryAction === "issue"
                        ? "Issued"
                        : inventoryAction === "adjust"
                        ? "Adjusted"
                        : "Transferred"
                    } ${receiveQuantity} ${receiveItem.unitOfMeasure} of ${
                      receiveItem.name
                    }`,
                  );
                  setReceiveItem(null);
                  setReceiveLocationId("");
                  setTransferDestinationId("");
                  setReceiveQuantity("1");
                  setReceiveReference("");
                  setAdjustReason("");
                  fetchItems();
                })
                .catch(() => toast.error("Unable to receive stock"))
                .finally(() => setReceiving(false));
            }}
          >
            <p className="text-sm text-muted-foreground">
              {inventoryAction === "receive"
                ? "Record incoming stock for"
                : "Record stock issued from"}{" "}
              <span className="font-medium text-foreground">
                {receiveItem?.name}
              </span>
              .
            </p>
            <div className="space-y-2">
              <Label htmlFor="receive-location">
                {inventoryAction === "transfer"
                  ? "Source location *"
                  : "Stock location *"}
              </Label>
              <Select
                value={receiveLocationId}
                onValueChange={setReceiveLocationId}
              >
                <SelectTrigger id="receive-location">
                  <SelectValue
                    placeholder={
                      stockLocations.length
                        ? "Select a stock location"
                        : "No stock locations available"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {stockLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                      {location.code ? ` (${location.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {inventoryAction === "transfer" ? (
              <div className="space-y-2">
                <Label htmlFor="transfer-destination">
                  Destination location *
                </Label>
                <Select
                  value={transferDestinationId}
                  onValueChange={setTransferDestinationId}
                >
                  <SelectTrigger id="transfer-destination">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockLocations
                      .filter((location) => location.id !== receiveLocationId)
                      .map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                          {location.code ? ` (${location.code})` : ""}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="receive-quantity">
                {inventoryAction === "adjust"
                  ? "Adjustment quantity *"
                  : "Quantity *"}
              </Label>
              <Input
                id="receive-quantity"
                type="number"
                min={inventoryAction === "adjust" ? undefined : "0.01"}
                step="0.01"
                value={receiveQuantity}
                onChange={(event) => setReceiveQuantity(event.target.value)}
                required
              />
            </div>
            {inventoryAction === "adjust" ? (
              <div className="space-y-2">
                <Label htmlFor="adjust-reason">Reason *</Label>
                <Input
                  id="adjust-reason"
                  value={adjustReason}
                  onChange={(event) => setAdjustReason(event.target.value)}
                  placeholder="e.g. Cycle count correction"
                  required
                />
              </div>
            ) : null}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReceiveItem(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  receiving ||
                  !receiveLocationId ||
                  Number(receiveQuantity) === 0 ||
                  (inventoryAction !== "adjust" &&
                    Number(receiveQuantity) < 0) ||
                  (inventoryAction === "adjust" && !adjustReason.trim()) ||
                  (inventoryAction === "transfer" &&
                    (!transferDestinationId ||
                      transferDestinationId === receiveLocationId))
                }
              >
                {receiving
                  ? "Saving…"
                  : inventoryAction === "receive"
                  ? "Receive stock"
                  : inventoryAction === "issue"
                  ? "Issue stock"
                  : inventoryAction === "adjust"
                  ? "Adjust stock"
                  : "Transfer stock"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InventoryOverviewView() {
  const [overview, setOverview] = useState<
    import("../services/inventory.service").InventoryOverview | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inventoryService
      .overview()
      .then((res) => setOverview(res))
      .catch((err) =>
        setError(err.message || "Failed to load inventory overview"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-border bg-card p-4 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
        <AlertCircle className="h-8 w-8 mb-2 opacity-80" />
        <h3 className="font-semibold text-base">
          Unable to load inventory dashboard
        </h3>
        <p className="text-xs opacity-80 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Catalog Items
          </p>
          <p className="mt-2 text-3xl font-extrabold text-foreground">
            {overview.totalItems}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Low Stock Alerts
          </p>
          <p className="mt-2 text-3xl font-extrabold text-warning">
            {overview.lowStockItems}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Reserved Items
          </p>
          <p className="mt-2 text-3xl font-extrabold text-info">
            {overview.reservedItems}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Categories
          </p>
          <p className="mt-2 text-3xl font-extrabold text-foreground">
            {overview.categoriesCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
