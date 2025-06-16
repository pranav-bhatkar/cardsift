"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

export type DataStreamDelta = {
  type:
    | "text-delta"
    | "code-delta"
    | "sheet-delta"
    | "image-delta"
    | "title"
    | "id"
    | "suggestion"
    | "clear"
    | "finish"
    | "kind";
  content: string | any;
};

export function DataStreamHandler({
  id,
  onStreamUpdate,
}: {
  id: string;
  onStreamUpdate?: (delta: DataStreamDelta) => void;
}) {
  const { data: dataStream } = useChat({ id });
  const lastProcessedIndex = useRef(-1);
  console.log("DataStreamHandler initialized with id:", id);
  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;
    console.log("New deltas:", newDeltas);

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      if (onStreamUpdate) {
        onStreamUpdate(delta);
      }
    });
  }, [dataStream, onStreamUpdate]);

  return null;
}
