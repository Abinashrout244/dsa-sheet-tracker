import { createContext, useContext, useState, useEffect, useCallback } from "react";
import dsaData from "../data/dsaData";

const TrackerContext = createContext(null);

const STORAGE_KEY = "dsa_tracker_progress";
const NOTES_KEY = "dsa_tracker_notes";
const REVISION_KEY = "dsa_tracker_revision";

export function TrackerProvider({ children }) {
  const [solvedSet, setSolvedSet] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [notesSet, setNotesSet] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [revisionSet, setRevisionSet] = useState(() => {
    try {
      const stored = localStorage.getItem(REVISION_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...solvedSet]));
  }, [solvedSet]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify([...notesSet]));
  }, [notesSet]);

  useEffect(() => {
    localStorage.setItem(REVISION_KEY, JSON.stringify([...revisionSet]));
  }, [revisionSet]);

  const toggleSolved = useCallback((id) => {
    setSolvedSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleNotes = useCallback((id) => {
    setNotesSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleRevision = useCallback((id) => {
    setRevisionSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setSolvedSet(new Set());
    setNotesSet(new Set());
    setRevisionSet(new Set());
  }, []);

  const importProgress = useCallback((data) => {
    try {
      if (data.solved) setSolvedSet(new Set(data.solved));
      if (data.notes) setNotesSet(new Set(data.notes));
      if (data.revision) setRevisionSet(new Set(data.revision));
    } catch {
      console.error("Failed to import progress");
    }
  }, []);

  const exportProgress = useCallback(() => {
    return {
      solved: [...solvedSet],
      notes: [...notesSet],
      revision: [...revisionSet],
    };
  }, [solvedSet, notesSet, revisionSet]);

  const allQuestions = dsaData.flatMap((s) => s.questions);
  const totalCount = allQuestions.length;
  const solvedCount = allQuestions.filter((q) => solvedSet.has(q.id)).length;
  const easyCount = allQuestions.filter((q) => q.difficulty === "Easy").length;
  const mediumCount = allQuestions.filter((q) => q.difficulty === "Medium").length;
  const hardCount = allQuestions.filter((q) => q.difficulty === "Hard").length;
  const easySolved = allQuestions.filter((q) => q.difficulty === "Easy" && solvedSet.has(q.id)).length;
  const mediumSolved = allQuestions.filter((q) => q.difficulty === "Medium" && solvedSet.has(q.id)).length;
  const hardSolved = allQuestions.filter((q) => q.difficulty === "Hard" && solvedSet.has(q.id)).length;

  const value = {
    dsaData,
    solvedSet,
    notesSet,
    revisionSet,
    toggleSolved,
    toggleNotes,
    toggleRevision,
    resetProgress,
    importProgress,
    exportProgress,
    filterDifficulty,
    setFilterDifficulty,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    stats: { totalCount, solvedCount, easyCount, mediumCount, hardCount, easySolved, mediumSolved, hardSolved },
  };

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider");
  return ctx;
}
