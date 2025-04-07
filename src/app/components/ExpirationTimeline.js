'use client';
import { Timeline } from 'vis-timeline';
import { useEffect, useRef } from 'react';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

export default function ExpirationTimeline({ links }) {
  const timelineRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && timelineRef.current) {
      const items = links
        .filter(l => l.expirationType === 'datetime')
        .map(link => ({
          id: link._id,
          content: link.shortUrl,
          start: new Date(link.expiresAt),
          type: 'point'
        }));

      const options = {
        showCurrentTime: true,
        zoomable: true,
        margin: {
          item: 10
        }
      };

      const timeline = new Timeline(timelineRef.current, items, options);
      return () => timeline.destroy();
    }
  }, [links]);

  return <div ref={timelineRef} style={{ height: '400px', width: '100%' }} />;
}