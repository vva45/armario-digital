import { notFound } from "next/navigation";
import { WardrobeLayout } from "../../../components/WardrobeLayout";
import { wardrobeUses, type WardrobeUse } from "../../../domain/wardrobe";

export function generateStaticParams() { return wardrobeUses.map((use) => ({ use })); }
export default async function UsePage({ params }: { params: Promise<{ use: string }> }) {
  const { use } = await params;
  if (!wardrobeUses.includes(use as WardrobeUse)) notFound();
  return <WardrobeLayout use={use as WardrobeUse} />;
}
