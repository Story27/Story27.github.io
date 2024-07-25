import EditPageComponent from "@/components/pages/edit-problem/edit-problem";

export default function EditContestPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditPageComponent contestId={params.id} />;
}
