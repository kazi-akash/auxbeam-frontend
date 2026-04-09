'use client';

import { ArrowLeftRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddToCompareButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/compare');
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-1.5 sm:gap-2 bg-[#FDDE35] hover:bg-[#FACC15] transition-colors text-[#12100E] px-3 sm:px-4 py-2 rounded-md font-medium text-sm flex-shrink-0"
    >
      <ArrowLeftRight className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
      <span className="text-[12px] sm:text-[14px] font-[600] hidden xs:inline">Add to Compare</span>
      <span className="text-[12px] sm:text-[14px] font-[600] xs:hidden">Compare</span>
    </button>
  );
}
