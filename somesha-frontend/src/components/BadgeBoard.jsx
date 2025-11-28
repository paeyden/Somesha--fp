import React, { useState, useEffect } from "react";
import { getProgressByChild } from "../services/api";

const BadgeBoard = ({ childId }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const { data } = await getProgressByChild(childId);
        const earned = data
          .filter((p) => p.badgeEarned)
          .map((p) => p.badgeEarned);
        setBadges(earned);
      } catch (err) {
        console.error("Failed to load badges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, [childId]);

  return (
    <div
      className="bg-white p-4 rounded shadow max-w-md mx-auto mt-4"
      aria-live="polite"
    >
      <h2 className="text-lg font-bold mb-4 text-center">My Badges</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-yellow-500"></div>
          <span className="sr-only">Loading badges...</span>
        </div>
      ) : badges.length ? (
        <ul className="flex gap-2 flex-wrap justify-center" aria-label="Earned badges">
          {badges.map((badge, i) => (
            <li
              key={i}
              className="bg-yellow-300 px-3 py-1 rounded text-sm font-medium text-gray-800"
            >
              {badge}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No badges earned yet.</p>
      )}
    </div>
  );
};

export default BadgeBoard;
