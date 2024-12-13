const cron = require('node-cron');
const Train = require('../models/Train');

class TrainStatusUpdater {
  static init() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const currentDate = new Date();
        await Train.updateMany(
          {
            'route.source.departureTime': { $lt: currentDate },
            'status': 'active'
          },
          {
            $set: { status: 'finished' }
          }
        );
      } catch (error) {
        console.error('Error updating train status:', error);
      }
    });
  }
}

module.exports = TrainStatusUpdater;