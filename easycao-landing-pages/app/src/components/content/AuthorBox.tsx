import Image from "next/image";
import { DIOGO } from "../../lib/constants";

export default function AuthorBox() {
  return (
    <div className="bg-gray-light rounded-2xl p-6 flex gap-4 items-start">
      <Image
        src={DIOGO.photo}
        alt={DIOGO.name}
        width={64}
        height={64}
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
