'use client';

import Link from 'next/link';

interface ProductBreadcrumbProps {
  productName: string;
}

export default function ProductBreadcrumb({ productName }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center">
      <Link href="/" className="text-[#4D4C44] text-[14px] text-[400] hover:text-gray-900 transition-colors">
        Home
      </Link>
      <span className="mx-2 text-[#6A7282] w-[10px] h-[10px] flex items-center justify-center">/</span>
      <span className="text-[#12100E] text-[14px] font-[500] truncate max-w-2xl">{productName}</span>
    </nav>
  );
}
