'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GithubIcon } from '@/components/Icons';

export default function HomeSlider({ projects = [] }) {
  const displayProjects = projects.length > 0 && projects.length <= 3
    ? [...projects, ...projects]
    : projects;

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
  const maxIndex = Math.max(0, displayProjects.length - itemsPerPage);

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
    if (!isPlaying || displayProjects.length <= itemsPerPage) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, next, displayProjects.length, itemsPerPage]);

  if (!displayProjects || displayProjects.length === 0) return null;

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
      {/* Slider Window */}
      <div className="overflow-hidden rounded-3xl p-1 -m-1">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${current * stepPercent}%)`,
          }}
        >
          {displayProjects.map((project, idx) => (
            <div
              key={`${project._id || project.slug || idx}-${idx}`}
              className="shrink-0 transition-all duration-300 px-1 sm:px-3"
              style={{
                width: isMobile ? '100%' : '33.3333%',
                flex: isMobile ? '0 0 100%' : '0 0 33.3333%',
              }}
            >
              <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col h-full group border border-slate-200 dark:border-white/5">
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={project.coverImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,7,13,0.85) 0%, rgba(7,7,13,0.2) 60%, transparent 100%)' }}
                  />

                  {/* Category Badge */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-white shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {project.category || 'Full-Stack'}
                  </span>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
                        style={{ background: 'rgba(7,7,13,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                        title="Live Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
                        style={{ background: 'rgba(7,7,13,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                        title="GitHub Repo"
                      >
                        <GithubIcon className="w-3.5 h-3.5 text-purple-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3 pt-1">
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack?.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack?.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/10">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View Link */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold pt-1 transition-colors"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      View Case Study <ArrowRight className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
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
        {/* Pagination Indicators */}
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
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={prev} className="slider-btn" aria-label="Previous slide">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button onClick={next} className="slider-btn" aria-label="Next slide">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
