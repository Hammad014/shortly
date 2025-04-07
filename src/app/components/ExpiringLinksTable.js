// components/ExpiringLinksTable.js
'use client';
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import LinksTable from './LinksTable';

export default function ExpiringLinksTable({ links }) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLinks, setSelectedLinks] = useState([]);

  // Filter links based on expiration type
  const filteredLinks = links.filter(link => {
    if (selectedType === 'all') return link.expirationType !== 'none';
    return link.expirationType === selectedType;
  });

  // Custom columns for expiration management
  const expirationColumns = [
    ...LinksTable.columns, // Reuse existing columns
    {
      header: 'Days Left',
      accessorKey: 'expiresAt',
      cell: ({ row }) => {
        if (row.original.expirationType === 'datetime') {
          const daysLeft = Math.ceil(
            (new Date(row.original.expiresAt) - Date.now()) / (1000 * 3600 * 24)
          );
          return <span>{daysLeft} days</span>;
        }
        return 'N/A';
      }
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleExtendExpiration(row.original._id)}
          >
            Extend
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleExpireNow(row.original._id)}
          >
            Expire Now
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <ToggleGroup 
          value={selectedType} 
          onValueChange={setSelectedType}
          type="single"
        >
          <ToggleGroupItem value="all">All Expiring</ToggleGroupItem>
          <ToggleGroupItem value="datetime">Date-Based</ToggleGroupItem>
          <ToggleGroupItem value="downloads">Download-Limited</ToggleGroupItem>
        </ToggleGroup>

        <Button 
          variant="outline"
          onClick={handleBulkExtend}
          disabled={selectedLinks.length === 0}
        >
          Extend Selected ({selectedLinks.length})
        </Button>
      </div>

      {/* Enhanced Table */}
      <LinksTable
        links={filteredLinks}
        columns={expirationColumns}
        onRowSelection={setSelectedLinks}
        enableSelection
      />

      {/* Bulk Operations */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="destructive"
          onClick={handleBulkExpire}
          disabled={selectedLinks.length === 0}
        >
          Expire Selected
        </Button>
        <Button
          variant="secondary"
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </div>
    </div>
  );
}