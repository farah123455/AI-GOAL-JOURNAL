import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi, goalApi, journalApi, summaryApi } from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [journals, setJournals] = useState([]);
  const [summary, setSummary] = useState(null);

  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);
  const [hasLoadedGoals, setHasLoadedGoals] = useState(false);
  const [hasLoadedJournals, setHasLoadedJournals] = useState(false);
  const [hasLoadedSummary, setHasLoadedSummary] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Clear data cache on logout
  const clearCache = useCallback(() => {
    setProfile(null);
    setGoals([]);
    setJournals([]);
    setSummary(null);
    setHasLoadedProfile(false);
    setHasLoadedGoals(false);
    setHasLoadedJournals(false);
    setHasLoadedSummary(false);
    setInitialLoading(true);
  }, []);

  // Fetch Profile
  const fetchProfile = useCallback(async (options = { quiet: false }) => {
    try {
      const data = await userApi.getProfile();
      setProfile(data);
      setHasLoadedProfile(true);
      return data;
    } catch (err) {
      console.error('DataContext fetchProfile error:', err);
      if (!options.quiet) throw err;
    }
  }, []);

  // Fetch Goals
  const fetchGoals = useCallback(async (statusFilter = '', options = { quiet: false }) => {
    try {
      const data = await goalApi.listGoals(statusFilter);
      setGoals(data || []);
      setHasLoadedGoals(true);
      return data;
    } catch (err) {
      console.error('DataContext fetchGoals error:', err);
      if (!options.quiet) throw err;
    }
  }, []);

  // Fetch Journals
  const fetchJournals = useCallback(async (options = { quiet: false }) => {
    try {
      const data = await journalApi.listJournals();
      setJournals(data || []);
      setHasLoadedJournals(true);
      return data;
    } catch (err) {
      console.error('DataContext fetchJournals error:', err);
      if (!options.quiet) throw err;
    }
  }, []);

  // Fetch Weekly Summary
  const fetchSummary = useCallback(async (options = { quiet: false }) => {
    try {
      const data = await summaryApi.getWeeklySummary();
      setSummary(data);
      setHasLoadedSummary(true);
      return data;
    } catch (err) {
      console.error('DataContext fetchSummary error:', err);
      if (!options.quiet) throw err;
    }
  }, []);

  // Fetch All Data
  const fetchAllData = useCallback(async (options = { quiet: false }) => {
    try {
      const [profileRes, goalsRes, journalsRes, summaryRes] = await Promise.allSettled([
        userApi.getProfile(),
        goalApi.listGoals(),
        journalApi.listJournals(),
        summaryApi.getWeeklySummary(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value);
        setHasLoadedProfile(true);
      }
      if (goalsRes.status === 'fulfilled') {
        setGoals(goalsRes.value || []);
        setHasLoadedGoals(true);
      }
      if (journalsRes.status === 'fulfilled') {
        setJournals(journalsRes.value || []);
        setHasLoadedJournals(true);
      }
      if (summaryRes.status === 'fulfilled') {
        setSummary(summaryRes.value);
        setHasLoadedSummary(true);
      }
    } catch (err) {
      console.error('DataContext fetchAllData error:', err);
      if (!options.quiet) throw err;
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Load initial data when authenticated user arrives
  useEffect(() => {
    if (user) {
      fetchAllData({ quiet: true });
    } else {
      clearCache();
    }
  }, [user, fetchAllData, clearCache]);

  // --- Cache Mutation Helpers ---
  const addGoal = useCallback((newGoal) => {
    setGoals((prev) => [newGoal, ...prev]);
  }, []);

  const updateGoalInCache = useCallback((updatedGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));
  }, []);

  const deleteGoalFromCache = useCallback((goalId) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }, []);

  const addJournal = useCallback((newJournal) => {
    setJournals((prev) => [newJournal, ...prev]);
  }, []);

  const updateJournalInCache = useCallback((updatedJournal) => {
    setJournals((prev) => prev.map((j) => (j.id === updatedJournal.id ? updatedJournal : j)));
  }, []);

  const deleteJournalFromCache = useCallback((journalId) => {
    setJournals((prev) => prev.filter((j) => j.id !== journalId));
  }, []);

  const updateProfileInCache = useCallback((updatedProfile) => {
    setProfile(updatedProfile);
  }, []);

  const setSummaryInCache = useCallback((newSummary) => {
    setSummary(newSummary);
    setHasLoadedSummary(true);
  }, []);

  return (
    <DataContext.Provider
      value={{
        profile,
        goals,
        journals,
        summary,
        hasLoadedProfile,
        hasLoadedGoals,
        hasLoadedJournals,
        hasLoadedSummary,
        initialLoading,
        fetchProfile,
        fetchGoals,
        fetchJournals,
        fetchSummary,
        fetchAllData,
        addGoal,
        updateGoalInCache,
        deleteGoalFromCache,
        addJournal,
        updateJournalInCache,
        deleteJournalFromCache,
        updateProfileInCache,
        setSummaryInCache,
        clearCache,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within DataProvider');
  }
  return ctx;
}
