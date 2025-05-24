import React from "react";

// UWAGA: To jest szablon 1:1 odwzorowujący screen panelu użytkownika.
// Ikony, badge, spacing, kolory, układ – wszystko jak na przesłanym zrzucie ekranu.

export default function Profile() {
  return (
    <div style={{ background: "#f7f9fa", minHeight: "100vh", padding: 0 }}>
      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", paddingTop: 32 }}>
        {/* Sidebar */}
        <aside style={{
          width: 240,
          background: "#fff",
          borderRadius: 8,
          marginRight: 32,
          padding: "32px 0 0 0",
          boxShadow: "0 2px 8px #0001"
        }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginLeft: 32, marginBottom: 32 }}>
            Panel Użytkownika
          </div>
          <nav>
            <SidebarItem active icon="🏠" label="Panel Główny" />
            <SidebarItem icon="✉" label="Wiadomości" badge={5} />
            <SidebarItem icon="🔔" label="Powiadomienia" badge={3} />
            <SidebarItem icon="💳" label="Historia Transakcji" />
            <SidebarItem icon="📋" label="Moje Ogłoszenia" />
            <SidebarItem icon="⚙" label="Ustawienia" />
          </nav>
        </aside>
        {/* Main content */}
        <main style={{ flex: 1 }}>
          {/* Zielony panel powitalny */}
          <div style={{
            background: "linear-gradient(90deg, #4b7d2c 0%, #6bbf43 100%)",
            borderRadius: 16,
            color: "#fff",
            padding: "32px 40px 24px 40px",
            marginBottom: 32,
            boxShadow: "0 2px 8px #0001",
            display: "flex",
            alignItems: "center",
            position: "relative"
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "#e6f4e6", color: "#4b7d2c",
              fontWeight: 700, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 32
            }}>
              M
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Witaj, Mateusz!</div>
              <div style={{ fontSize: 16, opacity: 0.9, marginBottom: 16 }}>
                <span role="img" aria-label="calendar">📅</span> Ostatnie logowanie dziś, 12:30
              </div>
              <div style={{ display: "flex", gap: 40 }}>
                <PanelStat label="Aktywne ogłoszenia" value="3" />
                <PanelStat label="Zakończone transakcje" value="12" />
                <PanelStat label="Ocena sprzedającego" value="4.8/5" icon="✔️" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{
                background: "#e6f4e6", color: "#4b7d2c", border: "none", borderRadius: 6,
                fontWeight: 600, fontSize: 16, padding: "10px 20px", cursor: "pointer"
              }}>⚙ Ustawienia</button>
              <button style={{
                background: "#22b14c", color: "#fff", border: "none", borderRadius: 6,
                fontWeight: 600, fontSize: 16, padding: "10px 20px", cursor: "pointer"
              }}>+ Dodaj ogłoszenie</button>
            </div>
          </div>
          {/* Zakładki */}
          <div style={{ display: "flex", gap: 32, marginBottom: 24 }}>
            <Tab active label="Przegląd" />
            <Tab label="Aktywność" />
            <Tab label="Wiadomości" badge={5} />
            <Tab label="Powiadomienia" badge={3} />
            <Tab label="Moje ogłoszenia" />
          </div>
          {/* Szybkie akcje */}
          <div style={{
            background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001",
            padding: 32, marginBottom: 32
          }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 24 }}>Szybkie akcje</div>
            <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
              <QuickAction icon="+" label="Dodaj ogłoszenie" />
              <QuickAction icon="✉" label="Wiadomości" badge={5} />
              <QuickAction icon="🔔" label="Powiadomienia" badge={3} />
              <QuickAction icon="♡" label="Ulubione" />
              <QuickAction icon="📋" label="Moje ogłoszenia" />
              <QuickAction icon="⚙" label="Ustawienia" />
            </div>
            {/* Ostatnia aktywność */}
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Ostatnia aktywność</div>
            <div>
              <Activity icon="✉" title="Nowa wiadomość od użytkownika" desc="Odpowiedz, aby kontynuować rozmowę" time="dziś, 10:42" action="Odpowiedz" />
              <Activity icon="📋" title="Dodano nowe ogłoszenie" desc="Sprawdź szczegóły swojego ogłoszenia" time="wczoraj, 12:42" action="Zobacz" />
              <Activity icon="👁" title="Twoje ogłoszenie zostało wyświetlone 15 razy" desc="Twoje ogłoszenie zyskuje popularność" time="27 kwietnia 2025 12:42" action="Szczegóły" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Komponenty pomocnicze

function SidebarItem({ icon, label, badge, active }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "14px 32px",
      fontWeight: 600, fontSize: 16, color: active ? "#22b14c" : "#222",
      background: active ? "#e0f7e9" : "none",
      borderLeft: active ? "4px solid #22b14c" : "4px solid transparent",
      marginBottom: 2, position: "relative"
    }}>
      <span style={{ fontSize: 20, marginRight: 16 }}>{icon}</span>
      {label}
      {badge && (
        <span style={{
          background: "#e53935", color: "#fff", borderRadius: 12, fontSize: 13,
          fontWeight: 700, padding: "2px 10px", marginLeft: 12
        }}>{badge}</span>
      )}
    </div>
  );
}

function PanelStat({ label, value, icon }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>{value} {icon && <span style={{ color: "#fff", fontSize: 18 }}>{icon}</span>}</div>
      <div style={{ fontSize: 15, opacity: 0.9 }}>{label}</div>
    </div>
  );
}

function Tab({ label, active, badge }) {
  return (
    <div style={{
      fontWeight: 600, fontSize: 16, color: active ? "#4b7d2c" : "#888",
      borderBottom: active ? "2.5px solid #4b7d2c" : "2.5px solid transparent",
      paddingBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
    }}>
      {label}
      {badge && (
        <span style={{
          background: "#e53935", color: "#fff", borderRadius: 12, fontSize: 13,
          fontWeight: 700, padding: "2px 10px"
        }}>{badge}</span>
      )}
    </div>
  );
}

function QuickAction({ icon, label, badge }) {
  return (
    <div style={{
      background: "#f7f9fa", borderRadius: 12, boxShadow: "0 1px 4px #0001",
      width: 120, height: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: 16, color: "#222", position: "relative"
    }}>
      <span style={{ fontSize: 28, marginBottom: 8 }}>{icon}</span>
      {label}
      {badge && (
        <span style={{
          background: "#e53935", color: "#fff", borderRadius: 12, fontSize: 13,
          fontWeight: 700, padding: "2px 10px", position: "absolute", top: 8, right: 12
        }}>{badge}</span>
      )}
    </div>
  );
}

function Activity({ icon, title, desc, time, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
      <span style={{
        background: "#e6f4e6", color: "#4b7d2c", borderRadius: "50%",
        width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, fontWeight: 700, marginRight: 16
      }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
        <div style={{ color: "#888", fontSize: 14 }}>{desc}</div>
      </div>
      <div style={{ textAlign: "right", minWidth: 120 }}>
        <div style={{ color: "#888", fontSize: 13 }}>{time}</div>
        <div style={{ color: "#22b14c", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>{action} &rarr;</div>
      </div>
    </div>
  );
}
