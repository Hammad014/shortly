// components/ExpirationStats.js
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ExpirationStats({ links }) {
  const stats = {
    totalExpiring: links.filter(l => l.expirationType !== 'none').length,
    expiringSoon: links.filter(l => 
      l.expirationType === 'datetime' && 
      new Date(l.expiresAt) < new Date(Date.now() + 7 * 86400000)
    ).length,
    expiredThisWeek: links.filter(l => 
      l.status === 'expired' && 
      new Date(l.updatedAt) > new Date(Date.now() - 7 * 86400000)
    ).length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Active Expirations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalExpiring}</div>
          <p className="text-sm text-muted-foreground">Links with active expiration rules</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiring Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">{stats.expiringSoon}</div>
          <p className="text-sm text-muted-foreground">Links expiring in next 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Expired</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">{stats.expiredThisWeek}</div>
          <p className="text-sm text-muted-foreground">Expired in last 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
}