import Link from "next/link";
import Image from "next/image";

interface NovelCardProps {
  id: number;
  slug: string;
  title: string;
  image: string;
  chapters: number;
  genre: string;
}

export default function NovelCard({ slug, title, image }: NovelCardProps) {
  return (
    <Link href={`/novel/${slug}`} className="group block w-full">
      <div className="flex flex-col gap-2">
        {/* Контейнер картинки: фото не двигается */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 33vw, 12vw"
            className="object-cover transition-opacity duration-300 "
          />
          {/* Легкая рамка, которая появляется при наведении, не меняя размер */}
          <div className="absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-blue-500/50 rounded-md" />
        </div>

        {/* Название: меняет цвет, не меняя положение */}
        <h3 className="line-clamp-2 text-center text-[13px] font-medium leading-tight text-foreground transition-all duration-300 group-hover:text-blue-500 underline-offset-4 group-hover:underline decoration-blue-500/30">
          {title}
        </h3>
      </div>
    </Link>
  );
}
