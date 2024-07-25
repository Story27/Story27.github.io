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
  differenceInSeconds,
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

const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "acceptance",
    header: "Acceptance",
  },
];

export default function ContestPage({ contestId }: { contestId: string }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const [contest, setContest] = useState<Contest | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetch(`/api/contests/${contestId}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch contest data");
        const contestData = await response.json();
        setContest(contestData);
        setData(contestData.problems);
        setLoading(false);

        const start = new Date(contestData.startTime);
        const now = new Date();
        if (isBefore(now, start)) {
          setTimeLeft(differenceInSeconds(start, now));
        }
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError("Failed to load contest data. Please try again.");
      }
    };

    fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

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
      {contest && (
        <div className="text-center py-4 text-2xl font-bold">
          {contest.name}
        </div>
      )}
      <div className="flex items-center py-4 px-8">
        <Input
          placeholder="Filter problems..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-gray-800 text-white"
        />
      </div>
      <div className="rounded-md border border-gray-700 mx-8">
        {timeLeft !== null ? (
          <div className="text-center py-8">
            Contest starts in {Math.floor(timeLeft / 3600)}h{" "}
            {Math.floor((timeLeft % 3600) / 60)}m {timeLeft % 60}s
          </div>
        ) : (
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
                    onClick={() => router.push(`/problems/${row.original.id}`)}
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
        )}
      </div>
    </div>
  );
}
