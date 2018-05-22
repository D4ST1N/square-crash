export default function getAchievementsStatus(name) {
  const achievementsData = localStorage.getItem('achievements');

  if (achievementsData) {
    const achievements = JSON.parse(achievementsData);

    return name ? achievements[name] || null : achievements;
  }

  return name ? null : {};
}