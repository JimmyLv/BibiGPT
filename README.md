# 🤖 BiliGPT 哔哩哔哩 · 视频内容一键总结

备用地址：https://chat-bilibili-video.vercel.app

This project summarizes Bilibili videos for you using AI.

🤯 Inspired by [Nutlope/news-summarizer](https://github.com/Nutlope/news-summarizer) & [zhengbangbo/chat-simplifier](https://github.com/zhengbangbo/chat-simplifier/) & [lxfater/BilibiliSummary](https://github.com/lxfater/BilibiliSummary)

[![哔哩哔哩视频总结工具](./public/screenshot.png)](https://twitter.com/Jimmy_JingLv/status/1630137750572728320?s=20)

[【BiliGPT】AI 自动总结 B站 视频内容，GPT-3 智能提取并总结字幕](https://www.bilibili.com/video/BV1fX4y1Q7Ux/?vd_source=dd5a650b0ad84edd0d54bb18196ecb86)

## How it works

This project uses the [OpenAI GPT-3.5 API](https://openai.com/api/) (specifically, gpt-3.5-turbo) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming and [Upstash](https://console.upstash.com/) for Redis cache and rate limiting. It fetches the content on a Bilibili video, sends it in a prompt to the GPT-3 API to summarize it via a Vercel Edge function, then streams the response back to the application.

## Saving costs

Projects like this can get expensive so in order to save costs if you want to make your own version and share it publicly, I recommend three things:

- [ ] 1. Implement rate limiting so people can't abuse your site
- [x] 2. Implement caching to avoid expensive AI re-generations
- [x] 3. Use `text-curie-001` instead of `text-dacinci-003` in the `summarize` edge function

## Running Locally

After cloning the repo, go to [OpenAI](https://beta.openai.com/account/api-keys) to make an account and put your API key in a file called `.env`.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JimmyLv/BiliGPT&env=OPENAI_API_KEY&project-name=chat-bilibili-video&repo-name=chat-bilibili-video)

