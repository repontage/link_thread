"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  TrendingDown,
  Users,
  RefreshCw,
  Shield,
  Calendar,
  Activity,
  UserMinus,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface RetentionData {
  daily: { date: string; activeUsers: number; newUsers: number; returningUsers: number }[];
  weekly: { week: string; activeUsers: number; retained: number; retentionRate: number }[];
  monthly: { month: string; totalUsers: number; activeUsers: number }[];
}

interface ChurnData {
  churnedUsers: number;
  atRiskUsers: number;
  churnRate: number;
  avgLifespanDays: number;
}

interface CohortData {
  cohorts: { cohort: string; size: number; retention: number[] }[];
  periods: string[];
}

type Tab = "retention" | "churn" | "cohort";

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("retention");
  const [retention, setRetention] = useState<RetentionData | null>(null);
  const [churn, setChurn] = useState<ChurnData | null>(null);
  const [cohort, setCohort] = useState<CohortData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (isRefresh?: boolean) => {
    if (!isRefresh) setLoading(true);
    try {
      const [retRes, churnRes, cohortRes] = await Promise.all([
        fetch("/api/admin/analytics/retention"),
        fetch("/api/admin/analytics/churn"),
        fetch("/api/admin/analytics/cohort"),
      ]);
      if (retRes.ok) {
        const d = await retRes.json();
        setRetention(d.data);
      }
      if (churnRes.ok) {
        const d = await churnRes.json();
        setChurn(d.data);
      }
      if (cohortRes.ok) {
        const d = await cohortRes.json();
        setCohort(d.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
      fetchData();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session, fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  if (status === "loading" || (loading && status === "authenticated")) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if ((session?.user as any)?.role !== "ADMIN") {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 text-center text-red-500">
        <Shield className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>Admin privileges required.</p>
      </div>
    );
  }

  const maxRetention = retention?.weekly?.length
    ? Math.max(...retention.weekly.map((w) => w.retentionRate))
    : 100;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-zinc-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        {(["retention", "churn", "cohort"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white shadow-sm text-indigo-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "retention" && "Retention"}
            {tab === "churn" && "Churn"}
            {tab === "cohort" && "Cohorts"}
          </button>
        ))}
      </div>

      {/* Retention Tab */}
      {activeTab === "retention" && (
        <div className="space-y-8">
          {/* Weekly Retention Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Weekly Retention Rate
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Percentage of users who returned the following week.
            </p>
            {retention?.weekly?.length ? (
              <div className="space-y-3">
                {retention.weekly.map((w, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 w-40 shrink-0 truncate" title={w.week}>
                      {w.week}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${(w.retentionRate / maxRetention) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {w.retentionRate}%
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 w-16 text-right">
                      {w.activeUsers} users
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No weekly data yet.</p>
            )}
          </div>

          {/* Daily Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Daily Activity (Last 30 Days)
            </h2>
            {retention?.daily?.length ? (
              <div className="overflow-x-auto">
                <div className="flex gap-[3px] items-end h-48 min-w-[600px]">
                  {retention.daily.map((d, i) => {
                    const maxVal = Math.max(
                      ...retention.daily.map((x) => x.activeUsers),
                      1
                    );
                    const height = (d.activeUsers / maxVal) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 min-w-[12px] group relative"
                        title={`${d.date}: ${d.activeUsers} active (${d.newUsers} new)`}
                      >
                        <div
                          className="w-full bg-gradient-to-t from-indigo-400 to-indigo-300 rounded-t-sm hover:from-indigo-500 transition-all cursor-pointer"
                          style={{ height: `${Math.max(height, 2)}%` }}
                        />
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none transition-opacity">
                          {d.date}: {d.activeUsers} active
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  <span>{retention.daily[0]?.date || ""}</span>
                  <span>{retention.daily[retention.daily.length - 1]?.date || ""}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No daily data yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Churn Tab */}
      {activeTab === "churn" && (
        <div className="space-y-6">
          {churn ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserMinus className="w-6 h-6 text-red-500" />
                    <p className="text-sm text-gray-500 font-medium">Churned Users</p>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{churn.churnedUsers}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    <p className="text-sm text-gray-500 font-medium">At Risk</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">{churn.atRiskUsers}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-6 h-6 text-orange-500" />
                    <p className="text-sm text-gray-500 font-medium">Churn Rate</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{churn.churnRate}%</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCheck className="w-6 h-6 text-blue-500" />
                    <p className="text-sm text-gray-500 font-medium">Avg Lifespan</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{churn.avgLifespanDays} days</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-2">Insights</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    {churn.churnedUsers > 0
                      ? `${churn.churnedUsers} users haven't been active in 30+ days.`
                      : "No users have churned yet. Great retention!"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {churn.atRiskUsers > 0
                      ? `${churn.atRiskUsers} users are at risk (7-30 days inactivity).`
                      : "No users at risk of churning."}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    Average user lifespan: <strong>{churn.avgLifespanDays} days</strong>.
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No churn data available.</p>
          )}
        </div>
      )}

      {/* Cohort Tab */}
      {activeTab === "cohort" && (
        <div className="space-y-6">
          {cohort?.cohorts?.length ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-x-auto">
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Weekly Cohort Retention
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Percentage of users in each signup-week cohort who returned in subsequent weeks.
              </p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-4 text-left font-semibold text-gray-500">Cohort</th>
                    <th className="py-2 px-3 text-left font-semibold text-gray-500">Users</th>
                    {cohort.periods.map((p, i) => (
                      <th
                        key={i}
                        className="py-2 px-3 text-center font-semibold text-gray-500 min-w-[60px]"
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cohort.cohorts.map((c, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap">
                        {c.cohort}
                      </td>
                      <td className="py-2 px-3 text-gray-500">{c.size}</td>
                      {c.retention.map((rate, j) => (
                        <td key={j} className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              rate >= 80
                                ? "bg-green-100 text-green-800"
                                : rate >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : rate >= 20
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {rate}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400 italic">
                No cohort data yet. Cohorts become available as users sign up and return.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
