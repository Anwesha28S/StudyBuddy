export default function StudyPlanner({ plannerData }) {
  if (!plannerData) {
    return <p className="text-zinc-500 text-sm">No curriculum blueprint loaded yet.</p>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a2e] border border-purple-500/20 p-4 rounded-xl shadow-md">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">⏱️ Recommended Study Time</span>
          <p className="text-2xl font-extrabold text-zinc-100 mt-1">{plannerData.estimated_study_time}</p>
        </div>
        <div className="bg-[#141423] border border-zinc-800 p-4 rounded-xl shadow-md md:col-span-2">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Core Milestones Packed</span>
          <p className="text-sm font-medium text-zinc-400 mt-1">Includes diagnostic questions and vector chat connectivity.</p>
        </div>
      </div>

      {/* Main Lecture Summary Block */}
      <div className="border border-purple-500/10 rounded-xl p-5 bg-[#141423] shadow-sm">
        <h4 className="text-lg font-bold text-purple-300 mb-2">Lecture Synthesis</h4>
        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
          {plannerData.summary}
        </p>
      </div>

      {/* Grid: Takeaways vs Next Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Takeaways Card */}
        <div className="border border-zinc-800 bg-[#141423] p-5 rounded-xl shadow-sm">
          <h4 className="font-bold text-purple-300 text-base mb-3 flex items-center gap-2">
            Key Takeaways & Rules
          </h4>
          <ul className="space-y-2">
            {plannerData.core_takeaways?.map((item, idx) => (
              <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2 leading-relaxed">
                <span className="text-purple-500 mt-1 text-xs">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Future Topics Card */}
        <div className="border border-purple-500/10 bg-[#1a1a2e]/50 p-5 rounded-xl">
          <h4 className="font-bold text-indigo-300 text-base mb-3 flex items-center gap-2">
             Suggested Next Milestones
          </h4>
          <ul className="space-y-2">
            {plannerData.suggested_next_topics?.map((topic, idx) => (
              <li 
              key={idx} 
              className="bg-[#0b0b12] border border-zinc-800 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-300 shadow-xs flex items-center justify-between transition hover:border-purple-500"
              >
              <span>{topic}</span>
              
              {/* YouTube Redirection */}
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}`}
                target="_blank"             
                rel="noopener noreferrer"   
                className="text-xs text-purple-400 font-semibold tracking-wider hover:underline flex items-center gap-1 transition-colors hover:text-purple-300"
              >
                Explore →
              </a>
            </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}