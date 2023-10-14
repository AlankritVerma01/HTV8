import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav className="flex px-8 py-6 items-center justify-between">
        <h2 className="font-lato font-bold text-xl">Paper:Vision</h2>
        <Link href={"/submit"} className="">
          App Demo
        </Link>
      </nav>
      <div className="w-full h-[80vh] flex flex-col justify-center items-center">
        <div className="w-max flex flex-col items-center">
          <h2 className="font-lato font-bold text-5xl mb-6">Paper:Vision</h2>
          <p className="font-poppins text-xl">
            Enhance your learning experience with interactive mind maps
          </p>
          <div className="flex font-poppins mt-4 gap-x-6">
            <Link
              href={"https://hack-the-valley-7.devpost.com/"}
              className="p-2 border-2 border-black rounded-full"
            >
              Learn More
            </Link>
            <Link
              href={"/submit"}
              className="p-2 border-2 border-black rounded-full"
            >
              Try it Out
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
