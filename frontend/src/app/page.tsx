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
        className="absolute h-full w-screen object-cover -z-1 opacity-40"
      />
      <nav className="flex px-8 py-6 pb-2 items-center justify-between text-white relative border-white border-b-2 hover:border-pp ease-in">
        <h2 className="font-lato font-bold text-2xl">Paper:Vision</h2>
        <Link
          href={"/submit"}
          className="font-poppins font-medium border-[0.17rem] border-white rounded-full py-2 px-8 hover:border-tt ease-in"
        >
          App Demo <span>&#8594;</span>
        </Link>
      </nav>
      <div className="w-full h-[80vh] top-10 flex flex-col justify-center items-center relative">
        <div className="w-max flex flex-col p-20 items-center border-white border-dashed border-2 border-opacity-40">
          {/* <h2 className="font-lato font-bold text-6xl mb-10 text-white">
            Paper:Vision
          </h2> */}
          <Image
            src="/PaperVision.png"
            width={600}
            height={300}
            alt=""
            className="mb-6 w-1/2"
          />
          <p className="font-poppins text-2xl text-white mb-12">
            Enhance your learning experience with{" "}
            <span className="underline">interactive mind maps</span>{" "}
            <span className="text-2xl">&#128218;</span>
          </p>
          <div className="flex font-poppins mt-4 gap-x-6">
            <Link
              href={"https://hack-the-valley-7.devpost.com/"}
              className="py-4 px-6 border-2 border-tt hover:bg-tt ease-in rounded-full text-white"
            >
              Learn About Our Project
            </Link>
            <Link
              href={"/submit"}
              className="py-4 px-6 border-2 border-pp  hover:bg-pp ease-in rounded-full text-white"
            >
              Visualize Your Favorite Article
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
