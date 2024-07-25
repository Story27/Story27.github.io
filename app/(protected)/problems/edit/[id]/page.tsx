import EditPageComponent from "@/components/pages/edit-problem/edit-problem";

export default function EditProblemPage({
  params,
}: {
  params: { id: string };
}) {
  return <EditPageComponent problemId={params.id} />;
}
