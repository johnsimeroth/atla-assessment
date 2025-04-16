"use client";

import Image from "next/image";
import { MetricsSidebar } from "@/app/lib/components/MetricsSidebar/MetricsSidebar";
import { Prompt } from "@/app/lib/components/Prompt/Prompt";
import { useSelectedPrompt } from "@/app/useSelectedPrompt";

export default function Home() {
  const { selectedPrompt, handleSetSelectedPrompt, selectedMetric } =
    useSelectedPrompt();

  return (
    <>
      <main className="min-h-screen w-full bg-gray flex items-stretch flex-col p-2.5">
        <header className="h-16 min-h-16 flex items-center justify-between p-2">
          <Image src="/atla-logo.svg" alt="Atla Logo" width="75" height="24" />
        </header>
        <div className="flex flex-grow min-h-0">
          <div className="w-96 min-w-96 h-full">
            <MetricsSidebar
              selectedPrompt={selectedPrompt}
              selectedMetric={selectedMetric}
              setSelectedPrompt={handleSetSelectedPrompt}
            />
          </div>
          <div className="flex-col justify-between flex gap-2.5">
            <Prompt
              selectedPrompt={selectedPrompt}
              selectedMetric={selectedMetric}
              setSelectedPrompt={handleSetSelectedPrompt}
            />
          </div>
        </div>
      </main>
    </>
  );
}
