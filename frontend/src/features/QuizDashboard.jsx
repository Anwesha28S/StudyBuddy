import { useState } from 'react';

export default function QuizDashboard({ quizData }) {
  const [selectedOptions, setSelectedOptions] = useState({});

  if (!quizData || quizData.length === 0) {
    return <p className="text-slate-500 text-sm">No evaluation points loaded for this video.</p>;
  }

  const handleSelect = (qIdx, option) => {
    setSelectedOptions(prev => ({ ...prev, [qIdx]: option }));
  };

  return (
    <div className="space-y-6">
  <h3 className="text-xl font-bold text-white mb-2">
    Dynamic Knowledge Assessment
  </h3>

  {quizData.map((item, qIdx) => {
    const isAnswered = selectedOptions[qIdx] !== undefined;

    return (
      <div
        key={qIdx}
        className="p-5 border border-purple-500/20 rounded-2xl bg-[#11111a] shadow-[0_0_25px_rgba(168,85,247,0.08)]"
      >
        <p className="font-semibold text-zinc-100 text-base mb-4">
          {qIdx + 1}. {item.question}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.options.map((opt, oIdx) => {
            const isCurrent = selectedOptions[qIdx] === opt;
            const isCorrect = opt === item.correct_answer;

            let btnStyle =
              "bg-[#09090f] border-zinc-800 text-zinc-300 hover:border-purple-500/50 hover:bg-purple-950/20";

            if (isCurrent) {
              btnStyle = isCorrect
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-medium"
                : "bg-rose-500/10 border-rose-500 text-rose-300 font-medium";
            } else if (isAnswered && isCorrect) {
              btnStyle =
                "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-medium";
            }

            return (
              <button
                key={oIdx}
                onClick={() => !isAnswered && handleSelect(qIdx, opt)}
                className={`text-left p-3.5 rounded-xl border text-sm transition duration-150 ${btnStyle}`}
                disabled={isAnswered}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  })}
</div>
  );
}