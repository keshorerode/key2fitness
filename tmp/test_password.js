const getDynamicPassword = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(now);
  const d = parts.find(p => p.type === 'day')?.value;
  const m = parts.find(p => p.type === 'month')?.value;
  const y = parts.find(p => p.type === 'year')?.value;
  return `key2fitness${d}${m}${y}`;
};

console.log('Today\'s Password:', getDynamicPassword());
