import type { BabysittingRequest } from "@/lib/types";
import { updateStatus } from "@/lib/api";
import StarRating from "@/components/StarRating";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function RequestCard({
  request,
  passphrase,
  onUpdate,
}: {
  request: BabysittingRequest;
  passphrase: string;
  onUpdate: () => void;
}) {
  const handleAction = async (newStatus: string) => {
    try {
      await updateStatus(request.id, newStatus, passphrase);
      onUpdate();
    } catch (err) {
      alert("Failed to update: " + (err as Error).message);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-purple-mid bg-gray-900 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">
            {request.parent_name}
          </h3>
          <p className="text-sm text-white/60">
            {request.parent_email} &middot; {request.parent_phone}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[request.status]}`}
        >
          {request.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/80">
        <p>📅 {request.date_needed}</p>
        <p>🕐 {request.time_needed}</p>
        <p>👶 {request.num_kids} kid{request.num_kids > 1 ? "s" : ""}</p>
        {request.kids_names && <p>🏷️ Names: {request.kids_names}</p>}
        <p>🎂 Ages: {request.kids_ages}</p>
      </div>

      {request.special_instructions && (
        <p className="mt-2 rounded-lg bg-gray-800 p-2 text-sm text-white/70">
          📝 {request.special_instructions}
        </p>
      )}

      {request.rating_stars && (
        <div className="mt-3 flex items-center gap-2">
          <StarRating value={request.rating_stars} readonly />
          {request.rating_comment && (
            <p className="text-sm text-white/60">
              "{request.rating_comment}"
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {request.status === "pending" && (
          <>
            <button
              onClick={() => handleAction("accepted")}
              className="rounded-full bg-green-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction("declined")}
              className="rounded-full bg-red-400 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-500"
            >
              Decline
            </button>
          </>
        )}
        {request.status === "accepted" && (
          <button
            onClick={() => handleAction("completed")}
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
