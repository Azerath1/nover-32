import Link from "next/link";
import { BookOpen } from "lucide-react";
// Импортируем нужные иконки
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание остается прежним */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-500"
            >
              <BookOpen className="h-7 w-7" />
              <span>Novera</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Читайте лучшие ранобэ и новеллы онлайн.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Навигация
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-blue-500 transition-colors"
                >
                  Каталог
                </Link>
              </li>
              <li>
                <Link
                  href="/rankings"
                  className="hover:text-blue-500 transition-colors"
                >
                  Рейтинг
                </Link>
              </li>
              <li>
                <Link
                  href="/updates"
                  className="hover:text-blue-500 transition-colors"
                >
                  Форум
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-500 transition-colors"
                >
                  О проекте
                </Link>
              </li>
            </ul>
          </div>

          {/* Полезные ссылки */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Информация
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/rules"
                  className="hover:text-blue-500 transition-colors"
                >
                  Правила сайта
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="hover:text-blue-500 transition-colors"
                >
                  Поддержать проект
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="hover:text-blue-500 transition-colors"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-500 transition-colors"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Социальные сети с новыми иконками */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Сообщество
            </h3>
            <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="#"
                  className="group flex items-center gap-3 hover:text-blue-500 transition-all duration-300"
                >
                  <div className="transition-transform duration-300 group-hover:-translate-y-1">
                    <FaDiscord className="h-5 w-5 text-[#5865F2]" />
                  </div>
                  <span className="font-medium">Discord</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="group flex items-center gap-3 hover:text-blue-500 transition-all duration-300"
                >
                  <div className="transition-transform duration-300 group-hover:-translate-y-1">
                    <FaTelegramPlane className="h-5 w-5 text-[#24A1DE]" />
                  </div>
                  <span className="font-medium">Telegram</span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="group flex items-center gap-3 hover:text-blue-500 transition-all duration-300"
                >
                  <div className="transition-transform duration-300 group-hover:-translate-y-1">
                    <SiTiktok className="h-5 w-5 text-black dark:text-white" />
                  </div>
                  <span className="font-medium">TikTok</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
