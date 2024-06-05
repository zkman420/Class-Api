export default async function handler(req, res) {
    const { path } = req.query;
  
    switch (path) {
      case '/every-minute':
        handleEveryMinute();
        break;
      case '/every-hour':
        handleEveryHour();
        break;
      case '/every-day':
        handleEveryDay();
        break;
      default:
        res.status(404).json({ error: 'Invalid cron path' });
        break;
    }
  
    res.status(200).end();
  }
  async function handleEveryMinute() {
    try {
        let period = "Period 5";
        console.log("let" + period);
        const classes = await fetchClassInfo(period);
        console.log(classes);
      } catch (error) {
        console.error('Scheduled task failed:', error);
      }
  }
  
  async function handleEveryHour() {
    try {
        let period = "Period 5";
        console.log("let" + period);
        const classes = await fetchClassInfo(period);
        console.log(classes);
      } catch (error) {
        console.error('Scheduled task failed:', error);
      }
  }
  
  async function handleEveryDay() {
    try {
        let period = "Period 5";
        console.log("let" + period);
        const classes = await fetchClassInfo(period);
        console.log(classes);
      } catch (error) {
        console.error('Scheduled task failed:', error);
      }
  }