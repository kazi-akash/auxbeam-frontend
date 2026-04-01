'use client';

import Link from 'next/link';

interface ProductBreadcrumbProps {
  productName: string;
}

export default function ProductBreadcrumb({ productName }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm font-sans">
      <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
        Home
      </Link>
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-900 font-medium truncate max-w-2xl">{productName}</span>
    </nav>
  );
}
