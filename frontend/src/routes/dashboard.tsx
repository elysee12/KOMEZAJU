import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, ImagePlus, HeartHandshake, Settings,
  LogOut, Search, Bell, TrendingUp, Eye, EyeOff, MessageSquare,
  Upload, Trash2, CheckCircle, Clock,
  Download, X, Pencil, RefreshCw, AlertCircle,
} from "lucide-react";
import logo from "../assets/logo.png";
import { API_URL, getAuthHeaders, isAuthenticated, clearAuth } from "../lib/api";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    // Check authentication before loading dashboard
    if (!isAuthenticated()) {
      // Redirect to homepage if not authenticated
      throw redirect({
        to: "/",
        search: {
          // Optional: store redirect path to return after login
          redirect: location.href,
        },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — KOMEZAJU Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DashboardPage,
});

type Tab = "overview" | "media" | "donations" | "messages" | "settings";

const NAV = [
  { id: "overview",  icon: LayoutDashboard, label: "Overview"       },
  { id: "media",     icon: ImagePlus,       label: "Media Library"  },
  { id: "donations", icon: HeartHandshake,  label: "Donations"      },
  { id: "messages",  icon: MessageSquare,   label: "Messages"       },
  { id: "settings",  icon: Settings,        label: "Settings"       },
] as const;

interface ImageRecord {
  id: number; url: string; title?: string;
  description?: string; category?: string;
  isActive: boolean; createdAt: string;
}
interface Donation {
  id: number; donorName: string; donorEmail: string;
  amount: string; currency: string; message?: string;
  status: "PENDING" | "COMPLETED" | "FAILED"; createdAt: string;
}
interface ContactMessage {
  id: number; name: string; email: string;
  message: string; isRead: boolean; createdAt: string;
}
interface Stats {
  totalDonations: number; monthlyTotal: number;
  mediaCount: number; recentDonations: Donation[];
  messagesCount?: number; unreadMessages?: number;
}

function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Double-check authentication on mount
    if (!isAuthenticated()) {
      navigate({ to: "/" });
      return;
    }
    
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // Invalid user data, clear and redirect
        clearAuth();
        navigate({ to: "/" });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/" });
  };

  if (!user) return null;

  return (
    <div className="min-h-dvh bg-muted/30 text-foreground">
      <div className="flex">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card p-6 lg:flex">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
              <img src={logo} alt="KOMEZAJU" className="h-7 w-7" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold">KOMEZAJU</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Administrator</p>
            </div>
          </Link>
          <nav className="mt-10 flex flex-1 flex-col gap-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Main Menu</p>
            {NAV.map((n) => {
              const Icon = n.icon;
              const active = activeTab === n.id;
              return (
                <button key={n.id} onClick={() => setActiveTab(n.id as Tab)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
                  <Icon className="h-5 w-5" />{n.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-border/50 pt-6">
            <div className="flex items-center gap-3 px-3 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {(user.name?.[0] ?? user.email[0]).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name ?? "Admin"}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-xl md:px-10">
            <div>
              <h1 className="font-display text-xl font-bold capitalize md:text-2xl">{activeTab}</h1>
              <p className="hidden text-xs text-muted-foreground md:block">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="search" placeholder="Search…" className="w-56 rounded-xl border border-input bg-muted/50 py-2 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
              <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-background hover:bg-muted">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>
          <main className="mx-auto max-w-7xl p-6 md:p-10">
            {activeTab === "overview"  && <OverviewTab  onNavigate={setActiveTab} />}
            {activeTab === "media"     && <MediaTab />}
            {activeTab === "donations" && <DonationsTab />}
            {activeTab === "messages"  && <MessagesTab />}
            {activeTab === "settings"  && <SettingsTab user={user} onUserUpdate={(u) => setUser(u)} />}
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── OverviewTab ──────────────────────────────────────────────────────────────
function OverviewTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [donationsRes, messagesRes] = await Promise.all([
        fetch(`${API_URL}/donations/stats`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/messages/stats`, { headers: getAuthHeaders() }),
      ]);
      if (!donationsRes.ok) throw new Error("Failed to load stats");
      
      const donationsData = await donationsRes.json();
      const messagesData = messagesRes.ok ? await messagesRes.json() : { total: 0, unread: 0 };
      
      setStats({
        ...donationsData,
        messagesCount: messagesData.total,
        unreadMessages: messagesData.unread,
      });
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading dashboard…</div>;
  if (error) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      <button onClick={load} className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Retry</button>
    </div>
  );

  const statCards = [
    { label: "Total Donations",     value: stats!.totalDonations.toString(),          icon: HeartHandshake, color: "text-emerald-600", bg: "bg-emerald-50", action: () => onNavigate("donations") },
    { label: "Revenue This Month",  value: `$${stats!.monthlyTotal.toLocaleString()}`, icon: TrendingUp,     color: "text-blue-600",    bg: "bg-blue-50",    action: () => onNavigate("donations") },
    { label: "Media Files",         value: stats!.mediaCount.toString(),               icon: ImagePlus,      color: "text-purple-600",  bg: "bg-purple-50",  action: () => onNavigate("media")     },
    { label: "Messages",            value: `${stats!.messagesCount ?? 0}`,             icon: MessageSquare,  color: "text-amber-600",   bg: "bg-amber-50",   action: () => onNavigate("messages"), badge: stats!.unreadMessages },
  ];

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.label} onClick={s.action}
              className={`relative rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:shadow-elevated ${s.action ? "cursor-pointer" : ""}`}>
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${s.bg} ${s.color}`}><Icon className="h-5 w-5" /></span>
              {s.badge && s.badge > 0 && (
                <span className="absolute right-4 top-4 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-destructive px-2 text-xs font-bold text-destructive-foreground">
                  {s.badge}
                </span>
              )}
              <div className="mt-5">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <article className="rounded-2xl border border-border bg-card p-7 shadow-soft">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Recent Donations</h2>
              <button onClick={() => onNavigate("donations")} className="text-sm font-bold text-primary hover:underline">View all</button>
            </div>
            {!stats?.recentDonations?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No donations yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="pb-3">Donor</th><th className="pb-3">Amount</th><th className="pb-3">Date</th><th className="pb-3">Status</th>
                </tr></thead>
                <tbody>{stats.recentDonations.map((d) => (
                  <tr key={d.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                    <td className="py-3 font-semibold">{d.donorName}</td>
                    <td className="py-3">{d.currency} {parseFloat(d.amount).toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="py-3"><StatusBadge status={d.status} /></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </article>
        </div>
        <article className="h-fit rounded-2xl border border-border bg-card p-7 shadow-soft">
          <h2 className="mb-5 font-display text-lg font-bold">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => onNavigate("media")}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 text-left hover:border-primary/50 hover:bg-muted">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Upload className="h-4 w-4" /></span>
              <div><p className="text-sm font-bold">Upload Media</p><p className="text-xs text-muted-foreground">Manage homepage images</p></div>
            </button>
            <button onClick={() => onNavigate("donations")}
              className="flex w-full items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 text-left hover:border-primary/50 hover:bg-muted">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500 text-white"><Eye className="h-4 w-4" /></span>
              <div><p className="text-sm font-bold">View Donors</p><p className="text-xs text-muted-foreground">Manage contributions</p></div>
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

// ─── MediaTab ─────────────────────────────────────────────────────────────────
function MediaTab() {
  const [images, setImages]       = useState<ImageRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editImg, setEditImg]     = useState<ImageRecord | null>(null);
  const [deleteImg, setDeleteImg]   = useState<ImageRecord | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/images/all`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      setImages(await res.json());
    } catch { setImages([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadImages(); }, [loadImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate size first (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("File too big! Maximum is 10MB", false);
      return;
    }
    setSelectedFile(file);
    setSelectedCategory("general");
    setUploadModal(true);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", selectedFile);
    form.append("category", selectedCategory);
    form.append("title", selectedFile.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    try {
      const res = await fetch(`${API_URL}/images/upload`, { method: "POST", headers: getAuthHeaders(), body: form });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message ?? "Upload failed"); }
      showToast("Image uploaded successfully");
      setUploadModal(false);
      setSelectedFile(null);
      loadImages();
    } catch (e: any) { showToast(e.message, false); }
    finally { 
      setUploading(false); 
      if (fileRef.current) fileRef.current.value = ""; 
    }
  };

  const handleDelete = async () => {
    if (!deleteImg) return;
    try {
      const res = await fetch(`${API_URL}/images/${deleteImg.id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Image deleted");
      setDeleteImg(null);
      loadImages();
    } catch (e: any) { showToast(e.message, false); }
  };

  const CATEGORIES = [
    "hero", 
    "mission-women", 
    "mission-environment", 
    "mission-youth", 
    "beneficiaries", 
    "impact", 
    "leadership-president", 
    "leadership-deputy",
    // Programs categories
    "program-youth",
    "program-jobs",
    "program-coops",
    "program-rights",
    "program-drug",
    "program-env",
    "program-debates",
    "program-voice",
    "program-mediation",
    "program-partners",
    // Beneficiaries categories
    "beneficiary-youth",
    "beneficiary-women",
    "beneficiary-disability",
    "beneficiary-teen",
    "beneficiary-vulnerable",
    "general"
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-semibold shadow-elevated ${toast.ok ? "bg-foreground text-background" : "bg-destructive text-destructive-foreground"}`}>
          {toast.msg}
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Media Library</h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage images displayed on the homepage. Assign categories to control which section each image appears in.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadImages} title="Refresh" className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-muted">
            <RefreshCw className="h-4 w-4" />
          </button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload Photo"}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Category legend */}
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center gap-2 border-b border-border/60 px-6 py-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <ImagePlus className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold">Category Guide</p>
            <p className="text-xs text-muted-foreground">Assign a category to each image to control where it appears on the homepage</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            // Main sections
            { cat: "hero",                 desc: "Hero background",         section: "Hero",           color: "bg-orange-50 text-orange-700 ring-orange-200"  },
            { cat: "mission-women",        desc: "Women cooperative photo", section: "Mission",        color: "bg-pink-50 text-pink-700 ring-pink-200"         },
            { cat: "mission-environment",  desc: "Environment photo",       section: "Mission",        color: "bg-emerald-50 text-emerald-700 ring-emerald-200"},
            { cat: "mission-youth",        desc: "Youth training photo",    section: "Mission",        color: "bg-blue-50 text-blue-700 ring-blue-200"         },
            { cat: "beneficiaries",        desc: "Beneficiaries portrait",  section: "Beneficiaries",  color: "bg-violet-50 text-violet-700 ring-violet-200"   },
            { cat: "impact",               desc: "Community gathering",     section: "Impact",         color: "bg-amber-50 text-amber-700 ring-amber-200"      },
            { cat: "leadership-president", desc: "President portrait",      section: "Leadership",     color: "bg-sky-50 text-sky-700 ring-sky-200"            },
            { cat: "leadership-deputy",    desc: "Deputy portrait",         section: "Leadership",     color: "bg-indigo-50 text-indigo-700 ring-indigo-200"   },
            // Programs
            { cat: "program-youth",        desc: "Youth Empowerment card",  section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-jobs",         desc: "Job Creation card",       section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-coops",        desc: "Cooperatives card",       section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-rights",       desc: "Human Rights card",       section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-drug",         desc: "Drug Prevention card",    section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-env",          desc: "Environment card",        section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-debates",      desc: "Debates card",            section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-voice",        desc: "Community Voice card",    section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-mediation",    desc: "Mediation card",          section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            { cat: "program-partners",     desc: "Partnerships card",       section: "Programs",       color: "bg-cyan-50 text-cyan-700 ring-cyan-200"         },
            // Beneficiaries
            { cat: "beneficiary-youth",        desc: "Youth beneficiary card",      section: "Beneficiaries",  color: "bg-purple-50 text-purple-700 ring-purple-200" },
            { cat: "beneficiary-women",        desc: "Women beneficiary card",      section: "Beneficiaries",  color: "bg-purple-50 text-purple-700 ring-purple-200" },
            { cat: "beneficiary-disability",   desc: "Disability beneficiary card", section: "Beneficiaries",  color: "bg-purple-50 text-purple-700 ring-purple-200" },
            { cat: "beneficiary-teen",         desc: "Teen mothers card",           section: "Beneficiaries",  color: "bg-purple-50 text-purple-700 ring-purple-200" },
            { cat: "beneficiary-vulnerable",   desc: "Vulnerable people card",      section: "Beneficiaries",  color: "bg-purple-50 text-purple-700 ring-purple-200" },
            { cat: "general",              desc: "Not shown on homepage",   section: "Hidden",         color: "bg-muted text-muted-foreground ring-border"     },
          ].map(({ cat, desc, section, color }) => (
            <div key={cat} className={`flex items-start gap-3 rounded-xl border p-4 ring-1 ${color}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <code className="rounded-md bg-white/70 px-2 py-0.5 text-[11px] font-bold tracking-tight ring-1 ring-black/10">
                    {cat}
                  </code>
                  <span className="shrink-0 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-black/10">
                    {section}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading media…</div>
      ) : images.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-20 text-center">
          <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 font-display text-lg font-bold">No images yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Click "Upload Photo" to add your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <article key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <img src={img.url} alt={img.title ?? ""} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
              {!img.isActive && (
                <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">Hidden</div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-sm font-bold text-white">{img.title ?? "Untitled"}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/70">{img.category ?? "general"}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => setEditImg(img)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-white py-1.5 text-xs font-bold text-foreground">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteImg(img)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-destructive text-destructive-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editImg && (
        <EditImageModal image={editImg} categories={CATEGORIES}
          onClose={() => setEditImg(null)}
          onSaved={() => { setEditImg(null); loadImages(); showToast("Image updated"); }} />
      )}
      {deleteImg && (
        <ConfirmModal
          title="Delete image?"
          body={`"${deleteImg.title ?? deleteImg.url}" will be permanently removed from the site.`}
          onCancel={() => setDeleteImg(null)}
          onConfirm={handleDelete} />
      )}
      {uploadModal && selectedFile && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(e) => { if (e.target === e.currentTarget) { setUploadModal(false); setSelectedFile(null); } }}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-elevated animate-fade-up">
            <div className="p-7">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Upload New Photo</h3>
                <button onClick={() => { setUploadModal(false); setSelectedFile(null); }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Preview */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border">
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" 
                  className="h-48 w-full object-cover" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Choose Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p className="mb-1 font-bold uppercase tracking-wider">Category Preview</p>
                  {[
                    ["hero", "Hero background"],
                    ["mission-women", "Mission — Women photo"],
                    ["mission-environment", "Mission — Environment photo"],
                    ["mission-youth", "Mission — Youth photo"],
                    ["beneficiaries", "Beneficiaries section"],
                    ["impact", "Impact section"],
                    ["leadership-president", "Leadership — President"],
                    ["leadership-deputy", "Leadership — Deputy"],
                    ["general", "Not shown on homepage"],
                  ].map(([cat, desc]) => 
                    cat === selectedCategory ? (
                      <p key={cat} className="font-medium text-foreground">{desc}</p>
                    ) : null
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button onClick={() => { setUploadModal(false); setSelectedFile(null); }}
                  disabled={uploading}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={confirmUpload} disabled={uploading}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 disabled:opacity-50">
                  {uploading ? "Uploading…" : "Upload Photo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EditImageModal ───────────────────────────────────────────────────────────
function EditImageModal({ image, categories, onClose, onSaved }: {
  image: ImageRecord; categories: string[];
  onClose: () => void; onSaved: () => void;
}) {
  const [title, setTitle]         = useState(image.title ?? "");
  const [description, setDesc]    = useState(image.description ?? "");
  const [category, setCategory]   = useState(image.category ?? "general");
  const [isActive, setActive]     = useState(image.isActive);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [newFile, setNewFile]     = useState<File | null>(null);
  const [preview, setPreview]     = useState<string>(image.url);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    setPreview(URL.createObjectURL(file));
    // Auto-fill title from filename if the title is still the default timestamp
    if (!title || /^\d{10,}$/.test(title)) {
      setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      let updatedUrl = image.url;

      // Step 1: if a new file was selected, upload it first
      if (newFile) {
        const form = new FormData();
        form.append("file", newFile);
        form.append("category", category);
        form.append("title", title);
        const uploadRes = await fetch(`${API_URL}/images/upload`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: form,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.message ?? "File upload failed");
        }
        const uploaded = await uploadRes.json();
        updatedUrl = uploaded.url;

        // Delete the old image record since we have a new one with the right metadata
        await fetch(`${API_URL}/images/${image.id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });
      } else {
        // Step 2: metadata-only update via PATCH
        const res = await fetch(`${API_URL}/images/${image.id}`, {
          method: "PATCH",
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, category, isActive }),
        });
        if (!res.ok) throw new Error("Update failed");
      }

      onSaved();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md overflow-y-auto max-h-[90dvh] rounded-2xl bg-card p-7 shadow-elevated">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Edit Image</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background"><X className="h-4 w-4" /></button>
        </div>

        {/* Image preview + replace button */}
        <div className="relative mb-5">
          <img
            src={preview}
            alt=""
            className="aspect-video w-full rounded-xl object-cover object-top"
          />
          <label className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/90">
            <Upload className="h-3.5 w-3.5" />
            {newFile ? "Change photo" : "Replace photo"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {newFile && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
            <ImagePlus className="h-4 w-4 shrink-0" />
            <span className="truncate">New file selected: <strong>{newFile.name}</strong></span>
            <button
              type="button"
              onClick={() => { setNewFile(null); setPreview(image.url); if (fileRef.current) fileRef.current.value = ""; }}
              className="ml-auto shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {error && <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

        <div className="space-y-4">
          <Field label="Title" value={title} onChange={setTitle} />
          <Field label="Description" value={description} onChange={setDesc} textarea />
          <div>
            <label className="text-sm font-medium">Category (controls where this appears on homepage)</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <div className={`relative h-6 w-11 rounded-full transition ${isActive ? "bg-primary" : "bg-muted"}`}
              onClick={() => setActive((v) => !v)}>
              <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <span className="text-sm font-medium">{isActive ? "Visible on site" : "Hidden from site"}</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">Cancel</button>
          <button onClick={save} disabled={saving}
            className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-bold text-background hover:bg-foreground/90 disabled:opacity-50">
            {saving ? (newFile ? "Uploading…" : "Saving…") : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MessagesTab ──────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages]   = useState<ContactMessage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [detail, setDetail]       = useState<ContactMessage | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<ContactMessage | null>(null);
  const [toast, setToast]         = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/messages/all`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      setMessages(await res.json());
    } catch { setMessages([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/messages/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      load();
    } catch (e: any) { showToast("Failed to update"); }
  };

  const handleDelete = async () => {
    if (!deleteMsg) return;
    try {
      const res = await fetch(`${API_URL}/messages/${deleteMsg.id}`, { 
        method: "DELETE", 
        headers: getAuthHeaders() 
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Message deleted");
      setDeleteMsg(null);
      load();
    } catch (e: any) { showToast(e.message); }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-elevated">
          {toast}
        </div>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Contact Messages</h2>
          <p className="text-sm text-muted-foreground">
            {messages.length} total messages · {unreadCount} unread
          </p>
        </div>
        <button onClick={load} title="Refresh" 
          className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-muted">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Message Preview</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center text-muted-foreground">Loading messages…</td></tr>
              ) : messages.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-muted-foreground">No messages yet.</td></tr>
              ) : messages.map((m) => (
                <tr key={m.id} className={`hover:bg-muted/20 ${!m.isRead ? "bg-primary/5" : ""}`}>
                  <td className="px-5 py-4">
                    {!m.isRead && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        NEW
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold">{m.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{m.email}</td>
                  <td className="px-5 py-4 max-w-xs truncate text-muted-foreground">{m.message}</td>
                  <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => { setDetail(m); if (!m.isRead) markAsRead(m.id); }}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" 
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => setDeleteMsg(m)}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" 
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {detail && <MessageDetailModal message={detail} onClose={() => setDetail(null)} />}
      {deleteMsg && (
        <ConfirmModal
          title="Delete message?"
          body={`Message from "${deleteMsg.name}" will be permanently removed.`}
          onCancel={() => setDeleteMsg(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ─── MessageDetailModal ───────────────────────────────────────────────────────
function MessageDetailModal({ message: m, onClose }: { message: ContactMessage; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-2xl rounded-2xl bg-card p-7 shadow-elevated">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Message Details</h3>
          <button onClick={onClose} 
            className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Header info */}
          <div className="rounded-xl border border-border bg-muted/30 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">From</p>
                <p className="mt-1 font-semibold">{m.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</p>
                <p className="mt-1 text-muted-foreground">{m.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</p>
                <p className="mt-1 text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="mt-1">
                  {m.isRead ? (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5" /> Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Unread
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Message content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</p>
            <div className="mt-2 rounded-xl border border-border bg-background p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 border-t border-border pt-4">
            <a 
              href={`mailto:${m.email}?subject=Re: Your message to KOMEZAJU`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2.5 text-sm font-bold hover:bg-muted"
            >
              <MessageSquare className="h-4 w-4" />
              Reply via Email
            </a>
            <button 
              onClick={onClose}
              className="flex-1 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background hover:bg-foreground/90"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DonationsTab ─────────────────────────────────────────────────────────────
function DonationsTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading]     = useState(true);
  const [detail, setDetail]       = useState<Donation | null>(null);
  const [statusModal, setStatusModal] = useState<{ id: number; current: string } | null>(null);
  const [toast, setToast]         = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/donations`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error();
      setDonations(await res.json());
    } catch { setDonations([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/donations/${id}/status`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      showToast("Status updated");
      setStatusModal(null);
      load();
    } catch (e: any) { showToast(e.message); }
  };

  const exportCSV = () => {
    const header = ["ID", "Name", "Email", "Amount", "Currency", "Message", "Status", "Date"];
    const rows = donations.map((d) => [
      d.id, `"${d.donorName}"`, d.donorEmail,
      parseFloat(d.amount).toFixed(2), d.currency,
      `"${(d.message ?? "").replace(/"/g, '""')}"`,
      d.status, new Date(d.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `donations-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const totalRevenue = donations
    .filter((d) => d.status === "COMPLETED")
    .reduce((sum, d) => sum + parseFloat(d.amount), 0);

  return (
    <div className="space-y-6">
      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-elevated">{toast}</div>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Donation Tracking</h2>
          <p className="text-sm text-muted-foreground">
            {donations.length} total · ${totalRevenue.toLocaleString()} confirmed revenue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} title="Refresh" className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card hover:bg-muted"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold hover:bg-muted">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>
      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Donor</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="py-20 text-center text-muted-foreground">Loading…</td></tr>
              ) : donations.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-muted-foreground">No donations recorded yet.</td></tr>
              ) : donations.map((d) => (
                <tr key={d.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4 text-muted-foreground">#{d.id}</td>
                  <td className="px-5 py-4 font-semibold">{d.donorName}</td>
                  <td className="px-5 py-4 text-muted-foreground">{d.donorEmail}</td>
                  <td className="px-5 py-4 font-bold">{d.currency} {parseFloat(d.amount).toLocaleString()}</td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setDetail(d)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" title="View details"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => setStatusModal({ id: d.id, current: d.status })} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted" title="Update status"><Pencil className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      {detail && <DonorDetailModal donation={detail} onClose={() => setDetail(null)} />}
      {statusModal && (
        <StatusUpdateModal current={statusModal.current}
          onClose={() => setStatusModal(null)}
          onConfirm={(s) => updateStatus(statusModal.id, s)} />
      )}
    </div>
  );
}

// ─── DonorDetailModal ────────────────────────────────────────────────────────
function DonorDetailModal({ donation: d, onClose }: { donation: Donation; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-2xl bg-card p-7 shadow-elevated">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold">Donor Details</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-foreground hover:text-background"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <Row label="Donation #" value={`#${d.id}`} />
          <Row label="Name" value={d.donorName} />
          <Row label="Email" value={d.donorEmail} />
          <Row label="Amount" value={`${d.currency} ${parseFloat(d.amount).toLocaleString()}`} bold />
          <Row label="Status" value={<StatusBadge status={d.status} />} />
          <Row label="Date" value={new Date(d.createdAt).toLocaleString()} />
          {d.message && <Row label="Message" value={d.message} />}
        </div>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-foreground py-2.5 text-sm font-bold text-background hover:bg-foreground/90">Close</button>
      </div>
    </div>
  );
}

function StatusUpdateModal({ current, onClose, onConfirm }: { current: string; onClose: () => void; onConfirm: (s: string) => void }) {
  const [status, setStatus] = useState(current);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-2xl bg-card p-7 shadow-elevated">
        <h3 className="mb-4 font-display text-xl font-bold">Update Donation Status</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">Cancel</button>
          <button onClick={() => onConfirm(status)} className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-bold text-background hover:bg-foreground/90">Update</button>
        </div>
      </div>
    </div>
  );
}

// ─── SettingsTab ──────────────────────────────────────────────────────────────
function SettingsTab({ user, onUserUpdate }: { user: any; onUserUpdate: (u: any) => void }) {
  const [name, setName]           = useState(user.name ?? "");
  const [email, setEmail]         = useState(user.email ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPws, setShowPws]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [pwError, setPwError]     = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    // Validate password fields if admin is trying to change it
    if (newPw || confirmPw || currentPw) {
      if (!currentPw) { setPwError("Enter your current password to set a new one."); return; }
      if (newPw.length < 6) { setPwError("New password must be at least 6 characters."); return; }
      if (newPw !== confirmPw) { setPwError("New password and confirmation do not match."); return; }
    }

    setSaving(true);
    try {
      const body: any = { name: name.trim(), email: email.trim() };
      if (newPw) body.password = newPw;

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Update failed");
      }

      const updated = await res.json();
      // Persist to localStorage so sidebar + header reflect the new name
      const stored = JSON.parse(localStorage.getItem("user") ?? "{}");
      const merged = { ...stored, ...updated };
      localStorage.setItem("user", JSON.stringify(merged));
      onUserUpdate(merged);

      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      showToast("Profile updated successfully");
    } catch (e: any) {
      showToast(e.message, false);
    } finally {
      setSaving(false);
    }
  };

  const initials = (user.name ?? user.email ?? "A")
    .split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl space-y-8">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-semibold shadow-elevated transition ${toast.ok ? "bg-foreground text-background" : "bg-destructive text-destructive-foreground"}`}>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div>
        <h2 className="font-display text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your administrator profile and account security</p>
      </div>

      {/* Profile avatar card */}
      <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-2xl font-bold text-primary ring-4 ring-primary/20">
          {initials}
        </div>
        <div>
          <p className="font-display text-lg font-bold">{user.name ?? "Admin"}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="mt-1.5 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            {user.role ?? "ADMIN"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile info */}
        <section className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border/60 px-7 py-5">
            <h3 className="font-display text-base font-bold">Profile Information</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Update your display name and email address</p>
          </div>
          <div className="space-y-5 p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="s-name" className="text-sm font-medium">Full name</label>
                <input id="s-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
              <div>
                <label htmlFor="s-email" className="text-sm font-medium">Email address</label>
                <input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <div className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
                {user.role ?? "ADMIN"} — <span className="text-xs">Role cannot be changed here</span>
              </div>
            </div>
          </div>
        </section>

        {/* Password change */}
        <section className="rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border/60 px-7 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold">Change Password</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Leave blank to keep your current password</p>
              </div>
              <button type="button" onClick={() => setShowPws((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline">
                {showPws ? "Hide" : "Show"} fields
              </button>
            </div>
          </div>
          <div className="space-y-5 p-7">
            {pwError && (
              <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {pwError}
              </div>
            )}
            <div>
              <label htmlFor="s-cur-pw" className="text-sm font-medium">Current password</label>
              <PasswordInput id="s-cur-pw" value={currentPw} onChange={setCurrentPw}
                placeholder="Enter current password" show={showPws} />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="s-new-pw" className="text-sm font-medium">New password</label>
                <PasswordInput id="s-new-pw" value={newPw} onChange={setNewPw}
                  placeholder="Min. 6 characters" show={showPws} />
              </div>
              <div>
                <label htmlFor="s-confirm-pw" className="text-sm font-medium">Confirm new password</label>
                <PasswordInput id="s-confirm-pw" value={confirmPw} onChange={setConfirmPw}
                  placeholder="Repeat new password" show={showPws} />
              </div>
            </div>
            {/* Password match indicator */}
            {newPw && confirmPw && (
              <p className={`flex items-center gap-1.5 text-xs font-semibold ${newPw === confirmPw ? "text-emerald-600" : "text-destructive"}`}>
                {newPw === confirmPw
                  ? <><CheckCircle className="h-3.5 w-3.5" /> Passwords match</>
                  : <><AlertCircle className="h-3.5 w-3.5" /> Passwords do not match</>}
              </p>
            )}
          </div>
        </section>

        {/* Save bar */}
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-border bg-card px-7 py-5 shadow-soft">
          <button type="button" onClick={() => {
              setName(user.name ?? ""); setEmail(user.email ?? "");
              setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwError(null);
            }}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold hover:bg-muted">
            Reset
          </button>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-bold text-background hover:bg-foreground/90 disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      {/* API info */}
      <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="mb-2 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">API Connection</h3>
        <p className="text-sm">Backend: <code className="rounded-lg bg-muted px-2 py-0.5 text-xs">{API}</code></p>
      </article>
    </div>
  );
}

// ─── PasswordInput helper ─────────────────────────────────────────────────────
function PasswordInput({ id, value, onChange, placeholder, show }: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder: string; show: boolean;
}) {
  const [local, setLocal] = useState(false);
  const visible = show || local;
  return (
    <div className="relative mt-1.5">
      <input id={id} type={visible ? "text" : "password"} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
      <button type="button" onClick={() => setLocal((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700",
    PENDING:   "bg-amber-50 text-amber-700",
    FAILED:    "bg-red-50 text-red-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status === "COMPLETED" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      {status}
    </span>
  );
}

function Row({ label, value, bold }: { label: string; value: any; bold?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-2 last:border-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className={`text-right ${bold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {textarea
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />}
    </div>
  );
}

function ConfirmModal({ title, body, onCancel, onConfirm }: { title: string; body: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="w-full max-w-sm rounded-2xl bg-card p-7 shadow-elevated">
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-bold hover:bg-muted">Cancel</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-bold text-destructive-foreground hover:opacity-90">Delete</button>
        </div>
      </div>
    </div>
  );
}

