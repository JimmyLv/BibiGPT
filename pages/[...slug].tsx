import type { NextPage } from "next";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { useToast } from "~/hooks/use-toast";
import Sentence from "../components/Sentence";
import SquigglyLines from "../components/SquigglyLines";
import { useSummarize } from "~/hooks/useSummarize";
import { CHECKOUT_URL } from "~/utils/constants";
import { extractTimestamp } from "~/utils/extractTimestamp";
import { TypeAnimation } from "react-type-animation";

let isSecureContext = false;

if (typeof window !== "undefined") {
  isSecureContext = window.isSecureContext;
}

export const Home: NextPage = () => {
  const router = useRouter();
  const urlState = router.query.slug;
  const searchParams = useSearchParams();
  const licenseKey = searchParams.get("license_key");
  const [curVideo, setCurVideo] = useState<string>("");
  const [currentBvId, setCurrentBvId] = useState<string>("");
  const [userKey, setUserKey] = useLocalStorage<string>("user-openai-apikey");
  const { loading, summary, resetSummary, summarize } = useSummarize();
  const { toast } = useToast();

  useEffect(() => {
    licenseKey && setUserKey(licenseKey);
  }, [licenseKey]);

  useEffect(() => {
    const isValidatedUrl =
      urlState &&
      router.isReady &&
      !curVideo &&
      typeof urlState !== "string" &&
      urlState.every((subslug: string) => typeof subslug === "string");

    if (isValidatedUrl) {
      generateSummary(
        `https://bilibili.com/${(urlState as string[]).join("/")}`
      );
    }
    // TODO: find reason to trigger twice
  }, [router.isReady, urlState]);

  const validateUrl = (url?: string) => {
    if (url) {
      if (!url.includes("bilibili.com")) {
        toast({
          // variant: "destructive",
          title: "暂不支持此视频链接",
          description: "请输入哔哩哔哩视频长链接，暂不支持b23.tv或av号",
        });
        return;
      }
      setCurVideo(url);
    } else {
      if (!curVideo.includes("bilibili.com")) {
        toast({
          // variant: "destructive",
          title: "暂不支持此视频链接",
          description: "请输入哔哩哔哩视频长链接，暂不支持b23.tv或av号",
        });
        return;
      }
      const curUrl = String(curVideo.split(".com")[1]);
      router.replace(curUrl);
    }
  };
  const generateSummary = async (url?: string) => {
    resetSummary();
    validateUrl(url);

    const videoUrl = url ? url : curVideo;
    const matchResult = videoUrl.match(/\/video\/([^\/\?]+)/);
    if (!matchResult) {
      return;
    }
    const bvId = matchResult[1];
    setCurrentBvId(matchResult[1]);

    await summarize(bvId, userKey);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 10);
  };
  const onFormSubmit = async (e: any) => {
    e.preventDefault();
    await generateSummary();
  };

  const summaryArray = summary.split("- ");
  const formattedSummary = summaryArray
    .map((s) => {
      const matchResult = s.match(/\s*(\d+[\.:]\d+)(.*)/);
      if (matchResult) {
        const { formattedContent, timestamp } = extractTimestamp(matchResult);
        return timestamp + formattedContent;
      } else {
        return s.replace(/\n\n/g, "\n");
      }
    })
    .join("\n- ");

  const handleCopy = () => {
    if (!isSecureContext) {
      toast({ description: "复制错误 ❌" });
      return;
    }
    // todo: update the timestamp
    navigator.clipboard.writeText(
      formattedSummary + "\n\n via #BibiGPT b.jimmylv.cn @吕立青_JimmyLv"
    );
    toast({ description: "复制成功 ✂️" });
  };

  return (
    <div className="mt-10 sm:mt-40">
      <a
        target="_blank"
        rel="noreferrer"
        className="mx-auto mb-5 hidden max-w-fit rounded-full border-2 border-dashed px-4 py-1 text-gray-500 transition duration-300 ease-in-out hover:scale-105 hover:border-gray-700 md:block"
        href="https://www.bilibili.com/video/BV1fX4y1Q7Ux/"
      >
        你只需要把任意 Bilibili 视频 URL 中的后缀 "
        <span className="text-pink-400">.com</span>" 改成我的域名 "
        <span className="text-sky-400">jimmylv.cn</span>" 就行啦！😉
        <br />
        比如 www.bilibili.
        <span className="text-pink-400 line-through">com</span>
        /video/BV1k84y1e7fW 👉 www.bilibili.
        <span className="text-sky-400 underline">jimmylv.cn</span>
        /video/BV1k84y1e7fW
      </a>
  
      <div className="max-w-5xl text-center text-4xl font-bold sm:text-7xl">
        一键总结{" "}
        <span className="relative whitespace-nowrap	text-pink-400">
          <SquigglyLines />
          <TypeAnimation
            sequence={[
              "哔哩哔哩",
              3000,
              "YouTube",
              3000,
              "播客",
              3000,
              "会议",
              3000,
              () => {
                console.log("Done typing!"); // Place optional callbacks anywhere in the array
              },
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            className="relative text-pink-400	"
          />
        </span>{" "}
        音视频内容 <br />
        <div className="mt-4">Powered by GPT-3.5 AI</div>
      </div>
      <p className="mt-10 text-center text-lg text-gray-500 sm:text-2xl">
        在下面的输入框，直接复制粘贴
        <a
          className="text-sky-400"
          href="https://www.bilibili.com/video/BV1fX4y1Q7Ux/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" bilibili.com "}
        </a>
        视频链接 👇
      </p>
      <details>
        <summary className="mt-10 flex cursor-pointer items-center space-x-3	">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-left font-medium">
            <span className="text-sky-400 hover:text-sky-600">
              请使用自己的 API Key
            </span>
            （终于，支持
            <a
              className="text-pink-400 hover:underline"
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              「购买次数」
            </a>
            啦！
            <a href="/wechat.jpg" target="_blank" rel="noopener noreferrer">
              也可以真的
              <span className="text-pink-400 hover:underline">
                「给我打赏」
              </span>
              哦 🤣）
            </a>
          </p>
        </summary>
        <div className="text-lg text-slate-700 dark:text-slate-400">
          <input
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            className="mx-auto my-4 w-full appearance-none rounded-lg rounded-md border bg-transparent py-2 pl-2 text-sm leading-6 text-slate-900 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              "填你的 OpenAI API Key: sk-xxxxxx 或者购买的 License Key: xxx-CCDE-xxx"
            }
          />
          <div className="relin-paragraph-target mt-1 text-base text-slate-500">
            <div>
              如何获取你自己的 License Key
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 mb-6 pl-2 font-semibold text-sky-500 dark:text-sky-400"
              >
                https://shop.jimmylv.cn
              </a>
            </div>
          </div>
        </div>
      </details>
      <form onSubmit={onFormSubmit} className="grid place-items-center">
        <input
          type="text"
          value={curVideo}
          onChange={(e) => setCurVideo(e.target.value)}
          className="mx-auto mt-10 w-full appearance-none rounded-lg rounded-md border bg-transparent py-2 pl-2 text-sm leading-6 text-slate-900 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={"输入 bilibili.com 视频链接，按下「回车」"}
        />
        {!loading && (
          <button
            className="z-10 mx-auto mt-7 w-3/4 rounded-2xl border-gray-500 bg-sky-400 p-3 text-lg font-medium text-white transition hover:bg-sky-500 sm:mt-10 sm:w-1/3"
            type="submit"
          >
            一键总结
          </button>
        )}
        {loading && (
          <button
            className="z-10 mx-auto mt-7 w-3/4 cursor-not-allowed rounded-2xl border-gray-500 bg-sky-400 p-3 text-lg font-medium transition hover:bg-sky-500 sm:mt-10 sm:w-1/3"
            disabled
          >
            <div className="flex items-center justify-center text-white">
              <Image
                src="/loading.svg"
                alt="Loading..."
                width={28}
                height={28}
              />
            </div>
          </button>
        )}
      </form>
      {summary && (
        <div className="mb-8 px-4">
          <h3 className="m-8 mx-auto max-w-3xl border-t-2 border-dashed pt-8 text-center text-2xl font-bold sm:text-4xl">
            <a
              href={curVideo}
              className="hover:text-pink-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {`【📝 总结：${currentBvId}】`}
            </a>
          </h3>
          <div
            className="mx-auto mt-6 max-w-3xl cursor-copy rounded-xl border-2 bg-white p-4 text-lg leading-7 shadow-md transition hover:bg-gray-50"
            onClick={handleCopy}
          >
            {summaryArray.map((sentence, index) => (
              <div key={index}>
                {sentence.length > 0 && (
                  <Sentence bvId={currentBvId} sentence={sentence} />
                )}
              </div>
            ))}
          </div>
          <div className="mx-auto mt-7 flex max-w-3xl flex-row-reverse gap-x-4">
            <a
              className="w-32 cursor-pointer rounded-lg bg-pink-400 px-2 py-1 text-center font-medium text-white hover:bg-pink-400/80"
              href="https://space.bilibili.com/37648256"
              target="_blank"
              rel="noopener noreferrer"
            >
              （关注我 😛）
            </a>
            <a
              href={curVideo}
              className="w-24 cursor-pointer rounded-lg bg-sky-400 px-2 py-1 text-center font-medium text-white hover:bg-sky-400/80"
              target="_blank"
              rel="noreferrer"
            >
              回到视频
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
