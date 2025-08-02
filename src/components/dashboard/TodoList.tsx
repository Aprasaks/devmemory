// src/components/dashboard/TodoList.tsx
import { RiCheckboxCircleFill, RiCheckboxBlankCircleLine, RiTimeLine } from "@remixicon/react";

interface Todo {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

interface TodoListProps {
  selectedDate: number;
  todos: Todo[];
  onClose: () => void;
  onToggleTodo: (todoId: string) => void;
}

export default function TodoList({ selectedDate, todos, onClose, onToggleTodo }: TodoListProps) {
  const currentMonth = new Date().getMonth();

  const getPriorityBgColor = (priority: "High" | "Medium" | "Low"): string => {
    switch (priority) {
      case "High":
        return "bg-red-400";
      case "Medium":
        return "bg-yellow-400";
      case "Low":
        return "bg-green-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="rounded-xl p-6 border border-gray-700 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {currentMonth + 1}월 {selectedDate}일 할 일
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => onToggleTodo(todo.id)}
            >
              {todo.completed ? (
                <RiCheckboxCircleFill className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <RiCheckboxBlankCircleLine className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}

              <div className="flex-1">
                <p
                  className={`text-sm ${todo.completed ? "line-through text-gray-500" : "text-white"}`}
                >
                  {todo.title}
                </p>
              </div>

              <div className={`w-2 h-2 rounded-full ${getPriorityBgColor(todo.priority)}`}></div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <RiTimeLine className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>이 날에는 할 일이 없습니다</p>
          </div>
        )}
      </div>

      {todos && todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex justify-between text-sm text-gray-400">
            <span>완료: {todos.filter((todo) => todo.completed).length}개</span>
            <span>전체: {todos.length}개</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
