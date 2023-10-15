import DragDrop from "@/app/components/DragDrop";
import Link from "next/link";

export default function Submit() {
  return (
    <main>
      <nav className="flex px-8 py-6 items-center justify-between">
        <Link href="/">
          <h2 className="font-lato font-bold text-xl">Paper:Vision</h2>
        </Link>
      </nav>
      <DragDrop />
    </main>
  );
}
