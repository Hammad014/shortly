import dbConnect from '../../lib/db';
import Link from '../../models/Link';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  
  try {
    const links = await Link.find({ sessionId });
    const totalClicks = links.reduce((sum, link) => sum + link.totalClicks, 0);
    const activeLinks = links.filter(l => l.status === 'active').length;
    const uniqueVisitors = [...new Set(links.flatMap(link => link.uniqueVisitors))].length;

    const [countryStats, deviceStats, leaderboard] = await Promise.all([
      Link.aggregate([
        { $match: { sessionId } },
        { $unwind: '$clicks' },
        { 
          $group: {
            _id: '$clicks.countryCode',
            clicks: { $sum: 1 },
            uniqueVisitors: { $addToSet: "$clicks.visitorId" }
          }
        },
        {
          $project: {
            countryCode: '$_id',
            clicks: 1,
            uniqueVisitors: { $size: "$uniqueVisitors" },
            _id: 0
          }
        },
        { $match: { countryCode: { $nin: [null, 'Unknown', 'LOCAL', ''] } } }
      ]),
      Link.aggregate([
        { $match: { sessionId } },
        { $unwind: '$clicks' },
        {
          $project: {
            deviceType: {
              $cond: {
                if: { $in: ['$clicks.deviceType', [null, undefined, ''] ]},
                then: 'desktop',
                else: '$clicks.deviceType'
              }
            }
          }
        },
        {
          $group: {
            _id: '$deviceType',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            device: {
              $switch: {
                branches: [
                  { case: { $eq: ['$_id', 'mobile'] }, then: 'Mobile' },
                  { case: { $eq: ['$_id', 'tablet'] }, then: 'Tablet' },
                  { case: { $eq: ['$_id', 'smarttv'] }, then: 'Smart TV' },
                  { case: { $eq: ['$_id', 'wearable'] }, then: 'Wearable' },
                  { case: { $eq: ['$_id', 'console'] }, then: 'Console' }
                ],
                default: 'Desktop'
              }
            },
            count: 1,
            _id: 0
          }
        }
      ]),
      Link.aggregate([
        { $match: { sessionId } },
        {
          $project: {
            shortUrl: 1,
            fullShortUrl: 1,
            originalUrl: 1,
            totalClicks: 1,
            lastClicked: { $max: "$clicks.timestamp" } // Remove date conversion here
          }
        },
        { $sort: { totalClicks: -1 } },
        { $limit: 5 }
      ])
    ]);

    const dailyClicks = await Link.aggregate([
      { $match: { sessionId } },
      { $unwind: '$clicks' },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$clicks.timestamp" } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", clicks: 1, _id: 0 } }
    ]);

    return new Response(
      JSON.stringify({
        totalLinks: links.length,
        totalClicks,
        activeLinks,
        uniqueVisitors,
        countryStats,
        deviceStats,
        leaderboard,
        timeline: { daily: dailyClicks }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('[Analytics API] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to load analytics', details: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}