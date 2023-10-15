import DragDrop from "@/app/components/DragDrop";
import Link from "next/link";
import Image from "next/image";

export default function Submit() {
  return (
    <main className="bg-bm h-[100vh] relative">
      <Image
        src="/mainBg.jpg"
        width={2880}
        height={1620}
        alt=""
        className="absolute h-full w-screen object-cover -z-1 opacity-40"
      />
      ;
      <nav className="flex px-8 py-[0.9rem] pb-[0.8rem] items-center justify-between text-white relative border-white border-b-2">
        <h2 className="font-lato font-bold text-2xl">Paper:Vision</h2>
      </nav>
      <DragDrop />
    </main>
  );
}
