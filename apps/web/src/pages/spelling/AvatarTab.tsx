import { useState } from "react";
import confetti from "canvas-confetti";
import { SHOP_ITEMS } from "./data";
import type { AvatarPart, ShopItem } from "./data";
import type { useSpellingStore } from "./useSpellingStore";
import CuteCharacter from "./CuteCharacter";

type Store = ReturnType<typeof useSpellingStore>;

const PART_LABELS: Record<AvatarPart, string> = {
  hat: "Hats", face: "Faces", shirt: "Outfits", accessory: "Pets",
};
const PART_EMOJI: Record<AvatarPart, string> = {
  hat: "👒", face: "🥺", shirt: "👗", accessory: "🐾",
};

type Filter = "all" | AvatarPart;

type Receipt = {
  type: "buy" | "return";
  itemName: string;
  itemEmoji: string;
  price: number;
  date: string;
};

export default function AvatarTab({ store }: { store: Store }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [shopOpen, setShopOpen] = useState(false);
  const [tryingOn, setTryingOn] = useState<ShopItem | null>(null);
  const [showReceipts, setShowReceipts] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [showReceipt, setShowReceipt] = useState<Receipt | null>(null);

  const { state, buyItem, returnItem, equipItem, setCharacterName } = store;

  // Preview: what the character looks like with the try-on item
  // Pass the emoji directly so CuteCharacter can look up the right colors
  const previewEquipped = tryingOn
    ? { ...state.equippedItems, [tryingOn.part]: tryingOn.emoji }
    : state.equippedItems;

  const filteredItems =
    filter === "all"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.part === filter);

  function handleBuyConfirm() {
    if (!tryingOn) return;
    const success = buyItem(tryingOn.id, tryingOn.price);
    if (success) {
      equipItem(tryingOn.part, tryingOn.id);
      const receipt: Receipt = {
        type: "buy",
        itemName: tryingOn.name,
        itemEmoji: tryingOn.emoji,
        price: tryingOn.price,
        date: new Date().toLocaleDateString(),
      };
      setReceipts((r) => [receipt, ...r]);
      setShowReceipt(receipt);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
    setTryingOn(null);
  }

  function handleReturn(item: ShopItem) {
    const success = returnItem(item.id, item.price);
    if (success) {
      const receipt: Receipt = {
        type: "return",
        itemName: item.name,
        itemEmoji: item.emoji,
        price: item.price,
        date: new Date().toLocaleDateString(),
      };
      setReceipts((r) => [receipt, ...r]);
      setShowReceipt(receipt);
    }
  }

  // ── Receipt Popup ──────────────────────────────────────────────

  if (showReceipt) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="animate-bounce-in w-full max-w-xs rounded-2xl border-2 border-dashed border-yellow-500/50 bg-gray-900 p-6">
          <h3 className="mb-4 text-center text-lg font-bold text-yellow-300">
            {showReceipt.type === "buy" ? "Purchase Receipt" : "Return Receipt"}
          </h3>
          <div className="border-t border-b border-gray-700 py-4 text-center">
            <span className="text-5xl">{showReceipt.itemEmoji}</span>
            <p className="mt-2 font-bold text-white">{showReceipt.itemName}</p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Type:</span>
              <span className={showReceipt.type === "buy" ? "text-green-400" : "text-orange-400"}>
                {showReceipt.type === "buy" ? "Purchase" : "Return"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Amount:</span>
              <span className="text-yellow-300">
                {showReceipt.type === "buy" ? "-" : "+"}{showReceipt.price} stars
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Date:</span>
              <span className="text-white/70">{showReceipt.date}</span>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-700 pt-3 text-center text-xs text-white/30">
            Spelling Adventure Shop
          </div>
        </div>
        <button
          onClick={() => setShowReceipt(null)}
          className="hover-bounce mt-4 cursor-pointer rounded-xl bg-purple-mid px-6 py-3 font-bold text-white transition hover:bg-purple-dark"
        >
          OK!
        </button>
      </div>
    );
  }

  // ── Receipts Box ───────────────────────────────────────────────

  if (showReceipts) {
    return (
      <div>
        <button onClick={() => setShowReceipts(false)} className="mb-4 cursor-pointer text-sm text-white/60 hover:text-white">
          ← Back
        </button>
        <h3 className="rainbow-sparkle mb-4 text-center text-xl font-bold">My Receipts</h3>
        {receipts.length === 0 ? (
          <p className="py-8 text-center text-white/40">No receipts yet! Buy something from the shop.</p>
        ) : (
          <div className="space-y-3">
            {receipts.map((r, i) => (
              <div key={i} className="animate-slide-up flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900 p-3">
                <span className="text-3xl">{r.itemEmoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{r.itemName}</p>
                  <p className="text-xs text-white/40">{r.date}</p>
                </div>
                <span className={`text-sm font-bold ${r.type === "buy" ? "text-red-400" : "text-green-400"}`}>
                  {r.type === "buy" ? `-${r.price}` : `+${r.price}`} stars
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Try-On Preview ─────────────────────────────────────────────

  if (tryingOn) {
    return (
      <div className="flex flex-col items-center py-4">
        <h3 className="rainbow-sparkle mb-4 text-xl font-bold">Try It On!</h3>

        {/* Before and After side by side */}
        <div className="mb-4 flex items-end gap-4">
          {/* Before */}
          <div className="text-center">
            <p className="mb-2 text-xs text-white/40">Before</p>
            <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-3">
              <CuteCharacter equippedItems={state.equippedItems} size="small" />
            </div>
          </div>

          <div className="mb-8 text-2xl text-white/30">&#8594;</div>

          {/* After (with new item!) */}
          <div className="text-center">
            <p className="mb-2 text-xs text-yellow-300 font-bold">With {tryingOn.name}!</p>
            <div className="rounded-xl border-2 border-yellow-400/50 bg-gradient-to-b from-pink-200/20 to-purple-200/20 p-3">
              <CuteCharacter equippedItems={previewEquipped} size="small" />
            </div>
          </div>
        </div>

        <p className="mb-1 text-lg font-bold text-white">{tryingOn.emoji} {tryingOn.name}</p>
        <p className="mb-4 text-sm text-yellow-300">Cost: {tryingOn.price} stars</p>

        {/* Yes / No buttons */}
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={handleBuyConfirm}
            disabled={state.stars < tryingOn.price}
            className={`flex-1 cursor-pointer rounded-xl py-3 text-sm font-bold text-white transition ${
              state.stars >= tryingOn.price
                ? "hover-bounce bg-green-600 hover:bg-green-500"
                : "cursor-not-allowed bg-gray-700 text-white/40"
            }`}
          >
            Yes, I want it!
          </button>
          <button
            onClick={() => setTryingOn(null)}
            className="hover-bounce flex-1 cursor-pointer rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-500"
          >
            No thanks!
          </button>
        </div>

        {state.stars < tryingOn.price && (
          <p className="mt-2 text-xs text-red-400">Need {tryingOn.price - state.stars} more stars!</p>
        )}
      </div>
    );
  }

  // ── Main View ──────────────────────────────────────────────────

  return (
    <div>
      <h2 className="rainbow-sparkle mb-6 text-center text-2xl font-bold sm:text-3xl">
        My Character
      </h2>

      {/* Character Display */}
      <div className="animate-bounce-in mx-auto mb-6 max-w-xs overflow-hidden rounded-[2rem] border-4 rainbow-border">
        <div className="relative overflow-hidden bg-gradient-to-b from-pink-200/30 via-purple-200/20 to-sky-200/30 px-6 pt-8 pb-6">
          <div className="absolute top-3 left-4 animate-float text-pink-400/50 text-sm" style={{ animationDelay: "0s" }}>&#9829;</div>
          <div className="absolute top-5 right-5 animate-float text-yellow-300/40 text-xs" style={{ animationDelay: "0.7s" }}>&#9733;</div>
          <div className="absolute bottom-16 left-6 animate-float text-purple-400/40 text-xs" style={{ animationDelay: "1.3s" }}>&#10022;</div>
          <div className="absolute top-8 right-12 animate-float text-pink-300/50 text-xs" style={{ animationDelay: "0.3s" }}>&#9829;</div>
          <div className="animate-float flex justify-center py-4">
            <CuteCharacter equippedItems={state.equippedItems} size="large" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-sky-500/20 px-4 py-3">
          <input
            type="text"
            value={state.characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="w-full rounded-full border-2 border-pink-300/30 bg-gray-900/80 px-4 py-2 text-center text-lg font-bold text-white outline-none transition focus:border-pink-400"
            maxLength={20}
          />
        </div>
      </div>

      {/* Star Balance */}
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-900/50 px-6 py-3 text-lg font-bold text-yellow-300">
          <span className="animate-heart-beat text-2xl">&#9733;</span> You have {state.stars} stars!
        </span>
      </div>

      {/* Buttons row */}
      <div className="mb-4 flex justify-center gap-3">
        <button
          onClick={() => setShopOpen(!shopOpen)}
          className="hover-bounce cursor-pointer rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-pink-500/20 transition hover:shadow-xl"
        >
          {shopOpen ? "Close Shop" : "Open Prize Shop!"}
        </button>

        {/* Receipts box button */}
        {receipts.length > 0 && (
          <button
            onClick={() => setShowReceipts(true)}
            className="hover-bounce relative cursor-pointer rounded-2xl bg-yellow-700 px-5 py-3 text-base font-bold text-white transition hover:bg-yellow-600"
          >
            Receipts
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {receipts.length}
            </span>
          </button>
        )}
      </div>

      {/* ═══ PRIZE SHOP ═══ */}
      {shopOpen && (
        <div className="animate-slide-up">
          <h3 className="rainbow-sparkle mb-4 text-center text-xl font-bold">
            Prize Shop
          </h3>

          {/* Filter buttons */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {(["all", "hat", "face", "shirt", "accessory"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`hover-bounce cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-purple-mid text-white shadow-lg shadow-purple-mid/30 scale-105"
                    : "bg-gray-800 text-white/60 hover:text-white hover:bg-gray-700"
                }`}
              >
                {f === "all" ? "All" : `${PART_EMOJI[f]} ${PART_LABELS[f]}`}
              </button>
            ))}
          </div>

          {/* Shop Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {filteredItems.map((item, i) => {
              const owned = state.ownedItems.includes(item.id);
              const equipped = state.equippedItems[item.part] === item.id;
              const canAfford = state.stars >= item.price;

              return (
                <div
                  key={item.id}
                  className={`animate-slide-up rounded-2xl border-2 bg-gray-900 p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg ${
                    equipped
                      ? "border-green-400 shadow-lg shadow-green-500/20"
                      : owned
                        ? "border-purple-mid/40 hover:border-purple-mid"
                        : "border-gray-700/30 hover:border-gray-600"
                  }`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <span className="hover-wiggle inline-block text-5xl cursor-default">{item.emoji}</span>
                  <p className="mt-2 text-sm font-bold text-white">{item.name}</p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {PART_EMOJI[item.part]} {PART_LABELS[item.part]}
                  </p>

                  {!owned && (
                    <p className="mt-1 text-sm font-bold text-yellow-300">{item.price} stars</p>
                  )}

                  <div className="mt-3 space-y-2">
                    {equipped ? (
                      <button
                        onClick={() => equipItem(item.part, null)}
                        className="hover-bounce w-full cursor-pointer rounded-full bg-green-900/50 px-3 py-2 text-sm font-bold text-green-400 transition hover:bg-green-900"
                      >
                        Wearing! &#10003;
                      </button>
                    ) : owned ? (
                      <>
                        <button
                          onClick={() => equipItem(item.part, item.id)}
                          className="hover-bounce w-full cursor-pointer rounded-full border-2 border-purple-mid px-3 py-2 text-sm font-bold text-purple-light transition hover:bg-purple-mid/20"
                        >
                          Put On!
                        </button>
                        <button
                          onClick={() => handleReturn(item)}
                          className="w-full cursor-pointer rounded-full bg-orange-900/40 px-3 py-1.5 text-xs font-bold text-orange-300 transition hover:bg-orange-900/60"
                        >
                          Return (+{item.price} stars)
                        </button>
                      </>
                    ) : canAfford ? (
                      <button
                        onClick={() => setTryingOn(item)}
                        className="hover-bounce w-full cursor-pointer rounded-full bg-purple-mid px-3 py-2 text-sm font-bold text-white transition hover:bg-purple-dark"
                      >
                        Try It On!
                      </button>
                    ) : (
                      <p className="mt-1 text-xs text-white/30">
                        Need {item.price - state.stars} more stars
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
