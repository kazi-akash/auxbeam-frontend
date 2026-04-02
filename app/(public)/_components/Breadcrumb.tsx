import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-[#F3F4F6] py-4">
      <div className="container mx-auto px-4">
        <ol className="flex items-center text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.href ? (
                <Link 
                  href={item.href}
                  className="hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
