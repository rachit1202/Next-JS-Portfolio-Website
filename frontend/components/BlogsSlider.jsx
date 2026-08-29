'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogsSlider({ blogs = [] }) {
  const displayBlogs = blogs.length > 0 && blogs.length <= 3
    ? [...blogs, ...blogs]
    : blogs;

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, displayBlogs.length - itemsPerPage);

  const next = useCallback(() => {
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleTouchStart = (e) => {
    setIsPlaying(false);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      next();
    } else if (diff < -45) {
      prev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || displayBlogs.length <= itemsPerPage) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, next, displayBlogs.length, itemsPerPage]);

  if (!displayBlogs || displayBlogs.length === 0) return null;

  const stepPercent = isMobile ? 100 : 33.3333;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="overflow-hidden rounded-3xl p-1 -m-1">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${current * stepPercent}%)`,
          }}
        >
          {displayBlogs.map((blog, idx) => (
            <div
              key={`${blog._id || blog.slug || idx}-${idx}`}
              className="shrink-0 will-change-transform px-1 sm:px-3"
              style={{
                width: isMobile ? '100%' : '33.3333%',
                flex: isMobile ? '0 0 100%' : '0 0 33.3333%',
              }}
            >
              <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 dark:border-white/5">
                {/* Image */}
                <div className="relative h-44 sm:h-44 overflow-hidden bg-slate-900">
                  <Image
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800'}
                    alt={blog.title || 'Blog'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,7,13,0.85) 0%, transparent 60%)' }}
                  />

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {blog.category || 'Tech'}
                    </span>
                    <span
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] text-white"
                      style={{ background: 'rgba(7,7,13,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {blog.readTime || '5 min'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 pt-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] text-slate-400 bg-white/5 border border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold pt-1 transition-colors"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      Read Article <ArrowRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="flex items-center justify-between mt-6 sm:mt-8">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: idx === current ? '24px' : '6px',
                height: '6px',
                background: idx === current ? 'linear-gradient(90deg, #9333ea, #06b6d4)' : 'rgba(150,150,150,0.3)',
              }}
              aria-label={`Go to blog slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={prev} className="slider-btn" aria-label="Previous blog">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={next} className="slider-btn" aria-label="Next blog">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
