import { TrackerProvider, useTracker } from "./context/TrackerContext";
import Header from "./components/Header";
import ProgressDashboard from "./components/ProgressDashboard";
import FilterBar from "./components/FilterBar";
import Section from "./components/Section";

function TrackerContent() {
  const { dsaData } = useTracker();

  return (
    <div className="min-h-screen bg-[#0f0f23] font-inter">
      <Header />
      <main className="pt-3 pb-16">
        <ProgressDashboard />
        <FilterBar />
        <div>
          {dsaData.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </main>

      <footer className="border-t border-[#0f0f28] py-5 text-center">
        <p className="text-[#333355] text-xs">
          Built with ❤️ by{" "}
          <span className="text-[#a5b4fc] font-semibold">Abinash</span>
          {" · "}
          Inspired by{" "}
          <a href="https://takeuforward.org/" target="_blank" rel="noopener noreferrer"
            className="text-[#60a5fa] hover:text-[#93c5fd] hover:underline transition-colors font-medium">
            TakeUForward
          </a>
          {" · "}
          <span className="text-[#1e1e3a]">A2Z DSA Sheet Tracker 🚀</span>
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
