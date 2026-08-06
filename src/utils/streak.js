export function checkStreak(profile) {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!profile.last_played) {
    return {
      status: "first_time",
      daysMissed: 0,
    };
  }

  const last = new Date(profile.last_played);
  last.setHours(0, 0, 0, 0);

  const diff = Math.floor(
    (today - last) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) {
    return {
      status: "already_played",
      daysMissed: 0,
    };
  }

  if (diff === 1) {
    return {
      status: "continue",
      daysMissed: 0,
    };
  }

  return {
    status: "missed",
    daysMissed: diff - 1,
  };

}