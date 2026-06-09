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
      <h3 className="text-xl font-bold text-slate-800 mb-2">Dynamic Knowledge Assessment</h3>
      {quizData.map((item, qIdx) => {
        const isAnswered = selectedOptions[qIdx] !== undefined;
        return (
          <div key={qIdx} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm">
            <p className="font-semibold text-slate-800 text-base mb-4">
              {qIdx + 1}. {item.question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.options.map((opt, oIdx) => {
                const isCurrent = selectedOptions[qIdx] === opt;
                const isCorrect = opt === item.correct_answer;
                
                let btnStyle = "border-slate-200 text-slate-700 hover:bg-slate-50";
                if (isCurrent) {
                  btnStyle = isCorrect 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium" 
                    : "bg-rose-50 border-rose-500 text-rose-700 font-medium";
                } else if (isAnswered && isCorrect) {
                  btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium";
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