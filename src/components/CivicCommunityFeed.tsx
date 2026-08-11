import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  Check, 
  Star
} from 'lucide-react';
import { GrievanceItem } from '../types';

interface FeedCardItem {
  id: string;
  title: string;
  titleHighlight?: string;
  category: string;
  location: string;
  distance: string;
  status: 'REPORTED' | 'PROCESSING' | 'RESOLVED' | 'URGENT';
  imageUrl: string;
  fallbackGradient: string;
  citizenName: string;
  timeAgo: string;
  description?: string;
}

const SAMPLE_FEED_ITEMS: FeedCardItem[] = [
  {
    id: 'feed-1',
    title: 'Deep Pothole near',
    titleHighlight: 'School Gate',
    category: 'Potholes',
    location: 'Sector 12, Chandigarh',
    distance: '250m away',
    status: 'REPORTED',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-amber-600 to-stone-800',
    citizenName: 'Aarav Sharma',
    timeAgo: '2h ago',
    description: 'Large pothole forming right outside St. Xavier school entrance. Causing traffic jams during morning drop-off hours.'
  },
  {
    id: 'feed-2',
    title: 'Overflowing Garbage Bin at',
    titleHighlight: 'Main Market',
    category: 'Waste Management',
    location: 'Sector 12 Market',
    distance: '400m away',
    status: 'PROCESSING',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-amber-500 to-emerald-700',
    citizenName: 'Priya Malhotra',
    timeAgo: '4h ago',
    description: 'Community garbage bins overflowing near shop #42. Sanitation truck needed for clearing.'
  },
  {
    id: 'feed-3',
    title: 'Broken Streetlight &',
    titleHighlight: 'Dark Stretch',
    category: 'Street Lights',
    location: 'Sector 12, B-Block',
    distance: '180m away',
    status: 'RESOLVED',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-indigo-700 to-purple-900',
    citizenName: 'Rohan Verma',
    timeAgo: 'Yesterday',
    description: 'Streetlight pole #14 was flickering continuously. MC team replaced bulb and wire fitting.'
  },
  {
    id: 'feed-4',
    title: 'Water Pipeline Leakage on',
    titleHighlight: 'Main Road',
    category: 'Water Supply',
    location: 'Ward 4 Crossroads',
    distance: '650m away',
    status: 'URGENT',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-blue-600 to-cyan-800',
    citizenName: 'Sunita Devi',
    timeAgo: '1h ago',
    description: 'Clean drinking water leaking continuously from underground municipal valve.'
  },
  {
    id: 'feed-5',
    title: 'Severe Waterlogging at',
    titleHighlight: 'Underpass',
    category: 'Waterlogging',
    location: 'Sector 17 Underpass',
    distance: '1.1km away',
    status: 'PROCESSING',
    imageUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-blue-700 to-slate-900',
    citizenName: 'Vikram Singh',
    timeAgo: '3h ago',
    description: 'Rainwater clogging underpass passage. Motorists facing heavy delay.'
  },
  {
    id: 'feed-6',
    title: 'Open Manhole near',
    titleHighlight: 'Community Park',
    category: 'Public Safety',
    location: 'Sector 12 Park Gate 2',
    distance: '320m away',
    status: 'REPORTED',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    fallbackGradient: 'from-zinc-700 to-red-900',
    citizenName: 'Meera Patel',
    timeAgo: '5h ago',
    description: 'Dangerous open manhole without warning barricade near children park entrance.'
  }
];

interface CivicCommunityFeedProps {
  onOpenGrievanceDetail?: (item: GrievanceItem) => void;
  onOpenLodgeModal?: () => void;
}

