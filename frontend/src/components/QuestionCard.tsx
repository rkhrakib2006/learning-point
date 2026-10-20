import MCQOption from './MCQOption';

export default function QuestionCard({ index, question, value, onChange }: { index: number; question: any; value: any; onChange: (v: any) => void; }) {
  return (
    <div className="card mb-4">
      <div className="text-xs text-slate-400 mb-1">Q{index + 1} · {question.marks} marks</div>
      <div className="text-slate-100 mb-3">{question.text}</div>
      {question.type === 'MCQ' ? (
        <div className="space-y-2">
          {question.options?.map((o: any) => (
            <MCQOption key={o.id} id={o.id} text={o.text} selected={value === o.id} onSelect={() => onChange(o.id)} />
          ))}
        </div>
      ) : (
        <textarea rows={5} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="Write your answer here..." className="input" />
      )}
    </div>
  );
}
