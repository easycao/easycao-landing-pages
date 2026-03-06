import Image from "next/image";
import { DIOGO } from "../../lib/constants";

export default function AuthorBox() {
  return (
    <div className="bg-white border border-gray-border border-l-4 border-l-primary rounded-2xl shadow-sm p-6 flex gap-4 items-start">
      <Image
        src={DIOGO.photo}
        alt={DIOGO.name}
        width={80}
        height={80}
        className="rounded-full shrink-0"
      />
      <div>
        <p className="font-bold text-black">{DIOGO.name}</p>
        <p className="text-sm text-primary font-medium">{DIOGO.title}</p>
        <p className="text-sm text-black/60 mt-1 leading-relaxed">
          {DIOGO.bio}
        </p>
      </div>
    </div>
  );
}
