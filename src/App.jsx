import { TrackerProvider, useTracker } from "./context/TrackerContext";
import Header from "./components/Header";
import ProgressDashboard from "./components/ProgressDashboard";
import FilterBar from "./components/FilterBar";
import Section from "./components/Section";

function EmptyState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-slate-300 text-lg font-semibold mb-2">No problems found</h3>
      <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
    </div>
  );
}

function TrackerContent() {
  const { dsaData, filterDifficulty, filterStatus, searchQuery } = useTracker();

  const hasAnyVisible = dsaData.some((section) =>
    section.questions.some((q) => {
      if (filterDifficulty !== "All" && q.difficulty !== filterDifficulty) return false;
      if (filterStatus === "Solved") return false; // temporarily; Section handles real filtering
      if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
  );

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <Header />
      <main className="pt-2 pb-16">
        <ProgressDashboard />
        <FilterBar />
        <div className="flex flex-col gap-0">
          {dsaData.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center">
        <p className="text-slate-600 text-sm">
          Built with ❤️ · DSA Sheet Tracker · Inspired by Striver A2Z
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <TrackerContent />
    </TrackerProvider>
  );
}
