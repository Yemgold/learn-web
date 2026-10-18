




"use client";

import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Coins,
  Crown,
  History,
  Info,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  Wallet,
  X,
  Zap,
} from "lucide-react";

import type {
  EduLudoPlayer,
  EduLudoTransaction,
} from "./eduLudoTypes";

import {
  CAPTURE_REWARD,
  QUESTION_COST,
  TOKEN_HOME_REWARD,
  WINNER_REWARD,
} from "./eduLudoConstants";

export type LudoDialogType =
  | "rules"
  | "wallet"
  | "rewards"
  | "history"
  | null;

interface LudoGameDialogsProps {
  activeDialog?: LudoDialogType;
  onCloseDialog?: () => void;

  showExitConfirmation?: boolean;
  onCancelExit?: () => void;
  onConfirmExit?: () => void;

  showGameOver?: boolean;
  winner?: EduLudoPlayer | null;
  players?: EduLudoPlayer[];
  matchReward?: number;
  onPlayAgain?: () => void;
  onReturnToLobby?: () => void;

  balance?: number;
  cbtPoints?: number;
  transactions?: EduLudoTransaction[];
  onFundWallet?: () => void;

  onResetGame?: () => void;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function DialogShell({
  children,
  onClose,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="my-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/50 bg-white shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={19} />
          </button>
        </header>

        <div className="p-5 sm:p-6">{children}</div>
      </section>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const styles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50",
    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

function RulesDialog({ onClose }: { onClose: () => void }) {
  const rules = [
    {
      icon: <Dice5Icon />,
      title: "Roll the dice",
      description:
        "Roll to determine how far an eligible token can move.",
    },
    {
      icon: <BookOpen size={19} />,
      title: "Answer a question",
      description:
        `Each presented question costs ${formatNaira(QUESTION_COST)} from your wallet in this prototype, whether you answer correctly or incorrectly.`,
    },
    {
      icon: <ShieldCheck size={19} />,
      title: "Stay safe",
      description:
        "Tokens on safe squares are protected from capture.",
    },
    {
      icon: <Trophy size={19} />,
      title: "Reach home",
      description:
        "Move your tokens around the board and into your home lane. The first player to finish all their tokens wins.",
    },
  ];

  return (
    <DialogShell
      title="How to play Edu Ludo"
      subtitle="Learn, answer, move, and win."
      onClose={onClose}
    >
      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={rule.title}
            className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              {rule.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">
                {index + 1}. {rule.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {rule.description}
              </p>
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-900">
            <Info size={18} />
            <p className="text-sm font-bold">Remember</p>
          </div>

          <p className="mt-1.5 text-sm leading-6 text-amber-800">
            Wallet money and CBT reward points are different balances.
            Rewards shown here are prototype values and do not represent
            a confirmed cash payout.
          </p>
        </div>

        <ActionButton onClick={onClose}>
          Got it
          <ChevronRight size={17} />
        </ActionButton>
      </div>
    </DialogShell>
  );
}

function WalletDialog({
  balance,
  cbtPoints,
  onFundWallet,
  onClose,
}: {
  balance: number;
  cbtPoints: number;
  onFundWallet?: () => void;
  onClose: () => void;
}) {
  return (
    <DialogShell
      title="My wallet"
      subtitle="Your wallet and reward balances."
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
            <Wallet size={17} />
            Available wallet balance
          </div>

          <p className="mt-3 text-3xl font-black tracking-tight">
            {formatNaira(balance)}
          </p>

          <p className="mt-2 text-xs text-indigo-100">
            Question charge: {formatNaira(QUESTION_COST)} per question
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Coins size={18} />
            <span className="text-sm font-semibold">
              CBT reward points
            </span>
          </div>

          <p className="mt-2 text-2xl font-extrabold text-amber-900">
            {cbtPoints.toLocaleString()} CBT
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-800">
            CBT points are tracked separately from your naira wallet.
          </p>
        </div>

        {onFundWallet && (
          <ActionButton onClick={onFundWallet}>
            <Wallet size={17} />
            Fund wallet
          </ActionButton>
        )}
      </div>
    </DialogShell>
  );
}

function RewardsDialog({
  cbtPoints,
  onClose,
}: {
  cbtPoints: number;
  onClose: () => void;
}) {
  const rewards = [
    {
      title: "Capture an opponent",
      amount: CAPTURE_REWARD,
      icon: <Zap size={18} />,
    },
    {
      title: "Move a token home",
      amount: TOKEN_HOME_REWARD,
      icon: <ShieldCheck size={18} />,
    },
    {
      title: "Win the match",
      amount: WINNER_REWARD,
      icon: <Crown size={18} />,
    },
  ];

  return (
    <DialogShell
      title="Rewards"
      subtitle="Earn CBT points as you progress."
      onClose={onClose}
    >
      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">
          Your current CBT points
        </p>

        <p className="mt-1 text-3xl font-black text-amber-900">
          {cbtPoints.toLocaleString()}
        </p>
      </div>

      <div className="space-y-3">
        {rewards.map((reward) => (
          <div
            key={reward.title}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              {reward.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {reward.title}
              </p>
            </div>

            <span className="shrink-0 text-sm font-extrabold text-emerald-700">
              +{reward.amount} CBT
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        These are the configured prototype rewards. Actual rewards depend
        on the game logic and successful completion of the relevant action.
      </p>
    </DialogShell>
  );
}

function HistoryDialog({
  transactions,
  onClose,
}: {
  transactions: EduLudoTransaction[];
  onClose: () => void;
}) {
  return (
    <DialogShell
      title="Transaction history"
      subtitle="Recent wallet activity."
      onClose={onClose}
    >
      {transactions.length === 0 ? (
        <div className="py-8 text-center">
          <History
            size={30}
            className="mx-auto text-slate-300"
          />
          <p className="mt-3 text-sm font-bold text-slate-700">
            No transactions yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Your game wallet activity will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
            >
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  transaction.type === "credit"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600",
                ].join(" ")}
              >
                {transaction.type === "credit" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Coins size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {transaction.description}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p
                  className={[
                    "text-sm font-extrabold tabular-nums",
                    transaction.type === "credit"
                      ? "text-emerald-700"
                      : "text-red-600",
                  ].join(" ")}
                >
                  {transaction.type === "credit" ? "+" : "−"}
                  {formatNaira(transaction.amount)}
                </p>

                {typeof transaction.balanceAfter === "number" && (
                  <p className="mt-1 text-[10px] text-slate-400">
                    Balance: {formatNaira(transaction.balanceAfter)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DialogShell>
  );
}

function ExitConfirmation({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <DialogShell
      title="Leave this game?"
      subtitle="Check before leaving your match."
      onClose={onCancel}
    >
      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
          <CircleHelp size={20} />
        </div>

        <div>
          <p className="text-sm font-bold text-amber-950">
            Are you sure you want to exit?
          </p>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Your current match may not be saved. Any wallet or reward
            changes already applied will depend on the game logic.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ActionButton variant="secondary" onClick={onCancel}>
          Stay in game
        </ActionButton>

        <ActionButton variant="danger" onClick={onConfirm}>
          <ArrowLeft size={17} />
          Exit game
        </ActionButton>
      </div>
    </DialogShell>
  );
}

function GameOverDialog({
  winner,
  players,
  matchReward,
  cbtPoints,
  onPlayAgain,
  onReturnToLobby,
  onClose,
}: {
  winner?: EduLudoPlayer | null;
  players: EduLudoPlayer[];
  matchReward: number;
  cbtPoints: number;
  onPlayAgain?: () => void;
  onReturnToLobby?: () => void;
  onClose: () => void;
}) {
  const sortedPlayers = [...players].sort(
    (a, b) => (b.score ?? 0) - (a.score ?? 0),
  );

  return (
    <DialogShell
      title={winner ? "Congratulations!" : "Game completed"}
      subtitle={
        winner
          ? `${winner.name} has won the match.`
          : "Here are the final scores."
      }
      onClose={onClose}
    >
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 p-5 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/20">
          {winner ? (
            <Trophy size={32} />
          ) : (
            <Award size={32} />
          )}
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
          {winner ? "Match winner" : "Final result"}
        </p>

        <h3 className="mt-1 text-2xl font-black">
          {winner?.name ?? "Well played!"}
        </h3>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2">
          <Sparkles size={17} />
          <span className="text-sm font-extrabold">
            +{matchReward.toLocaleString()} CBT points
          </span>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-extrabold text-slate-900">
          Final leaderboard
        </h4>

        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-extrabold text-slate-600">
                {index === 0 ? (
                  <Crown size={17} className="text-amber-500" />
                ) : (
                  index + 1
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {player.name}
                </p>
                <p className="text-xs text-slate-500">
                  {player.isBot ? "Computer" : "Player"}
                </p>
              </div>

              <p className="text-sm font-extrabold tabular-nums text-slate-900">
                {(player.score ?? 0).toLocaleString()} pts
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-emerald-50 p-3">
        <p className="text-sm font-bold text-emerald-900">
          Current CBT balance: {cbtPoints.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-emerald-800">
          Displayed balance is supplied by the game component.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {onPlayAgain && (
          <div className="flex-1">
            <ActionButton onClick={onPlayAgain}>
              <RotateCcw size={17} />
              Play again
            </ActionButton>
          </div>
        )}

        {onReturnToLobby && (
          <div className="flex-1">
            <ActionButton
              variant="secondary"
              onClick={onReturnToLobby}
            >
              Return to lobby
              <ChevronRight size={17} />
            </ActionButton>
          </div>
        )}
      </div>
    </DialogShell>
  );
}

export default function LudoGameDialogs({
  activeDialog = null,
  onCloseDialog = () => {},

  showExitConfirmation = false,
  onCancelExit = () => {},
  onConfirmExit = () => {},

  showGameOver = false,
  winner = null,
  players = [],
  matchReward = 0,
  onPlayAgain,
  onReturnToLobby,

  balance = 0,
  cbtPoints = 0,
  transactions = [],
  onFundWallet,

  onResetGame,
}: LudoGameDialogsProps) {
  if (showGameOver) {
    return (
      <GameOverDialog
        winner={winner}
        players={players}
        matchReward={matchReward}
        cbtPoints={cbtPoints}
        onPlayAgain={onPlayAgain ?? onResetGame}
        onReturnToLobby={onReturnToLobby}
        onClose={onCloseDialog}
      />
    );
  }

  if (showExitConfirmation) {
    return (
      <ExitConfirmation
        onCancel={onCancelExit}
        onConfirm={onConfirmExit}
      />
    );
  }

  if (!activeDialog) return null;

  switch (activeDialog) {
    case "rules":
      return <RulesDialog onClose={onCloseDialog} />;

    case "wallet":
      return (
        <WalletDialog
          balance={balance}
          cbtPoints={cbtPoints}
          onFundWallet={onFundWallet}
          onClose={onCloseDialog}
        />
      );

    case "rewards":
      return (
        <RewardsDialog
          cbtPoints={cbtPoints}
          onClose={onCloseDialog}
        />
      );

    case "history":
      return (
        <HistoryDialog
          transactions={transactions}
          onClose={onCloseDialog}
        />
      );

    default:
      return null;
  }
}

function Dice5Icon() {
  return <CircleHelp size={19} />;
}
