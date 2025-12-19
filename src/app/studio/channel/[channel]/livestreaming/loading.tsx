export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-[#0f0f0f] text-white">
      <div className="flex flex-col items-center gap-4">

        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
          <div className="absolute inset-0 rounded-full border-4 border-t-red-500 animate-spin" />
        </div>

        <p className="text-sm text-gray-400 animate-pulse">
          Đang khởi tạo phòng live...
        </p>
      </div>
    </div>
  );
}
