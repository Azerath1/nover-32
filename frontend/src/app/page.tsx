// src/app/page.tsx
import NovelsSections from "@/components/NovelsSections";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Теперь всё управление сеткой внутри этого компонента */}
      <NovelsSections />
      <div className="mt-10 flex justify-center"></div>
    </main>
  );
}
