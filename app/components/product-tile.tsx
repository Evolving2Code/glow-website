"use client";

import Image from "next/image";
import type { Product } from "../content";
import { PRODUCT_EVENT } from "./contact-form";

export function ProductTile({ product }: { product: Product }) {
  return (
    <a
      href="#contact"
      onClick={() => window.dispatchEvent(new CustomEvent(PRODUCT_EVENT, { detail: product.name }))}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-[#cfd5dc] hover:shadow-[0_10px_30px_-12px_rgba(20,32,46,0.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1152px) 360px, (min-width: 640px) 31vw, 48vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <h4 className="text-[0.9375rem] font-semibold leading-snug">{product.name}</h4>
        <span className="hidden shrink-0 text-xs font-semibold text-brand-text opacity-0 transition group-hover:opacity-100 sm:inline">
          Quote →
        </span>
      </div>
    </a>
  );
}
