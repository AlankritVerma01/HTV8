import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <main className="bg-bm h-[100vh] relative">
      <Image
        src="/mainBg.jpg"
        width={2880}
        height={1620}
        alt=""
        className="absolute h-full w-screen object-cover -z-1"
      />
      <nav className="flex px-8 py-6 items-center justify-between text-white relative">
        <h2 className="font-lato font-bold text-2xl">Paper:Vision</h2>
        <Link
          href={"/submit"}
          className="font-poppins font-medium border-[0.2rem] border-white rounded-full py-2 px-8"
        >
          App Demo
        </Link>
      </nav>
      <div className="w-full h-[80vh] flex flex-col justify-center items-center relative">
        <div className="w-max flex flex-col items-center">
          <h2 className="font-lato font-bold text-5xl mb-6 text-white">
            Paper:Vision
          </h2>
          <p className="font-poppins text-xl text-white">
            Enhance your learning experience with interactive mind maps
          </p>
          <div className="flex font-poppins mt-4 gap-x-6">
            <Link
              href={"https://hack-the-valley-7.devpost.com/"}
              className="p-2 border-2 border-black rounded-full text-white"
            >
              Learn More
            </Link>
            <Link
              href={"/submit"}
              className="p-2 border-2 border-black rounded-full text-white"
            >
              Try it Out
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
