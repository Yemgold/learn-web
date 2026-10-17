
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Gamepad2,
  Link2,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";

function generateRoomCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }

  return code;
}

export default function WhotFriendPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  function validateName() {
    if (!name.trim()) {
      setMessage("Enter your player name first.");
      return false;
    }

    if (name.trim().length > 24) {
      setMessage("Your name must not exceed 24 characters.");
      return false;
    }

    return true;
  }

  function createRoom() {
    if (!validateName()) return;

    setBusy(true);
    setMessage("");
    setCopied(false);

    try {
      const code = generateRoomCode();

      setCreatedCode(code);

      // Store the prototype room on this browser only.
      // Replace this with your backend create-room request later.
      sessionStorage.setItem(
        `learnyfi-whot-room-${code}`,
        JSON.stringify({
          code,
          hostName: name.trim(),
          status: "waiting",
          createdAt: Date.now(),
        }),
      );

      setMessage("Demo room created. Backend connection is not enabled.");

      router.push(
        `/student/games/whot/friend/play?room=${code}&role=host&name=${encodeURIComponent(name.trim())}`,
      );
    } catch {
      setMessage("Unable to create a demo room in this browser.");
    } finally {
      setBusy(false);
    }
  }

  function joinRoom() {
    if (!validateName()) return;

    const code = roomCode.trim().toUpperCase();

    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) {
      setMessage("Enter a valid six-character room code.");
      return;
    }

    setBusy(true);
    setMessage("");

    // This is navigation only. Without a shared backend,
    // the code cannot verify or connect to another device.
    router.push(
      `/student/games/whot/friend/play?room=${code}&role=guest&name=${encodeURIComponent(name.trim())}`,
    );
  }

  async function copyInvitation() {
    if (!createdCode) return;

    const invitation =
      `${window.location.origin}/student/games/whot/friend` +
      `/play?room=${createdCode}&role=guest`;

    try {
      await navigator.clipboard.writeText(
        `Join my Learnyfi WHOT game!\n` +
        `Room code: ${createdCode}\n` +
        `Invite: ${invitation}`,
      );

      setCopied(true);
      setMessage("Invitation copied.");
    } catch {
      setMessage(
        `Share this room code with your friend: ${createdCode}`,
      );
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-3">
          <a
            href="/student/games/whot"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to WHOT
          </a>

          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300">
            <WifiOff className="h-4 w-4" />
            Demo mode
          </span>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <Gamepad2 className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Challenge someone you know
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              WHOT <span className="text-cyan-300">Friends</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Create a room, invite a friend, and get ready to
              test your knowledge with Learnyfi educational cards.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <Users className="h-4 w-4 text-cyan-300" />
                Two players
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <Wifi className="h-4 w-4 text-violet-300" />
                Online mode planned
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-5 sm:p-6">
          <label
            htmlFor="player-name"
            className="mb-2 block text-sm font-bold"
          >
            Your player name
          </label>

          <input
            id="player-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setMessage("");
            }}
            maxLength={24}
            placeholder="Enter your name"
            autoComplete="nickname"
            className="min-h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-base outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="flex flex-col rounded-3xl border border-cyan-400/20 bg-slate-900 p-6 sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Users className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Create a room
            </h2>

            <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
              Start a new game and receive a six-character room
              code that you can share with a friend.
            </p>

            <button
              type="button"
              onClick={createRoom}
              disabled={busy || !name.trim()}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 font-extrabold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create room
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section className="flex flex-col rounded-3xl border border-violet-400/20 bg-slate-900 p-6 sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
              <Link2 className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-black">
              Join a room
            </h2>

            <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
              Enter the room code your friend shares with you.
            </p>

            <label
              htmlFor="room-code"
              className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-slate-400"
            >
              Six-character room code
            </label>

            <input
              id="room-code"
              value={roomCode}
              onChange={(event) => {
                setRoomCode(
                  event.target.value
                    .toUpperCase()
                    .replace(/[^A-HJ-NP-Z2-9]/g, "")
                    .slice(0, 6),
                );
                setMessage("");
              }}
              maxLength={6}
              placeholder="ABC123"
              autoComplete="off"
              className="min-h-12 w-full rounded-xl border border-white/10 bg-slate-950 px-4 text-center font-mono text-lg font-black uppercase tracking-[0.25em] outline-none transition placeholder:text-slate-700 focus:border-violet-400"
            />

            <button
              type="button"
              onClick={joinRoom}
              disabled={busy || !name.trim() || roomCode.length !== 6}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-400 px-4 font-extrabold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Join room
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </div>

        {createdCode && (
          <section className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              Your demo room code
            </p>

            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-3xl font-black tracking-[0.25em] sm:text-4xl">
                {createdCode}
              </p>

              <button
                type="button"
                onClick={copyInvitation}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy invitation"}
              </button>
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              This is a local prototype room. Sharing the code does
              not establish a live multiplayer connection yet.
            </p>
          </section>
        )}

        {message && (
          <p
            role="status"
            className="mt-5 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-300"
          >
            {message}
          </p>
        )}

        <footer className="mt-10 border-t border-white/5 py-6 text-center">
          <p className="text-xs leading-6 text-slate-500">
            Learnyfi WHOT · Learn, match, and win together.
          </p>
        </footer>
      </div>
    </main>
  );
}