export const CivicCommunityFeed: React.FC<CivicCommunityFeedProps> = ({
  onOpenGrievanceDetail,
  onOpenLodgeModal
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Latest' | 'Trending' | 'Resolved'>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('Near You (Sector 12)');
  const [locationDropdownOpen, setLocationDropdownOpen] = useState<boolean>(false);
  const [prioritizedItems, setPrioritizedItems] = useState<Record<string, boolean>>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const togglePrioritize = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPrioritizedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter feed items based on filter tab
  const filteredItems = SAMPLE_FEED_ITEMS.filter(item => {
    if (selectedFilter === 'Latest') return item.timeAgo.includes('h ago') || item.timeAgo.includes('1h');
    if (selectedFilter === 'Trending') return item.status === 'URGENT' || item.status === 'REPORTED';
    if (selectedFilter === 'Resolved') return item.status === 'RESOLVED';
    return true;
  });

  const getStatusBadge = (status: FeedCardItem['status']) => {
    switch (status) {
      case 'REPORTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EF3B35] text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            REPORTED
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F9B51B] text-[#111A35] text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md">
            <Clock className="w-3 h-3 text-[#111A35]" />
            PROCESSING
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2DB45A] text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3 text-white" />
            RESOLVED
          </span>
        );
      case 'URGENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md border border-purple-300/40">
            <Flame className="w-3 h-3 text-amber-300" />
            URGENT
          </span>
        );
    }
  };

  return (
    <section 
      id="civic-community" 
      className="py-10 sm:py-14 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[1536px] w-full mx-auto relative overflow-hidden"
    >
      {/* ATMOSPHERIC BACKGROUND DECORATION */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* SECTION HEADER BLOCK */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10 relative z-10">
        
        {/* LEFT: EYEBROW & TITLE */}
        <div className="space-y-2 max-w-2xl">
          {/* EYEBROW */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F1FF] border border-purple-200/80 text-[#6546D9] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#6546D9]" />
            <span>CIVIC COMMUNITY</span>
          </div>

          {/* MAIN HEADING */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111A35] tracking-tight leading-tight">
            Voices of <span className="text-[#6546D9] italic font-serif font-normal">Your City</span>
          </h2>
        </div>

        {/* RIGHT: CONTROLS (LOCATION SELECTOR & FILTER TABS) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* LOCATION DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="px-3.5 py-2 rounded-full bg-white/90 hover:bg-white border border-purple-200/90 text-[#111A35] text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#6546D9]" />
              <span>{selectedLocation}</span>
              <span className="text-purple-400 text-xs">▾</span>
            </button>

            {locationDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-purple-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {[
                  'Near You (Sector 12)',
                  'Ward 4, Chandigarh',
                  'Sector 17 Market',
                  'Entire City'
                ].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedLocation === loc ? 'bg-purple-50 text-[#6546D9]' : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <Check className="w-3.5 h-3.5 text-[#6546D9]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTER TABS */}
          <div className="bg-[#F4F1FF] p-1 rounded-full border border-purple-100/90 flex items-center gap-1 shadow-2xs">
            {(['All', 'Latest', 'Trending', 'Resolved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFilter(tab)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedFilter === tab
                    ? 'bg-[#6546D9] text-white shadow-xs shadow-purple-600/30'
                    : 'text-[#5D6785] hover:text-[#6546D9] hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* COMPLAINT CARDS FEED */}
      <div 
        ref={scrollContainerRef}
        className="flex lg:grid lg:grid-cols-4 gap-5 overflow-x-auto lg:overflow-visible pb-4 pt-1 snap-x snap-mandatory scrollbar-none transition-all duration-300 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredItems.map((item) => {
          const isPrioritized = prioritizedItems[item.id] || false;

          return (
            <div
              key={item.id}
              className="min-w-[280px] sm:min-w-[300px] lg:min-w-0 flex-shrink-0 lg:flex-shrink snap-start group relative bg-white rounded-[22px] border border-purple-100 hover:border-purple-300 shadow-md shadow-purple-950/5 hover:shadow-xl hover:shadow-purple-900/10 transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden cursor-pointer"
              onClick={() => {
                if (onOpenGrievanceDetail) {
                  onOpenGrievanceDetail({
                    id: item.id,
                    category: item.category,
                    title: `${item.title} ${item.titleHighlight || ''}`,
                    description: item.description || '',
                    location: item.location,
                    ward: 'Ward 4',
                    distance: item.distance,
                    status: item.status === 'URGENT' ? 'Reported' : (item.status === 'PROCESSING' ? 'Processing' : (item.status === 'RESOLVED' ? 'Resolved' : 'Reported')),
                    urgency: item.status === 'URGENT' ? 'Critical' : 'High',
                    submittedDate: item.timeAgo,
                    department: 'Municipal Works',
                    photoUrl: item.imageUrl,
                    upvotes: isPrioritized ? 43 : 42,
                    timeline: [
                      { step: 'Reported by Citizen', date: item.timeAgo, completed: true },
                      { step: 'Assigned to Ward Officer', date: 'In Progress', completed: item.status !== 'REPORTED' }
                    ]
                  });
                }
              }}
            >
              {/* THUMBNAIL IMAGE CONTAINER */}
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-slate-900 shrink-0">
                
                {/* IMAGE WITH ZOOM ON HOVER */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br');
                      item.fallbackGradient.split(' ').filter(Boolean).forEach(cls => parent.classList.add(cls));
                    }
                  }}
                />

                {/* GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* TOP FLOATING STATUS BADGE */}
                <div className="absolute top-3 left-3 z-10">
                  {getStatusBadge(item.status)}
                </div>

                {/* BOTTOM OVERLAY ON IMAGE: DISTANCE & CATEGORY */}
                <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 text-[10.5px]">
                    <MapPin className="w-2.5 h-2.5 text-[#FFD84D]" />
                    {item.distance}
                  </span>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/20">
                    {item.category}
                  </span>
                </div>

              </div>

              {/* CARD BODY */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                
                {/* REPORTER INFO & TIME (EXTREMELY SUBTLE) */}
                <div className="text-[11.5px] font-medium text-zinc-400 tracking-tight">
                  <span className="text-zinc-600 font-semibold">{item.citizenName}</span>
                  <span className="mx-1.5 text-zinc-300">•</span>
                  <span>{item.timeAgo}</span>
                </div>

                {/* COMPLAINT TITLE (PRIMARY HERO TEXT) */}
                <h3 className="font-extrabold text-[#111A35] text-[15px] sm:text-base leading-snug group-hover:text-[#6546D9] transition-colors line-clamp-2">
                  {item.title}{' '}
                  {item.titleHighlight && (
                    <span className="text-[#6546D9] italic font-serif font-normal">
                      {item.titleHighlight}
                    </span>
                  )}
                </h3>

                {/* LOCATION */}
                <div className="text-xs font-medium text-zinc-500 flex items-center gap-1 truncate">
                  <span className="text-zinc-400">📍</span>
                  <span className="truncate">{item.location}</span>
                </div>

                {/* CARD FOOTER: CLEAN ACTION ROW */}
                <div className="pt-3 mt-1 border-t border-purple-50 flex items-center justify-between text-xs">
                  
                  {/* DETAIL ACTION */}
                  <span className="text-[#6546D9] font-bold text-[11.5px] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  {/* PRIORITIZE BUTTON */}
                  <button
                    onClick={(e) => togglePrioritize(e, item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      isPrioritized
                        ? 'bg-[#6546D9] text-white border border-purple-600 shadow-purple-600/20 scale-105'
                        : 'bg-white text-[#6546D9] border border-purple-200 hover:bg-[#6546D9] hover:text-white hover:border-[#6546D9]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 transition-transform ${isPrioritized ? 'fill-amber-300 text-amber-300 scale-110' : ''}`} />
                    <span>{isPrioritized ? 'Prioritized' : 'Prioritize'}</span>
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTION & CAROUSEL NAVIGATION CONTROLS */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-purple-100/60">
        
        {/* CAROUSEL ARROWS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleScrollLeft}
            className="w-9 h-9 rounded-full bg-white border border-purple-200/80 hover:bg-[#F4F1FF] hover:border-purple-300 text-[#111A35] flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-[#6546D9]" />
          </button>
          <button
            onClick={handleScrollRight}
            className="w-9 h-9 rounded-full bg-white border border-purple-200/80 hover:bg-[#F4F1FF] hover:border-purple-300 text-[#111A35] flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-[#6546D9]" />
          </button>
          <span className="text-xs text-zinc-500 font-medium ml-2">
            Swipe or use arrows to view more nearby issues
          </span>
        </div>

        {/* EXPLORE ALL COMPLAINTS PILL BUTTON */}
        <button
          onClick={() => {
            if (onOpenLodgeModal) onOpenLodgeModal();
          }}
          className="px-6 py-3 rounded-full bg-[#6546D9] text-white text-xs sm:text-sm font-bold hover:bg-[#5337C4] shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/30 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer group"
        >
          <span>Explore all complaints</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

    </section>
  );
};
