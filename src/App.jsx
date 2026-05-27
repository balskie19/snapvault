import { useState, useEffect } from "react";

// ─── WORKER URL ───────────────────────────────────────────────────────────────
const WORKER_URL = "https://snapvault-worker.snapvault-app.workers.dev";

// ─── R2 API HELPERS ───────────────────────────────────────────────────────────
async function listFiles() {
  const res = await fetch(`${WORKER_URL}/files`);
  const data = await res.json();
  return data.files || [];
}

async function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${WORKER_URL}/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
      else reject(new Error("Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}

async function deleteFile(key) {
  const res = await fetch(`${WORKER_URL}/file/${encodeURIComponent(key)}`, { method: "DELETE" });
  return res.json();
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return "Today";
  if (diff < 172800000) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getFileType(name) {
  const ext = (name || "").split(".").pop().toLowerCase();
  if (["jpg","jpeg","png","gif","webp","heic","heif"].includes(ext)) return "photo";
  if (["mp4","mov","avi","mkv","m4v"].includes(ext)) return "video";
  return "photo";
}

const THUMB_COLORS = ["#FBBF24","#60A5FA","#34D399","#F87171","#A78BFA","#FB923C","#2DD4BF","#E879F9","#38BDF8","#4ADE80","#FACC15","#FB7185"];
function colorForKey(key) { let h = 0; for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % THUMB_COLORS.length; return THUMB_COLORS[h]; }

const TAB_FILTERS = ["All", "Photos", "Videos"];

// ─── THEME ────────────────────────────────────────────────────────────────────
function getTheme(dark) {
  return dark ? {
    bg: "#0A0F1E", bgCard: "#131929", bgMuted: "#1A2236", bgSubtle: "#1A2236",
    border: "#243047", text: "#F0F4FF", textSub: "#8896B3", textMuted: "#4E6080",
    statusBar: "#0A0F1E", bottomBar: "#0A0F1E", bottomBorder: "#1A2236",
    pill: "#1A2236", pillText: "#60A5FA", tabInactive: "#4E6080",
    inputBg: "#131929", inputBorder: "#243047",
  } : {
    bg: "#FFFFFF", bgCard: "#FFFFFF", bgMuted: "#F1F5F9", bgSubtle: "#F8FAFC",
    border: "#E2E8F0", text: "#0F172A", textSub: "#64748B", textMuted: "#94A3B8",
    statusBar: "#FFFFFF", bottomBar: "#FFFFFF", bottomBorder: "#F1F5F9",
    pill: "#EFF6FF", pillText: "#3B82F6", tabInactive: "#94A3B8",
    inputBg: "#F8FAFC", inputBorder: "#E2E8F0",
  };
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  .card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease !important; }
  .card-hover:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 24px #3B82F620 !important; }
  .card-hover:active { transform: scale(0.97) !important; }
  .btn-press:active { transform: scale(0.96) !important; opacity: 0.9; }
  .tab-bounce { transition: transform 0.15s cubic-bezier(.34,1.56,.64,1); }
  .tab-bounce:active { transform: scale(1.25); }
  .fade-in { animation: fadeSlideUp 0.35s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d1 { animation: fadeSlideUp 0.35s 0.05s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d2 { animation: fadeSlideUp 0.35s 0.10s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d3 { animation: fadeSlideUp 0.35s 0.15s cubic-bezier(.4,0,.2,1) both; }
  .fade-in-d4 { animation: fadeSlideUp 0.35s 0.20s cubic-bezier(.4,0,.2,1) both; }
  .slide-in { animation: slideIn 0.3s cubic-bezier(.4,0,.2,1) both; }
  .thumb-in { animation: thumbPop 0.25s cubic-bezier(.34,1.56,.64,1) both; }
  @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
  @keyframes thumbPop { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
  input::placeholder { color: #94A3B8; }
  ::-webkit-scrollbar { width: 0; }
`;

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="url(#lg)" />
      <path d="M14 28c0-3.5 2.5-6 5.5-6.3C20.2 19 22.8 17 26 17c3.8 0 6.8 2.8 7 6.5.1 0 .3 0 .5 0C35.5 23.5 37 25 37 27s-1.5 3.5-3.5 3.5H15.5C13.5 30.5 12 29.5 14 28z" fill="white" opacity="0.95"/>
      <rect x="20" y="26" width="8" height="10" rx="2" fill="url(#lg2)"/>
      <path d="M21.5 31h5M24 28.5v5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6"/><stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
        <linearGradient id="lg2" x1="20" y1="26" x2="28" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1"/><stop offset="1" stopColor="#3B82F6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function StorageMeter({ usedBytes, totalBytes, t }) {
  const [w, setW] = useState(0);
  const pct = totalBytes > 0 ? Math.min(100, Math.round((usedBytes / totalBytes) * 100)) : 0;
  useEffect(() => { const id = setTimeout(() => setW(pct), 300); return () => clearTimeout(id); }, [pct]);
  const color = pct > 85 ? "#EF4444" : pct > 60 ? "#F59E0B" : "#3B82F6";
  return (
    <div style={{ background: t.bgMuted, borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontFamily: "'Nunito Sans'", color: t.textSub, fontWeight: 500 }}>Cloud Storage Used</span>
        <span style={{ fontSize: 13, fontFamily: "'Nunito Sans'", color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ background: t.border, borderRadius: 999, height: 10, overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg,${color}99,${color})`, transition: "width 1s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Nunito Sans'" }}>{formatSize(usedBytes)} used</span>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "'Nunito Sans'" }}>{formatSize(totalBytes)} total (free)</span>
      </div>
    </div>
  );
}

function CloudThumbnail({ item, selected, onToggle, showCheck = true }) {
  const isVideo = item.type === "video";
  return (
    <div onClick={() => onToggle && onToggle(item.key)} className="thumb-in"
      style={{ position: "relative", borderRadius: 10, overflow: "hidden", cursor: "pointer", aspectRatio: "1",
        border: selected ? "2.5px solid #3B82F6" : "2.5px solid transparent",
        transition: "border 0.15s", boxShadow: selected ? "0 0 0 3px #3B82F625" : "none" }}>
      {item.url && !isVideo ? (
        <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${item.color}88,${item.color})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
          {isVideo ? "🎬" : "🖼️"}
        </div>
      )}
      {isVideo && (
        <div style={{ position: "absolute", bottom: 5, left: 5, background: "#00000070", borderRadius: 4, padding: "2px 5px", fontSize: 9, color: "white", fontFamily: "'Nunito Sans'", fontWeight: 600 }}>▶ VID</div>
      )}
      {showCheck && (
        <div style={{ position: "absolute", top: 5, right: 5, width: 20, height: 20, borderRadius: "50%",
          background: selected ? "#3B82F6" : "#ffffff80", border: selected ? "none" : "1.5px solid #ffffff80",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
          {selected && <span style={{ color: "white", fontSize: 11 }}>✓</span>}
        </div>
      )}
    </div>
  );
}

function FilterTabs({ active, onChange, t }) {
  return (
    <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
      {TAB_FILTERS.map(tab => (
        <button key={tab} onClick={() => onChange(tab)} className="btn-press"
          style={{ padding: "6px 14px", borderRadius: 999, border: "none",
            background: active === tab ? "#3B82F6" : t.bgMuted,
            color: active === tab ? "white" : t.textSub,
            fontFamily: "'Nunito Sans'", fontSize: 12, fontWeight: 600, cursor: "pointer",
            whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 }}>{tab}</button>
      ))}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, style = {}, t, cls = "" }) {
  const base = { width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
    fontFamily: "'Nunito Sans'", fontSize: 15, fontWeight: 700, cursor: "pointer",
    transition: "all 0.15s", letterSpacing: 0.1, ...style };
  const v = {
    primary: { background: "linear-gradient(135deg,#3B82F6,#6366F1)", color: "white", boxShadow: "0 4px 16px #3B82F640" },
    secondary: { background: t ? t.bgMuted : "#F1F5F9", color: t ? t.text : "#334155" },
    danger: { background: t?.bg === "#0A0F1E" ? "#3B0A0A" : "#FEF2F2", color: "#EF4444" },
    ghost: { background: "transparent", color: "#3B82F6", padding: "10px 0" },
  };
  return <button style={{ ...base, ...v[variant] }} onClick={onClick} className={`btn-press ${cls}`}>{children}</button>;
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 26, borderRadius: 999, cursor: "pointer",
      background: value ? "#3B82F6" : "#CBD5E1", transition: "background 0.2s", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 21 : 3, width: 20, height: 20, borderRadius: "50%",
        background: "white", boxShadow: "0 1px 4px #0000002A", transition: "left 0.2s" }} />
    </div>
  );
}

function DarkToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(d => !d)} className="btn-press"
      style={{ background: dark ? "#1A2236" : "#F1F5F9", border: "none", borderRadius: 999, cursor: "pointer",
        width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, transition: "background 0.2s", flexShrink: 0 }}>
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="btn-press"
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, padding: 0, color: "#3B82F6" }}>←</button>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const ONBOARD = [
  { icon: "📱", title: "Your iPhone is full.", sub: "Can't take photos? Apps crashing? You're not alone — storage maxed is the #1 iPhone pain.", color: "#EF4444" },
  { icon: "🗂️", title: "Pick exactly what to save.", sub: "Browse your files, select what you want, and back them up to the cloud in seconds.", color: "#3B82F6" },
  { icon: "☁️", title: "Access anything, anywhere.", sub: "Your files live safely in the cloud. View, share, or download back anytime.", color: "#6366F1" },
];

function OnboardingScreen({ nav, t }) {
  const [slide, setSlide] = useState(0);
  const s = ONBOARD[slide];
  return (
    <div style={{ padding: "32px 24px 40px", background: t.bg, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => nav("login")} className="btn-press"
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, fontWeight: 600 }}>Skip</button>
      </div>
      <div key={slide} className="fade-in" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
        <div style={{ width: 110, height: 110, borderRadius: 32, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ fontSize: 26, fontFamily: "'Nunito'", color: t.text, lineHeight: 1.2 }}>{s.title}</div>
        <div style={{ fontSize: 14, fontFamily: "'Nunito Sans'", color: t.textSub, lineHeight: 1.6, maxWidth: 280 }}>{s.sub}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        {ONBOARD.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 999,
            background: i === slide ? "#3B82F6" : t.border, transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>
      {slide < ONBOARD.length - 1
        ? <Btn t={t} onClick={() => setSlide(s => s + 1)}>Next →</Btn>
        : <Btn t={t} onClick={() => nav("login")}>Get Started 🚀</Btn>}
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen({ nav, t }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const inp = { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${t.inputBorder}`,
    background: t.inputBg, color: t.text, fontFamily: "'Nunito Sans'", fontSize: 14, outline: "none", marginBottom: 10 };
  return (
    <div style={{ padding: "28px 24px 40px", background: t.bg, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        <Logo size={52} />
        <div style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text, marginTop: 12 }}>SnapVault</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, marginTop: 4 }}>Your photos, safe forever.</div>
      </div>
      <div style={{ display: "flex", background: t.bgMuted, borderRadius: 12, padding: 4, marginBottom: 22 }}>
        {["login","signup"].map(m => (
          <button key={m} onClick={() => setMode(m)} className="btn-press"
            style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
              background: mode === m ? (t.bg === "#0A0F1E" ? "#243047" : "white") : "transparent",
              color: mode === m ? t.text : t.textMuted,
              fontFamily: "'Nunito Sans'", fontSize: 13, fontWeight: 700,
              boxShadow: mode === m ? "0 1px 6px #00000018" : "none", transition: "all 0.2s" }}>
            {m === "login" ? "Log In" : "Sign Up"}
          </button>
        ))}
      </div>
      <div key={mode} className="fade-in">
        {mode === "signup" && <input style={inp} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />}
        <input style={inp} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={{ ...inp, marginBottom: 18 }} type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <Btn t={t} onClick={() => nav("home")}>{mode === "login" ? "Log In" : "Create Account"}</Btn>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>or</span>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>
      <button onClick={() => nav("home")} className="btn-press card-hover"
        style={{ width: "100%", padding: "13px 0", borderRadius: 14, border: `1.5px solid ${t.border}`,
          background: t.bgCard, color: t.text, fontFamily: "'Nunito Sans'", fontSize: 14, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🍎</span> Continue with Apple
      </button>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ nav, t, cloudFiles }) {
  const usedBytes = cloudFiles.reduce((a, f) => a + (f.size || 0), 0);
  const totalBytes = 10 * 1024 * 1024 * 1024; // 10GB free R2
  return (
    <div style={{ padding: "0 20px 32px", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ paddingTop: 20, paddingBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Logo size={24} />
            <span style={{ fontSize: 11, fontFamily: "'Nunito Sans'", color: t.textMuted, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>SNAPVAULT</span>
          </div>
          <div style={{ fontSize: 24, fontFamily: "'Nunito'", color: t.text, lineHeight: 1.2 }}>
            Welcome back! 👋
          </div>
        </div>
      </div>
      <div className="fade-in-d1"><StorageMeter usedBytes={usedBytes} totalBytes={totalBytes} t={t} /></div>
      <div className="fade-in-d2" style={{ marginTop: 18, marginBottom: 8, fontSize: 11, fontFamily: "'Nunito Sans'", color: t.textMuted, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>What would you like to do?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { sc: "upload", icon: "📤", bg: t.bg === "#0A0F1E" ? "#1A2E4A" : "#EFF6FF", label: "Upload Files to Cloud", sub: "Back up photos & videos now", cls: "fade-in-d2" },
          { sc: "gallery", icon: "☁️", bg: t.bg === "#0A0F1E" ? "#0F2A1E" : "#F0FDF4", label: "My Cloud Gallery", sub: `${cloudFiles.length} files backed up`, cls: "fade-in-d3" },
          { sc: "plans", icon: "⚡", bg: t.bg === "#0A0F1E" ? "#1E1A2E" : "#F5F3FF", label: "Storage Plans", sub: "Free, Plus & Pro options", cls: "fade-in-d3" },
          { sc: "settings", icon: "⚙️", bg: t.bg === "#0A0F1E" ? "#2A1A0A" : "#FFF7ED", label: "Settings & Auto-Backup", sub: "Manage your preferences", cls: "fade-in-d4" },
        ].map(opt => (
          <button key={opt.sc} onClick={() => nav(opt.sc)} className={`card-hover ${opt.cls}`}
            style={{ background: t.bgCard, borderRadius: 16, padding: "14px 16px", border: `1.5px solid ${t.border}`,
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: opt.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{opt.icon}</div>
            <div>
              <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 14, color: t.text }}>{opt.label}</div>
              <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginTop: 1 }}>{opt.sub}</div>
            </div>
            <span style={{ marginLeft: "auto", color: t.textMuted, fontSize: 16 }}>›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── UPLOAD SCREEN ────────────────────────────────────────────────────────────
function UploadScreen({ nav, t, onUploadDone }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setDone(false);
    setError("");
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    let uploaded = 0;
    const totalFiles = files.length;
    for (let fi = 0; fi < totalFiles; fi++) {
      const file = files[fi];
      const snapUploaded = uploaded;
      setCurrentFile(file.name);
      try {
        await uploadFile(file, (p) => {
          const overall = Math.round(((snapUploaded + p / 100) / totalFiles) * 100);
          setProgress(overall);
        });
        uploaded++;
      } catch (err) {
        setError(`Failed to upload ${file.name}: ${err.message}`);
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    setDone(true);
    setProgress(100);
    onUploadDone();
  };

  return (
    <div style={{ padding: "24px 20px 32px", background: t.bg, minHeight: "100%" }}>
      <BackBtn onClick={() => nav("home")} />
      <div className="fade-in" style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text, marginBottom: 6 }}>Upload to Cloud</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 24, lineHeight: 1.5 }}>
          Select photos or videos from your device to back up to SnapVault Cloud.
        </div>
      </div>

      {!uploading && !done && (
        <>
          <label className="card-hover fade-in-d1" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: t.bgMuted, border: `2px dashed ${t.border}`, borderRadius: 16, padding: "32px 20px",
            cursor: "pointer", textAlign: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 40, marginBottom: 10 }}>📁</span>
            <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 15, color: t.text }}>Tap to select files</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginTop: 4 }}>Photos, videos, any format</div>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFiles} style={{ display: "none" }} />
          </label>

          {files.length > 0 && (
            <div className="fade-in" style={{ background: t.bgSubtle, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 8 }}>
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </div>
              {files.slice(0, 4).map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < Math.min(files.length, 4) - 1 ? `1px solid ${t.border}` : "none" }}>
                  <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{f.name}</span>
                  <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>{formatSize(f.size)}</span>
                </div>
              ))}
              {files.length > 4 && <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginTop: 4 }}>+{files.length - 4} more files</div>}
            </div>
          )}

          {error && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontFamily: "'Nunito Sans'", fontSize: 12, color: "#EF4444" }}>{error}</div>}

          <Btn t={t} onClick={handleUpload} style={{ opacity: files.length === 0 ? 0.5 : 1 }}>
            ☁️ Upload {files.length > 0 ? `${files.length} File${files.length > 1 ? "s" : ""}` : "Files"}
          </Btn>
        </>
      )}

      {uploading && (
        <div className="fade-in" style={{ textAlign: "center", paddingTop: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }} className="pulse">☁️</div>
          <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 16, color: t.text, marginBottom: 6 }}>Uploading…</div>
          <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginBottom: 18, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentFile}</div>
          <div style={{ background: t.border, borderRadius: 999, height: 10, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#60A5FA,#6366F1)", transition: "width 0.3s ease" }} />
          </div>
          <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>{progress}% complete</div>
        </div>
      )}

      {done && (
        <div className="fade-in" style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
          <div style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text, marginBottom: 8 }}>Upload complete!</div>
          <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 24 }}>
            {files.length} file{files.length > 1 ? "s" : ""} safely stored in SnapVault Cloud.
          </div>
          <Btn t={t} onClick={() => nav("gallery")} style={{ marginBottom: 10 }}>☁️ View Cloud Gallery</Btn>
          <Btn variant="secondary" t={t} onClick={() => { setFiles([]); setDone(false); setProgress(0); }}>Upload More Files</Btn>
        </div>
      )}
    </div>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function GalleryScreen({ nav, t, cloudFiles, setCloudFiles, loadingCloud }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggle = key => setSelected(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);

  const filtered = cloudFiles.filter(f => {
    const matchFilter = filter === "Photos" ? f.type === "photo" : filter === "Videos" ? f.type === "video" : true;
    const matchSearch = search === "" || f.name.toLowerCase().includes(search.toLowerCase()) || f.date.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const doDelete = async () => {
    setDeleting(true);
    for (const key of selected) {
      await deleteFile(key);
    }
    setCloudFiles(cf => cf.filter(f => !selected.includes(f.key)));
    setSelected([]); setSelectMode(false); setConfirmDelete(false); setDeleting(false);
  };

  const doDeleteOne = async (key) => {
    await deleteFile(key);
    setCloudFiles(cf => cf.filter(f => f.key !== key));
    setDetail(null);
  };

  if (detail) {
    const item = cloudFiles.find(f => f.key === detail);
    if (!item) { setDetail(null); return null; }
    return (
      <div style={{ padding: "20px 20px 32px", background: t.bg, minHeight: "100%" }}>
        <BackBtn onClick={() => setDetail(null)} />
        <div className="fade-in" style={{ marginTop: 14, borderRadius: 20, overflow: "hidden", aspectRatio: "1", background: item.color, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {item.type === "photo" && item.url
            ? <img src={item.url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 52 }}>{item.type === "video" ? "🎬" : "🖼️"}</span>}
        </div>
        <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 15, color: t.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
        <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted, marginBottom: 18 }}>{formatSize(item.size)} · {item.date}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a href={item.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <Btn t={t} onClick={() => {}}>👁️ View Full Size</Btn>
          </a>
          <a href={item.url} download={item.name} style={{ textDecoration: "none" }}>
            <Btn variant="secondary" t={t} onClick={() => {}}>⬇️ Download to Device</Btn>
          </a>
          <Btn variant="secondary" t={t} onClick={() => { if (navigator.share) navigator.share({ url: item.url, title: item.name }); }}>📤 Share</Btn>
          <Btn variant="danger" t={t} onClick={() => doDeleteOne(item.key)}>🗑️ Delete from Cloud</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg, position: "relative" }}>
      <div style={{ padding: "16px 20px 10px", borderBottom: `1px solid ${t.border}` }}>
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <BackBtn onClick={() => nav("home")} />
          <div style={{ fontFamily: "'Nunito'", fontSize: 19, color: t.text }}>Cloud Gallery</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button onClick={() => { setSelectMode(s => !s); setSelected([]); }} className="btn-press"
              style={{ background: selectMode ? "#3B82F6" : t.bgMuted, border: "none", borderRadius: 8, padding: "5px 10px",
                fontFamily: "'Nunito Sans'", fontSize: 11, fontWeight: 700, color: selectMode ? "white" : t.textSub, cursor: "pointer" }}>
              {selectMode ? "Cancel" : "Select"}
            </button>
            <div style={{ background: t.pill, borderRadius: 8, padding: "4px 10px", fontFamily: "'Nunito Sans'", fontSize: 11, fontWeight: 700, color: t.pillText }}>{cloudFiles.length} files</div>
          </div>
        </div>
        <div style={{ position: "relative", marginBottom: 10 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or date…"
            style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: `1.5px solid ${t.inputBorder}`,
              background: t.inputBg, color: t.text, fontFamily: "'Nunito Sans'", fontSize: 13, outline: "none" }} />
        </div>
        <FilterTabs active={filter} onChange={setFilter} t={t} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 20px" }}>
        {loadingCloud ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }} className="pulse">☁️</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted }}>Loading your files…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌥️</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 14, color: t.textMuted }}>
              {cloudFiles.length === 0 ? "No files backed up yet." : "No files match your search."}
            </div>
            {cloudFiles.length === 0 && <Btn t={t} onClick={() => nav("upload")} style={{ marginTop: 16, padding: "12px 0", fontSize: 13 }}>📤 Upload Your First File</Btn>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {filtered.map((item, i) => (
              <CloudThumbnail key={item.key} item={item}
                selected={selectMode && selected.includes(item.key)}
                showCheck={selectMode}
                onToggle={key => selectMode ? toggle(key) : setDetail(key)} />
            ))}
          </div>
        )}
      </div>

      {selectMode && (
        <div style={{ padding: "10px 20px 22px", borderTop: `1px solid ${t.border}`, background: t.bg }}>
          {selected.length > 0
            ? <><div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub, marginBottom: 8 }}><strong style={{ color: t.text }}>{selected.length} selected</strong></div>
                <Btn variant="danger" t={t} onClick={() => setConfirmDelete(true)}>🗑️ Delete {selected.length} Files</Btn></>
            : <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textMuted, padding: "6px 0" }}>Tap files to select</div>}
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: "absolute", inset: 0, background: "#00000070", display: "flex", alignItems: "flex-end", zIndex: 99 }}>
          <div className="slide-in" style={{ width: "100%", background: t.bgCard, borderRadius: "24px 24px 0 0", padding: "24px 20px 36px" }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 20, color: t.text, marginBottom: 8 }}>Delete {selected.length} files?</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 20, lineHeight: 1.5 }}>This permanently removes them from the cloud. Cannot be undone.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn variant="danger" t={t} onClick={doDelete}>{deleting ? "Deleting…" : "Yes, Delete Permanently"}</Btn>
              <Btn variant="secondary" t={t} onClick={() => setConfirmDelete(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PLANS ────────────────────────────────────────────────────────────────────
const PLANS = [
  { name: "Free", price: "$0", period: "", storage: "10 GB", color: "#64748B", features: ["10 GB storage (Cloudflare R2)", "Manual upload", "Basic gallery", "View & download"], recommended: false },
  { name: "Plus", price: "$1.99", period: "/mo", storage: "50 GB", color: "#3B82F6", features: ["50 GB storage", "Auto-backup", "Multi-device", "Search & filters", "Priority support"], recommended: true },
  { name: "Pro", price: "$4.99", period: "/mo", storage: "200 GB", color: "#6366F1", features: ["200 GB storage", "Auto-backup", "Unlimited devices", "Shared albums", "24/7 support"], recommended: false },
];

function PlansScreen({ nav, t }) {
  const [active, setActive] = useState("Plus");
  return (
    <div style={{ padding: "20px 20px 32px", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <BackBtn onClick={() => nav("home")} />
        <div style={{ fontFamily: "'Nunito'", fontSize: 20, color: t.text }}>Storage Plans</div>
      </div>
      <div style={{ textAlign: "center", fontFamily: "'Nunito Sans'", fontSize: 13, color: t.textSub, marginBottom: 20, lineHeight: 1.5 }}>Choose the plan that fits your needs.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PLANS.map((plan, i) => (
          <button key={plan.name} onClick={() => setActive(plan.name)} className={`card-hover fade-in-d${i + 1}`}
            style={{ background: active === plan.name ? `${plan.color}12` : t.bgCard,
              border: `2px solid ${active === plan.name ? plan.color : t.border}`,
              borderRadius: 18, padding: "16px", cursor: "pointer", textAlign: "left", position: "relative", transition: "all 0.2s" }}>
            {plan.recommended && (
              <div style={{ position: "absolute", top: -10, right: 16, background: "#3B82F6", color: "white",
                fontFamily: "'Nunito Sans'", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>RECOMMENDED</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 18, color: plan.color }}>{plan.name}</div>
                <div style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textMuted }}>{plan.storage} storage</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: "'Nunito'", fontSize: 22, color: t.text }}>{plan.price}</span>
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted }}>{plan.period}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: plan.color, fontSize: 12 }}>✓</span>
                  <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, color: t.textSub }}>{f}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20 }}><Btn t={t} onClick={() => nav("home")}>Continue with {active}</Btn></div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsScreen({ nav, t, dark, setDark }) {
  const [toggles, setToggles] = useState({ photos: true, videos: false, wifi: true, notify: true });
  const set = k => setToggles(p => ({ ...p, [k]: !p[k] }));
  const rows = [
    { key: "photos", icon: "📸", label: "Auto-backup new photos", sub: "When added to library" },
    { key: "videos", icon: "🎥", label: "Auto-backup new videos", sub: "May use more storage" },
    { key: "wifi", icon: "📶", label: "Only backup on WiFi", sub: "Saves mobile data" },
    { key: "notify", icon: "🔔", label: "Storage alerts", sub: "Notify when > 80% full" },
  ];
  return (
    <div style={{ padding: "20px 20px 32px", background: t.bg, minHeight: "100%" }}>
      <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <BackBtn onClick={() => nav("home")} />
        <div style={{ fontFamily: "'Nunito'", fontSize: 20, color: t.text }}>Settings</div>
      </div>
      <div className="fade-in-d1" style={{ background: t.bgSubtle, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        {rows.map((row, i) => (
          <div key={row.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : "none" }}>
            <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{row.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 600, fontSize: 13, color: t.text }}>{row.label}</div>
              <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted }}>{row.sub}</div>
            </div>
            <Toggle value={toggles[row.key]} onChange={() => set(row.key)} />
          </div>
        ))}
      </div>
      <div className="fade-in-d2" style={{ background: t.bgSubtle, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px" }}>
          <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{dark ? "🌙" : "☀️"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 600, fontSize: 13, color: t.text }}>Dark Mode</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: t.textMuted }}>Switch app appearance</div>
          </div>
          <Toggle value={dark} onChange={() => setDark(d => !d)} />
        </div>
      </div>
      <div className="fade-in-d3" style={{ background: t.bgSubtle, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 700, fontSize: 13, color: t.text, marginBottom: 10 }}>Connected Storage</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>☁️</span>
          <div>
            <div style={{ fontFamily: "'Nunito Sans'", fontWeight: 600, fontSize: 13, color: t.text }}>Cloudflare R2</div>
            <div style={{ fontFamily: "'Nunito Sans'", fontSize: 11, color: "#16A34A" }}>✓ Connected · 10 GB free</div>
          </div>
        </div>
        <Btn t={t} onClick={() => nav("plans")} style={{ padding: "11px 0", fontSize: 13 }}>⚡ Upgrade Plan</Btn>
      </div>
      <div className="fade-in-d4">
        <Btn variant="danger" t={t} onClick={() => nav("onboarding")} style={{ fontSize: 13 }}>Sign Out</Btn>
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const SCREENS = { onboarding: OnboardingScreen, login: AuthScreen, home: HomeScreen, upload: UploadScreen, gallery: GalleryScreen, plans: PlansScreen, settings: SettingsScreen };
const BOTTOM_TABS = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "upload", icon: "📤", label: "Upload" },
  { key: "gallery", icon: "☁️", label: "Cloud" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];
const SHOW_TAB = ["home", "upload", "gallery", "settings"];

export default function App() {
  const [screen, setScreen] = useState("onboarding");
  const [dark, setDark] = useState(false);
  const [cloudFiles, setCloudFiles] = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const t = getTheme(dark);

  const fetchCloudFiles = async () => {
    setLoadingCloud(true);
    try {
      const files = await listFiles();
      const mapped = files.map(f => ({
        key: f.key,
        name: f.key.replace(/^\d+-/, ""),
        size: f.size,
        type: getFileType(f.key),
        color: colorForKey(f.key),
        url: f.url,
        date: formatDate(f.uploaded),
        uploaded: f.uploaded,
      }));
      setCloudFiles(mapped);
    } catch (e) {
      console.error("Failed to load cloud files", e);
    }
    setLoadingCloud(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchCloudFiles(); }, []);

  const Screen = SCREENS[screen] || HomeScreen;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh",
      background: dark ? "#020617" : "#CBD5E1", padding: 20, transition: "background 0.4s" }}>
      <style>{css}</style>
      <div style={{ width: 375, background: t.bg, borderRadius: 44, overflow: "hidden", display: "flex",
        flexDirection: "column", height: 740, position: "relative",
        boxShadow: dark ? "0 32px 80px #000000A0, 0 8px 32px #00000060" : "0 24px 60px #00000025, 0 4px 16px #00000015",
        border: dark ? "1px solid #1A2236" : "1px solid #E2E8F0", transition: "all 0.4s" }}>

        {/* Status bar */}
        <div style={{ background: t.statusBar, padding: "14px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, transition: "background 0.3s" }}>
          <span style={{ fontFamily: "'Nunito Sans'", fontSize: 12, fontWeight: 700, color: t.text }}>9:41</span>
          <div style={{ width: 90, height: 16, background: t.text, borderRadius: 999, opacity: 0.85 }} />
          <DarkToggle dark={dark} setDark={setDark} />
        </div>

        {/* Screen */}
        <div key={screen} className="slide-in" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <Screen nav={setScreen} t={t} dark={dark} setDark={setDark}
            cloudFiles={cloudFiles} setCloudFiles={setCloudFiles}
            loadingCloud={loadingCloud}
            onUploadDone={fetchCloudFiles} />
        </div>

        {/* Bottom nav */}
        {SHOW_TAB.includes(screen) && (
          <div style={{ borderTop: `1px solid ${t.bottomBorder}`, background: t.bottomBar, display: "flex", padding: "10px 0 18px", flexShrink: 0, transition: "all 0.3s" }}>
            {BOTTOM_TABS.map(tab => (
              <button key={tab.key} onClick={() => setScreen(tab.key)} className="tab-bounce"
                style={{ flex: 1, background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  opacity: screen === tab.key ? 1 : 0.4, transition: "opacity 0.15s" }}>
                <span style={{ fontSize: 20 }}>{tab.icon}</span>
                <span style={{ fontFamily: "'Nunito Sans'", fontSize: 10, fontWeight: 700, color: screen === tab.key ? "#3B82F6" : t.tabInactive }}>{tab.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
