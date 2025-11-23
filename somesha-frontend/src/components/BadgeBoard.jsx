import React, { useState, useEffect } from "react";
import { getProgressByChild } from "../services/api";

const BadgeBoard = ({ childId }) => {
  const [badges, setBadges] = useState([]);

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
      }
    };
    fetchBadges();
  }, [childId]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">My Badges</h2>
      {badges.length ? (
        <ul className="flex gap-2 flex-wrap">
          {badges.map((badge, i) => (
            <li key={i} className="bg-yellow-300 px-3 py-1 rounded">
              {badge}
            </li>
          ))}
        </ul>
      ) : (
        <p>No badges earned yet.</p>
      )}
    </div>
  );
};

export default BadgeBoard;