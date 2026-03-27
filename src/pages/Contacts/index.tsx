import { useState } from "react";
import { Search, UserPlus, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/shared/Pagination";
import { ConfirmActionModal } from "@/components/shared/ConfirmActionModal";
import { AddContactModal } from "@/pages/Contacts/AddContactModal";
import { ImportCSVModal } from "@/pages/Contacts/ImportCSVModal";
import { formatPhone } from "@/utils/formatters";
import { CONTACT_PAGE_SIZE_OPTIONS, CONTACT_SEGMENTS, useContactsPageController } from "@/controllers/contacts.controller";

export default function Contacts() {
  const {
    contacts,
    total,
    totalPages,
    page,
    pageSize,
    loading,
    search,
    segment,
    selectedIds,
    addOpen,
    importOpen,
    optedFilter,
    setPage,
    setAddOpen,
    setImportOpen,
    setSearchFilter,
    setSegmentFilter,
    setOptedFilterValue,
    setPageSizeValue,
    handleAdd,
    handleDelete,
    handleBulkDelete,
    handleSelectAll,
    handleSelectRow,
  } = useContactsPageController();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full lg:flex-1 lg:max-w-xs transition-colors focus-within:border-green-500 focus-within:bg-white">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
            placeholder="Search contacts..."
            className="bg-transparent border-none outline-none text-[13.5px] text-gray-900 placeholder:text-gray-400 flex-1"
          />
        </div>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {CONTACT_SEGMENTS.map((seg) => (
            <Chip
              key={seg}
              active={segment === seg}
              onClick={() => setSegmentFilter(seg)}
            >
              {seg}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={optedFilter}
            onChange={(event) => {
              setOptedFilterValue(event.target.value as "all" | "opted_in" | "opted_out");
            }}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-[12.5px] text-gray-700 outline-none focus:border-green-500"
          >
            <option value="all">All Opt Status</option>
            <option value="opted_in">Opted In</option>
            <option value="opted_out">Opted Out</option>
          </select>
        </div>

        <div className="flex items-center gap-2 lg:ml-auto flex-wrap">
          {selectedIds.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={13} />}
              onClick={() => setBulkDeleteOpen(true)}
            >
              Delete ({selectedIds.length})
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={<Upload size={13} />}
            onClick={() => setImportOpen(true)}
          >
            Import CSV
          </Button>
          <Button
            size="sm"
            icon={<UserPlus size={13} />}
            onClick={() => setAddOpen(true)}
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Count */}
      <p className="text-[12.5px] text-gray-400">
        Showing <strong className="text-gray-700">{contacts.length}</strong> of{" "}
        <strong className="text-gray-700">{total}</strong> contact
        {total !== 1 ? "s" : ""}
        {selectedIds.length > 0 && (
          <span>
            {" "}
            · <strong className="text-gray-700">
              {selectedIds.length}
            </strong>{" "}
            selected
          </span>
        )}
      </p>

      <Table
        columns={[
          {
            key: "name",
            header: "Name",
            render: (r) => <span className="td-primary">{r.name}</span>,
          },
          {
            key: "phone",
            header: "Phone",
            headerClassName: "col-hide-sm",
            cellClassName: "col-hide-sm",
            render: (r) => (
              <span className="td-mono">{formatPhone(r.phone)}</span>
            ),
          },
          {
            key: "tags",
            header: "Tags",
            headerClassName: "col-hide-md",
            cellClassName: "col-hide-md",
            render: (r) => (
              <div className="flex flex-wrap gap-1">
                {r.tags.map((t) => (
                  <Badge key={t} variant="gray">
                    {t}
                  </Badge>
                ))}
              </div>
            ),
          },
          {
            key: "opted_in",
            header: "Opt-in",
            render: (r) => (
              <Badge variant={r.opted_in ? "green" : "red"} dot={r.opted_in}>
                {r.opted_in ? "Opted in" : "Opted out"}
              </Badge>
            ),
          },
          {
            key: "added",
            header: "Added",
            headerClassName: "col-hide-md",
            cellClassName: "col-hide-md",
            render: (r) => r.added,
          },
          {
            key: "action",
            header: "",
            width: "60px",
            render: (r) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTargetId(r.id);
                }}
                className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                aria-label="Delete contact"
              >
                <Trash2 size={15} />
              </button>
            ),
          },
        ]}
        data={contacts}
        loading={loading}
        selectable
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        emptyText="No contacts found. Try a different search or filter."
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={CONTACT_PAGE_SIZE_OPTIONS}
        loading={loading}
        onPageChange={setPage}
        onPageSizeChange={setPageSizeValue}
      />

      <AddContactModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />
      <ImportCSVModal open={importOpen} onClose={() => setImportOpen(false)} />

      <ConfirmActionModal
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="Delete contact?"
        subtitle="This action cannot be undone."
        description="Are you sure you want to delete this contact?"
        confirmText="Yes, Delete"
        cancelText="No"
        onConfirm={async () => {
          if (!deleteTargetId) return;
          await handleDelete(deleteTargetId);
        }}
      />

      <ConfirmActionModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title="Delete selected contacts?"
        subtitle={`You are about to delete ${selectedIds.length} contact${selectedIds.length !== 1 ? "s" : ""}.`}
        description="This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No"
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
