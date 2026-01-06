'use client';

import { useState, useEffect } from "react";

import { Button } from "@/app/components/ui";

export default function ChannelPage() {
  const [videoList, setVideoList] = useState([]);
  useEffect(() => {
    // setVideoList
  }, []);
  return (
    <>
      {videoList.length === 0 ? (
        <div className="flex flex-col gap-2 min-h-96 items-center justify-center text-white">
          <h2>Tạo nội dung cho kênh của bạn</h2>
          <p>Mọi nội dung công khai của bạn xuất hiện ở đây</p>
          <Button
            text="Tạo"
            onClick={() => { }}
            variant="secondary"
            radius="full"
          />
        </div>
      ) : (
        <div>{/* render video list here */}</div>
      )}
    </>
  )
}
