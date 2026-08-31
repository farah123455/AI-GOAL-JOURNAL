import { useEffect } from "react";
import { animate } from "animejs";

export default function AnimeTest() {
  useEffect(() => {
    animate(".anime-test-box", {
      x: 300,
      duration: 1200,
      ease: "outExpo",
    });
  }, []);

  return (
    <div className="p-10">
      <div className="anime-test-box w-20 h-20 bg-indigo-600 rounded-2xl" />
    </div>
  );
}