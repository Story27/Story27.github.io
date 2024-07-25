"use client";

import ContestPage from "@/components/pages/contests/page";

export default function EditContestPage({
  params,
}: {
  params: { id: string };
}) {
  return <ContestPage contestId={params.id} />;
}
