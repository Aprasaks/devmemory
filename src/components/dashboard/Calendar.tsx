// src/components/dashboard/Calendar.tsx
import { useState } from "react";

interface CalendarProps {
  selectedDate: number | null;
  onDateSelect: (date: number) => void;
  todoData: Record<number, any[]>;
}

export default function Calendar({ selectedDate, onDateSelect, todoData }: CalendarProps) {
  // 현재 날짜 정보
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const currentDate = now.getDate();
  const today = new Date();
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  // 달력 생성을 위한 함수들
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  // 월 이동 함수들
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 달력 렌더링
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 빈 셀들 (이전 달)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 md:h-16"></div>);
    }

    // 실제 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === currentDate;
      const hasEvents = todoData[day] && todoData[day].length > 0;
      const isSelected = selectedDate === day;

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(day)}
          className={`
            h-12 md:h-16 flex flex-col items-center justify-center cursor-pointer
            rounded-lg transition-all duration-200 relative text-white
            ${isToday ? "font-bold" : "hover:bg-gray-800"}
            ${isSelected ? "ring-2 ring-white" : ""}
          `}
        >
          {isToday && <span className="text-xs text-gray-400 mb-1">Today</span>}
          <span className="text-sm md:text-base">{day}</span>
          {hasEvents && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          {currentYear}년 {monthNames[currentMonth]}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-gray-400 text-sm font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
    </div>
  );
}
