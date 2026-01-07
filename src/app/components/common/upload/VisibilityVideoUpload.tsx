"use client"

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ChevronDown, HelpCircle } from "lucide-react";

import { Button, CheckBox } from "@/app/components/ui";
import { VideoPart } from "@/types/video";
import { VideoPlayer } from "@/app/components/common";

interface VisibilityVideoUploadPros {
  parts: VideoPart[],
  formStatus?: string,
  videoUrl: string,
  videoFileName: string,
  privacy: string,
  setPrivacy: (privacy: string) => void,
  errorForm: string,
  typeVisibility: string,
  setTypeVisibility: (type: string) => void,
  uploadingVideo: boolean,
}

export default function VisibilityVideoUpload({ uploadingVideo, parts, formStatus, privacy, setPrivacy, videoUrl, videoFileName, typeVisibility, setTypeVisibility, errorForm }: VisibilityVideoUploadPros) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('00:00');
  const [timezone, setTimezone] = useState('');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [isPremiere, setIsPremiere] = useState(false);
  const [errorTime, setErrorTime] = useState('');
  const hasError = errorForm === "visibility"
  const dateRef = useRef<HTMLInputElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const timezoneDropdownRef = useRef<HTMLDivElement>(null);

  const timezones = [
    { value: 'Asia/Ho_Chi_Minh', label: 'Việt Nam (GMT+7)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
    { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
    { value: 'Asia/Seoul', label: 'Seoul (GMT+9)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)' },
    { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (GMT+8)' },
    { value: 'Asia/Manila', label: 'Manila (GMT+8)' },
    { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7)' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+11)' },
    { value: 'Pacific/Auckland', label: 'Auckland (GMT+13)' },
    { value: 'Europe/London', label: 'London (GMT+0)' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+1)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
    { value: 'America/Chicago', label: 'Chicago (GMT-6)' },
  ];

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  }, []);

  // Get timezone offset
  const getTimezoneOffset = (tz: string) => {
    const offsets: Record<string, number> = {
      'Asia/Ho_Chi_Minh': 7,
      'Asia/Bangkok': 7,
      'Asia/Singapore': 8,
      'Asia/Tokyo': 9,
      'Asia/Seoul': 9,
      'Asia/Shanghai': 8,
      'Asia/Hong_Kong': 8,
      'Asia/Kuala_Lumpur': 8,
      'Asia/Manila': 8,
      'Asia/Jakarta': 7,
      'Australia/Sydney': 11,
      'Pacific/Auckland': 13,
      'Europe/London': 0,
      'Europe/Paris': 1,
      'Europe/Berlin': 1,
      'America/New_York': -5,
      'America/Los_Angeles': -8,
      'America/Chicago': -6,
    };
    return offsets[tz] || 0;
  };

  const validateDateTime = useCallback(() => {
    if (!selectedDate || !selectedTime) {
      setErrorTime('Vui lòng chọn ngày và giờ');
      return false;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hours, minutes] = selectedTime.split(':').map(Number);

    const now = new Date();
    const currentOffset = -now.getTimezoneOffset() / 60; // Current timezone offset
    const selectedOffset = getTimezoneOffset(timezone);
    const offsetDiff = selectedOffset - currentOffset;

    const nowInSelectedTZ = new Date(now.getTime() + offsetDiff * 60 * 60 * 1000);

    const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

    if (selectedDateTime <= nowInSelectedTZ) {
      setErrorTime('Thời gian được chọn phải trong tương lai');
      return false;
    }

    setErrorTime('');
    return true;
  }, [selectedDate, selectedTime, timezone]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTimeDropdown(false);
      }

      if (
        timezoneDropdownRef.current &&
        !timezoneDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTimezoneDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    validateDateTime();
  }, [validateDateTime]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        options.push(timeStr);
      }
    }
    return options;
  };
  return (
    <>
      <div className="px-10 w-full">
        <h3 className="text-white text-xl font-bold mb-2">Chế độ hiển thị</h3>
        <p className="text-white text-sm mb-4">Chọn thời điểm xuất bản và những ai có thể thấy video của bạn</p>
        <div className="flex justify-between py-4 w-full">
          <div className="flex flex-col gap-6 flex-1 w-2/3 pr-8 ">
            <div onClick={() => { setTypeVisibility("privacy") }} className="relative cursor-pointer flex flex-col border-2 p-4 bg-neutral-800 rounded-lg border-neutral-700 hover:border-white focus-within:border-white focus-within:outline-white focus-within:outline-offset-2 transition-all duration-200">
              {typeVisibility !== 'privacy' && (
                <Button
                  icon={<ChevronDown size={20} />}
                  variant="outline"
                  className="absolute border-none right-0 top-1/3 p-2!"
                  radius="full"
                />
              )}
              <p>Lưu hoặc xuất bản</p>
              <span className="text-xs font-semibold text-neutral-500">Đặt video của bạn ở chế độ <span className="font-bold">công khai</span>, <span className="font-bold">không công khai</span> hoặc <span className="font-bold">riêng tư</span></span>
              {(typeVisibility === "privacy") && (
                <div className={`relative flex flex-col mb-4 gap-3 pl-4 py-2`}>
                  <label
                    className={`flex items-start gap-2 rounded-lg cursor-pointer transition-all`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="radio"
                        checked={privacy === 'private'}
                        onChange={() => { setPrivacy('private'); }}
                        className="w-5 h-5 appearance-none cursor-pointer rounded-full
                                                    border-2 border-neutral-600 bg-neutral-700
                                                    checked:bg-transparent checked:border-[7px] checked:border-white
                                                    transition-all"
                      />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="text-white font-sm">
                        Riêng tư
                      </span>
                      <span className="text-xs text-neutral-400">Chỉ bạn và những người bạn chọn mới xem được video của bạn</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 rounded-lg cursor-pointer transition-all`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="radio"
                        checked={privacy === 'unlisted'}
                        onChange={() => { setPrivacy('unlisted'); }}
                        className="w-5 h-5 appearance-none cursor-pointer rounded-full
                                                    border-2 border-neutral-600 bg-neutral-700
                                                    checked:bg-transparent checked:border-[7px] checked:border-white
                                                    transition-all"
                      />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="text-white font-sm">
                        Không công khai
                      </span>
                      <span className="text-xs text-neutral-400">Bất kì ai có đường liên kết đến video đều có thể xem video</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 rounded-lg cursor-pointer transition-all`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="radio"
                        checked={privacy === 'public'}
                        onChange={() => { setPrivacy('public'); }}
                        className="w-5 h-5 appearance-none cursor-pointer rounded-full
                                                    border-2 border-neutral-600 bg-neutral-700
                                                    checked:bg-transparent checked:border-[7px] checked:border-white
                                                    transition-all"
                      />
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <span className="text-white font-sm">
                        Công khai
                      </span>
                      <span className="text-xs text-neutral-400">Mọi người đều xem được video của bạn</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div onClick={() => { setTypeVisibility("schedule") }} className="relative cursor-pointer flex flex-col border-2 p-4 bg-neutral-800 rounded-lg border-neutral-700 hover:border-white focus-within:border-white focus-within:outline-white focus-within:outline-offset-2 transition-all duration-200">
              {typeVisibility !== 'schedule' && (
                <Button
                  icon={<ChevronDown size={20} />}
                  variant="outline"
                  className="absolute border-none right-0 top-1/3 p-2!"
                  radius="full"
                />
              )}
              <p>Lên lịch</p>
              <span className="text-xs font-semibold text-neutral-500">Chọn ngày để chuyển video của bạn sang chế độ <span className="font-bold">công khai</span></span>
              {(typeVisibility === "schedule") && (
                <div className="relative flex flex-col mb-4 gap-3 py-2">
                  <div className="flex gap-3">
                    {/* Date Picker */}
                    <div onClick={() => dateRef.current?.showPicker()} className="relative flex items-center flex-1 min-w-[180px] cursor-pointer">
                      <input
                        type="date"
                        ref={dateRef}
                        value={selectedDate}
                        min={getTodayDate()}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full scheme-dark appearance-none text-sm bg-neutral-700
                                                 text-white px-4 py-3 rounded-lg border-2 border-neutral-600 hover:border-white
                                                  outline-none transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                      />
                      <ChevronDown className="absolute cursor-pointer right-3 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Time Picker Dropdown */}
                    <div ref={timeDropdownRef} className="relative flex justify-center items-center">
                      <Button
                        icon={<ChevronDown className="w-4 h-4" />}
                        text={selectedTime}
                        iconPosition="right"
                        variant="outline"
                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                        className="px-4 py-3 bg-neutral-700! text-sm hover:bg-neutral-600 text-white rounded-lg border-2 border-neutral-600 hover:border-white
                                                  outline-none transition-all font-normal whitespace-nowrap flex items-center gap-2"
                      />

                      {/* Timezone Dropdown Menu */}
                      {showTimeDropdown && (
                        <div className="absolute top-0 mt-2 right-0 flex flex-col bg-neutral-700 border border-neutral-600 rounded-lg shadow-xl z-10 max-h-50 overflow-y-auto">
                          {generateTimeOptions().map((t) => (
                            <Button
                              key={t}
                              text={t}
                              onClick={() => {
                                setSelectedTime(t);
                                setShowTimeDropdown(false);
                              }}
                              variant="outline"
                              className={` text-left text-nowrap border-none text-sm px-1! py-1! hover:bg-gray-600 transition-colors`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timezone Dropdown Button */}
                    <div ref={timezoneDropdownRef} className="relative flex justify-center items-center">
                      <Button
                        icon={<ChevronDown className="w-4 h-4" />}
                        text={timezone !== '' ? timezone : 'Múi giờ'}
                        iconPosition="right"
                        variant="outline"
                        onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                        className="px-4 py-3 w-[120px] text-sm bg-neutral-700! hover:bg-neutral-600 text-white rounded-lg border-2 border-neutral-600 hover:border-white
                                                  outline-none transition-all font-normal! items-center"
                        nowrap={true}
                      />

                      {/* Timezone Dropdown Menu */}
                      {showTimezoneDropdown && (
                        <div className="absolute top-0 mt-2 right-0 flex flex-col bg-neutral-700 border border-neutral-600 rounded-lg shadow-xl z-10 max-h-50 overflow-y-auto">
                          {timezones.map((tz) => (
                            <Button
                              key={tz.value}
                              text={tz.label}
                              onClick={() => {
                                setTimezone(tz.value);
                                setShowTimezoneDropdown(false);
                              }}
                              variant="outline"
                              className={` text-left text-nowrap border-none text-sm px-1! py-1! hover:bg-gray-600 transition-colors`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Help Icon */}
                    <HelpCircle className="w-5 h-5 text-gray-400" />

                  </div>

                  {/* Error Message */}
                  {errorTime && (
                    <div className="flex items-start gap-2 text-red-500 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{errorTime}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {!errorTime && selectedDate && selectedTime && (
                    <div className="text-gray-400 text-sm">
                      Video sẽ ở chế độ <span className="font-semibold text-white">riêng tư</span> trước khi xuất bản
                    </div>
                  )}

                  {/* Premiere Checkbox */}
                  <CheckBox
                    checked={isPremiere}
                    onCheckedChange={(e) => setIsPremiere(e.target.checked)}
                    label="Đặt làm video công chiếu"
                    className="mt-6"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="h-80 sticky top-10 flex flex-col justify-start items-end">
            <div className="aspect-video w-80 rounded-t-lg shadow-lg overflow-hidden bg-black">
              {uploadingVideo ? (<div>Đang tải video ...</div>) : (<VideoPlayer parts={parts} />)}
            </div>
            <div className="bg-neutral-900 w-80 rounded-b-lg flex flex-col p-2">
              <span className="text-xs text-neutral-500 font-semibold" >Đường liên kết của video</span>
              <Link href="#" className="underline text-blue-400 mb-3">
                https://www.kiwame.com/...
              </Link>
              <span className="text-xs text-neutral-500 font-semibold">Tên tệp</span>
              <span className="text-base truncate">{videoFileName}</span>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
