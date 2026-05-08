"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type AdminUser = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  isBanned: boolean;
  isRestricted: boolean;
  banReason?: string | null;
  telegramChatId?: string | null;
  telegramConnected: boolean;
  trackedPages: number;
  jobs: number;
  createdAt: string;
};

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [channel, setChannel] = useState<"email" | "telegram">("email");
  const [newPassword, setNewPassword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [banReason, setBanReason] = useState("");
  const [sending, setSending] = useState(false);

  const userCount = users.length;
  const totalTrackedPages = useMemo(() => users.reduce((sum, u) => sum + u.trackedPages, 0), [users]);
  const totalJobs = useMemo(() => users.reduce((sum, u) => sum + u.jobs, 0), [users]);

  const load = async () => {
    try {
      const meRes = await fetch("/api/admin/me");
      const me = await meRes.json();
      if (!me.isAdmin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const [settingsRes, usersRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/users"),
      ]);
      const settings = await settingsRes.json();
      const usersData = await usersRes.json();
      setSignupEnabled(settings.signupEnabled ?? true);
      setUsers(usersData.users || []);
    } catch {
      toast.error("Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSignupToggle = async (value: boolean) => {
    setSignupEnabled(value);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signupEnabled: value }),
    });
    if (!res.ok) {
      toast.error("Failed to update setting");
      setSignupEnabled(!value);
      return;
    }
    toast.success(value ? "Signup opened" : "Signup locked (maintenance mode)");
  };

  const sendMessage = async (sendToAll: boolean) => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    if (!sendToAll && !targetEmail.trim()) {
      toast.error("Target email is required.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sendToAll,
          targetEmail: targetEmail.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
          channel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to send message");
        return;
      }
      toast.success(`Message sent to ${data.sent} user(s).`);
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const updateUserStatus = async (
    userId: string,
    options: { isBanned: boolean; isRestricted: boolean; banReason?: string }
  ) => {
    const res = await fetch("/api/admin/users/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...options }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to update user status");
      return;
    }
    toast.success("User status updated");
    load();
  };

  const forceResetPassword = async () => {
    if (!selectedUserId || !newPassword.trim()) {
      toast.error("Select a user and enter a new password.");
      return;
    }
    const res = await fetch("/api/admin/users/force-reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUserId, newPassword: newPassword.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Failed to reset password");
      return;
    }
    toast.success(data.emailed ? "Password reset and email sent." : "Password reset (email not sent).");
    setNewPassword("");
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Admin Dashboard" description="Loading admin controls..." />
        <div className="p-6">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Header title="Admin Dashboard" description="Restricted area" />
        <div className="p-6 text-sm text-muted-foreground">You do not have access to this page.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Admin Dashboard" description="Control platform access, users, and outreach." />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total users</p>
            <p className="text-2xl font-semibold">{userCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tracked pages</p>
            <p className="text-2xl font-semibold">{totalTrackedPages}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Stored jobs</p>
            <p className="text-2xl font-semibold">{totalJobs}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Registration Control</h3>
              <p className="text-sm text-muted-foreground">
                Disable signup to show maintenance state to new users.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">{signupEnabled ? "Signup Open" : "Maintenance Mode"}</Label>
              <Switch checked={signupEnabled} onCheckedChange={updateSignupToggle} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Send Admin Message</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Target email (leave empty if sending to all)</Label>
              <Input value={targetEmail} onChange={(e) => setTargetEmail(e.target.value)} placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Announcement subject" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button type="button" variant={channel === "email" ? "default" : "outline"} onClick={() => setChannel("email")}>
              Email
            </Button>
            <Button type="button" variant={channel === "telegram" ? "default" : "outline"} onClick={() => setChannel("telegram")}>
              Telegram (linked users)
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            <Label>Message</Label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
              placeholder="Write message here..."
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button disabled={sending} onClick={() => sendMessage(false)}>
              Send to One User
            </Button>
            <Button disabled={sending} variant="outline" onClick={() => sendMessage(true)}>
              Broadcast to All Users
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Admin Force Reset Password</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>User</Label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Temporary password</Label>
              <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Set temporary password" />
            </div>
          </div>
          <Button className="mt-4" onClick={forceResetPassword}>
            Force Reset Password
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold">Users</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Email</th>
                  <th className="py-2">Verified</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Telegram</th>
                  <th className="py-2">Tracked URLs</th>
                  <th className="py-2">Jobs</th>
                  <th className="py-2">Joined</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border/70">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.isEmailVerified ? "Yes" : "No"}</td>
                    <td className="py-2">
                      {u.isBanned ? "Banned" : u.isRestricted ? "Restricted" : "Active"}
                    </td>
                    <td className="py-2">{u.telegramConnected ? "Connected" : "Not connected"}</td>
                    <td className="py-2">{u.trackedPages}</td>
                    <td className="py-2">{u.jobs}</td>
                    <td className="py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant={u.isBanned ? "secondary" : "outline"}
                          onClick={() =>
                            updateUserStatus(u.id, {
                              isBanned: !u.isBanned,
                              isRestricted: u.isRestricted,
                              banReason: !u.isBanned ? banReason : "",
                            })
                          }
                        >
                          {u.isBanned ? "Unban" : "Ban"}
                        </Button>
                        <Button
                          size="sm"
                          variant={u.isRestricted ? "secondary" : "outline"}
                          onClick={() =>
                            updateUserStatus(u.id, {
                              isBanned: u.isBanned,
                              isRestricted: !u.isRestricted,
                              banReason: u.banReason || "",
                            })
                          }
                        >
                          {u.isRestricted ? "Unrestrict" : "Restrict"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 max-w-md space-y-2">
            <Label>Ban reason (used when banning users)</Label>
            <Input value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Optional reason shown to user" />
          </div>
        </div>
      </div>
    </div>
  );
}
