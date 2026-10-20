export default function MCQOption({ id, text, selected, onSelect }: { id: string; text: string; selected: boolean; onSelect: () => void; }) {
  return (
    <div onClick={onSelect} className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${selected ? 'border-blue-500 bg-gradient-to-r from-blue-500/20 to-cyan-500/10 shadow-lg shadow-blue-500/20' : 'border-slate-700 bg-slate-800/60 hover:border-blue-500/50 hover:bg-slate-800'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${selected ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'}`}>{id}</div>
      <span className={`text-base font-medium flex-1 ${selected ? 'text-white' : 'text-slate-200'}`}>{text}</span>
    </div>
  );
}
