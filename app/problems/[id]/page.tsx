"use client";
import ProblemPage from "@/components/pages/problems/page";

export default function EditProblemPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProblemPage problemId={params.id} />;
}
