"use client";

export function AdminSignOutButton() {
  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.assign("/admin/login");
  }

  return (
    <button className="sidebarButton" type="button" onClick={signOut}>
      Sign out
    </button>
  );
}
