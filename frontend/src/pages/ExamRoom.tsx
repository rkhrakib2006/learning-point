import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import { submissionApi } from '../api/submissionApi';
import { useTimer } from '../hooks/useTimer';
import { useAntiCheat } from '../hooks/useAntiCheat';
import { useAutosave } from '../hooks/useAutosave';
import type { Answer, Question } from '../types';

export default function ExamRoom() {
  const { examId } = useParams<{ examId: string }>();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [examInfo, setExamInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | undefined>();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useEffect(() => {
    if (!examId) return;
    submissionApi.start(examId).then((data) => {
      setExamInfo(data.exam); setQuestions(data.questions); setSubmissionId(data.submission.id); setExpiresAt(data.submission.expiresAt);
      const initial: Record<string, Answer> = {};
      data.answers.forEach((a: any) => { initial[a.questionId] = { questionId: a.questionId, mcqChoice: a.mcqChoice, cqText: a.cqText }; });
      setAnswers(initial); setLoading(false);
    }).catch((e) => { alert(e?.response?.data?.error ?? 'Failed to start exam'); nav('/'); });
  }, [examId, nav]);

  useAntiCheat(submissionId);
  useAutosave(submissionId, answers);

  const timeLeft = useTimer(expiresAt, () => {
    if (submissionId) { submissionApi.submit(submissionId).finally(() => { alert('⏰ Time up! Auto-submitted.'); nav('/'); }); }
  });

  const setAnswer = (qid: string, value: any) => { setAnswers((prev) => ({ ...prev, [qid]: { questionId: qid, mcqChoice: value, cqText: value } })); };
  const submitExam = async () => { if (!submissionId) return; if (!confirm('Submit exam?')) return; await submissionApi.submit(submissionId); alert('✅ Submitted!'); nav('/'); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">Starting exam...</div>;

  const answered = Object.values(answers).filter((a) => a.mcqChoice || a.cqText).length;

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center sticky top-0 z-10">
        <div><h2 className="text-xl font-bold text-sky-400">{examInfo?.title}</h2><p className="text-xs text-slate-400">{answered} / {questions.length} answered</p></div>
        <Timer seconds={timeLeft} />
      </div>
      <div className="max-w-4xl mx-auto p-6">
        {questions.map((q, i) => (
          <QuestionCard key={q.id} index={i} question={q} value={answers[q.id]?.mcqChoice ?? answers[q.id]?.cqText ?? ''} onChange={(v: any) => setAnswer(q.id, v)} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4 flex justify-end gap-3">
        <button onClick={() => nav('/')} className="btn btn-secondary">Exit</button>
        <button onClick={submitExam} className="btn btn-primary">✅ Submit Exam</button>
      </div>
    </div>
  );
}
