



"use client";

import LeaderboardRow from "./LeaderboardRow";

export interface LeaderboardTeam {
  id: string;
  rank: number;
  teamName: string;
  school: string;
  state: string;
  score: number;
  competitions: number;
  avatar?: string;
}

interface LeaderboardTableProps {
  data?: LeaderboardTeam[];
}

const demoData: LeaderboardTeam[] = [
  {
    id: "1",
    rank: 1,
    teamName: "Brain Masters",
    school: "King's College Lagos",
    state: "Lagos",
    score: 985,
    competitions: 18,
  },
  {
    id: "2",
    rank: 2,
    teamName: "Alpha Scholars",
    school: "Federal Government College",
    state: "Abuja",
    score: 970,
    competitions: 18,
  },
  {
    id: "3",
    rank: 3,
    teamName: "Success Team",
    school: "Government College Ibadan",
    state: "Oyo",
    score: 956,
    competitions: 17,
  },
  {
    id: "4",
    rank: 4,
    teamName: "Victory Squad",
    school: "Queens College",
    state: "Lagos",
    score: 945,
    competitions: 17,
  },
  {
    id: "5",
    rank: 5,
    teamName: "Excellent Minds",
    school: "FGGC Benin",
    state: "Edo",
    score: 932,
    competitions: 16,
  },
  {
    id: "6",
    rank: 6,
    teamName: "Scholars United",
    school: "Government Secondary School",
    state: "Kaduna",
    score: 920,
    competitions: 16,
  },
  {
    id: "7",
    rank: 7,
    teamName: "Future Doctors",
    school: "Loyola College",
    state: "Oyo",
    score: 915,
    competitions: 15,
  },
  {
    id: "8",
    rank: 8,
    teamName: "Golden Brains",
    school: "St. Gregory's College",
    state: "Lagos",
    score: 908,
    competitions: 15,
  },
];

export default function LeaderboardTable({
  data = demoData,
}: LeaderboardTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="grid grid-cols-[70px_1.7fr_1.2fr_120px_120px_120px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <div>Rank</div>
        <div>Team</div>
        <div>State</div>
        <div>Score</div>
        <div>Played</div>
        <div>Status</div>
      </div>

      {/* Rows */}
      <div className="space-y-3 p-4">
        {data.map((team) => (
          <LeaderboardRow
            key={team.id}
            rank={team.rank}
            teamName={team.teamName}
            school={team.school}
            state={team.state}
            score={team.score}
            competitions={team.competitions}
            avatar={team.avatar}
          />
        ))}
      </div>
    </section>
  );
}





