'use client';

import { useEffect, useState } from "react";

export default function PlayListsPage() {
  const [videoList, setVideoList] = useState([]);
  useEffect(() => {
    // setVideoList
  }, []);
  return (
    <>
      {videoList.length === 0 ? (
        <div className="flex flex-col gap-2 min-h-96 items-center justify-center text-white">
          <h2>Danh sách phát</h2>
          <p>Chưa có danh sách phát nào cho bạn hãy xem video và thêm nó vào danh sách phát</p>
        </div>
      ) : (
        <div>{/* render video list here */}</div>
      )}
    </>
  )
}
