import Link from "next/link";
import { RiGithubFill, RiInstagramFill, RiMailFill } from "@remixicon/react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* 왼쪽: 카피라이트 */}
          <div className="text-gray-400 text-sm">
            <p>© 2025 DevMemory. Built with Next.js • Powered by Notion API</p>
          </div>

          {/* 오른쪽: 소셜 링크 */}
          <div className="flex items-center gap-6">
            {/* GitHub */}
            <Link
              href="https://github.com/Aprasaks"
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <RiGithubFill className="w-5 h-5" />
            </Link>

            {/* Instagram */}
            <Link
              href="https://instagram.com/Aprasaks30"
              target="_blank"
              className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
              aria-label="Instagram"
            >
              <RiInstagramFill className="w-5 h-5" />
            </Link>

            {/* 이메일 */}
            <Link
              href="mailto:heavenin24@naver.com"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              aria-label="Email"
            >
              <RiMailFill className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
