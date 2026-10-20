import { formatTime } from '../utils/formatTime';

export default function Timer({ seconds }: { seconds: number }) {
  const cls = seconds <= 15 ? 'text-red-500 animate-pulse' : seconds <= 60 ? 'text-orange-400' : 'text-yellow-400';
  return (
    <div className="text-right">
      <div className={`text-3xl font-bold tabular-nums ${cls}`}>{formatTime(seconds)}</div>
      <div className="text-xs text-slate-400">Time Remaining</div>
    </div>
  );
}
