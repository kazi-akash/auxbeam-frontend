import { ArrowLeftRight } from 'lucide-react';

export default function AddToCompareButton() {
  return (
    <button className="flex items-center gap-2 bg-[#FDDE35] hover:bg-[#FACC15] transition-colors text-[#12100E] px-4 py-2 rounded-md font-medium text-sm">
      <ArrowLeftRight className="w-[16px] h-[16px]" />
      <span className="text-[14px] font-[600]">Add to Compare</span>
    </button>
  );
}
