"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/pages/navbar/navbar";
import {
  formatDistanceToNow,
  isBefore,
  isAfter,
  differenceInMinutes,
} from "date-fns";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string;
}

interface Contest {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
}

const columns: ColumnDef<Contest>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ getValue }) => {
      const startTime = getValue<string>();
      return formatDistanceToNow(new Date(startTime), { addSuffix: true });
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const { startTime, endTime } = row.original;
      const start = new Date(startTime);
      const end = new Date(endTime);
      const duration = differenceInMinutes(end, start);
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { startTime, endTime } = row.original;
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (isBefore(now, start)) {
        return `Starts in ${formatDistanceToNow(start)}`;
      } else if (isAfter(now, end)) {
        return "Ended";
      } else {
        return "Live";
      }
    },
  },
];

export default function ContestPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`/api/contests`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch contest data");
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError("Failed to load contest data. Please try again.");
      }
    };

    fetchContests();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="h-screen mx-auto py-5 bg-black text-white">
      <Navbar />
      <div className="flex items-center py-4 px-8">
        <Input
          placeholder="Filter contests..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-gray-800 text-white"
        />
      </div>
      <div className="rounded-md border border-gray-700 mx-8">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Skeleton className="w-full h-8 bg-gray-700" />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => router.push(`/contests/${row.original.id}`)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
