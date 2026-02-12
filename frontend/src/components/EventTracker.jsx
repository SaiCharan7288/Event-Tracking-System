import { useEffect, useCallback } from 'react';
import { queueEvent } from '../services/api';
import { debounce } from 'lodash';

const EventTracker = () => {
  const getBrowserInfo = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      pageUrl: window.location.href,
      timestamp: new Date().toISOString()
    };
  }, []);

  useEffect(() => {
    const handleClick = async (e) => {
      await queueEvent({
        eventType: 'click',
        ...getBrowserInfo(),
        coordinates: { x: e.clientX, y: e.clientY },
        element: {
          tagName: e.target.tagName,
          id: e.target.id || null,
          className: e.target.className || null,
          text: e.target.innerText?.slice(0, 50)
        }
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [getBrowserInfo]);

  useEffect(() => {
    const handleScroll = debounce(async () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

      if (Math.floor(scrollPercentage) % 25 === 0) {
        await queueEvent({
          eventType: 'scroll',
          ...getBrowserInfo(),
          scrollDepth: Math.round(scrollPercentage),
          coordinates: { x: window.scrollX, y: scrollY }
        });
      }
    }, 1000);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getBrowserInfo]);

  useEffect(() => {
    const handleMouseMove = debounce(async (e) => {
      await queueEvent({
        eventType: 'mousemove',
        ...getBrowserInfo(),
        coordinates: { x: e.clientX, y: e.clientY }
      });
    }, 5000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [getBrowserInfo]);

  useEffect(() => {
    queueEvent({
      eventType: 'pageview',
      ...getBrowserInfo()
    });
  }, [getBrowserInfo]);

  return null;
};

// ✅ THIS LINE MUST BE AT THE BOTTOM!
export default EventTracker;