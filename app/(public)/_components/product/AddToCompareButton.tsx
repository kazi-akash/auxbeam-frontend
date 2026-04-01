import { ArrowLeftRight } from 'lucide-react';

export default function AddToCompareButton() {
  return (
    <button className="flex items-center gap-2 bg-[#FDE047] hover:bg-[#FACC15] transition-colors text-gray-900 px-4 py-2 rounded-md font-medium text-sm">
      <ArrowLeftRight className="w-4 h-4" />
      <span>Add to Compare</span>
    </button>
  );
}
