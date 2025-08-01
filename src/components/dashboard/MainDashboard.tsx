"use client";

// src/components/dashboard/MainDashboard.tsx
import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import TodoList from "./TodoList";

interface Todo {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

export default function MainDashboard() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [todoData, setTodoData] = useState<Record<number, Todo[]>>({});
  const [loading, setLoading] = useState(true);

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("/api/todos");
        if (response.ok) {
          const data = await response.json();
          setTodoData(data);
        } else {
          console.error("투두 데이터 로딩 실패");
        }
      } catch (error) {
        console.error("투두 데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
  };

  const handleCloseTodo = () => {
    setSelectedDate(null);
  };

  const handleToggleTodo = async (todoId: string) => {
    const todo = Object.values(todoData)
      .flat()
      .find((t) => t.id === todoId);

    if (todo) {
      try {
        const response = await fetch("/api/todos/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todoId: todoId,
            completed: todo.completed,
          }),
        });

        if (response.ok) {
          // 데이터 새로고침
          const todosResponse = await fetch("/api/todos");
          if (todosResponse.ok) {
            const updatedData = await todosResponse.json();
            setTodoData(updatedData);
          }
        } else {
          console.error("투두 상태 업데이트 실패");
        }
      } catch (error) {
        console.error("투두 토글 실패:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">DevMemory Dashboard</h1>
            <p className="text-gray-400">개발 학습을 체계적으로 관리하세요</p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-white">노션 데이터를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DevMemory Dashboard</h1>
          <p className="text-gray-400">개발 학습을 체계적으로 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 달력 섹션 */}
          <div
            className={`
            transition-all duration-500 ease-in-out
            ${selectedDate ? "lg:col-span-7" : "lg:col-span-12"}
          `}
          >
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              todoData={todoData}
            />
          </div>

          {/* 투두리스트 섹션 */}
          {selectedDate && (
            <div className="lg:col-span-5">
              <TodoList
                selectedDate={selectedDate}
                todos={todoData[selectedDate] || []}
                onClose={handleCloseTodo}
                onToggleTodo={handleToggleTodo}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
