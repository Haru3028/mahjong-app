import Link from "next/link";
import { menuItems } from "./menuItems";

export default function MenuButtonList() {
  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-4 mt-8">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="base-button w-60 text-center text-lg py-4"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
