export default function handler(req, res) {
    const appVersion = process.env.APP_VERSION || 'unknown';
  
    res.status(200).json({
      status: 'OK',
      version: appVersion,
    });
  }
  