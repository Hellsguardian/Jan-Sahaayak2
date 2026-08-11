import React, { useState } from 'react';
import { PROBLEM_CATEGORIES } from '../data/civicData';
import { GrievanceItem, UrgencyLevel } from '../types';
import { 
  X, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface LodgeGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewGrievance: (newGrievance: GrievanceItem) => void;
  preFillData?: {
    category?: string;
    description?: string;
    suggestedTitle?: string;
    urgency?: UrgencyLevel;
  };
}

export const LodgeGrievanceModal: React.FC<LodgeGrievanceModalProps> = ({
  isOpen,
  onClose,
  onSubmitNewGrievance,
  preFillData
}) => {
  const [selectedCategory, setSelectedCategory] = useState(preFillData?.category || 'Pothole');
  const [title, setTitle] = useState(preFillData?.suggestedTitle || '');
  const [description, setDescription] = useState(preFillData?.description || '');
  const [location, setLocation] = useState('Block C, Sector 12, Civil Lines Ward');
  const [urgency, setUrgency] = useState<UrgencyLevel>(preFillData?.urgency || 'Medium');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newId = `GRV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const newGrievanceItem: GrievanceItem = {
        id: newId,
        category: selectedCategory,
        title: title || `${selectedCategory} Issue Reported`,
        description: description || 'Citizen submitted issue details.',
        location: location,
        ward: 'Ward 14 - Civil Lines',
        status: 'Reported',
        urgency: urgency,
        submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        expectedDate: '3-4 business days',
        assignedOfficer: 'Queued for Ward Inspection',
        department: 'Municipal Public Works Board',
        photoUrl: photoPreview || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
        upvotes: 1,
        timeline: [
          { step: 'Grievance Registered', date: 'Just now', completed: true, note: 'Assigned unique tracking code' },
          { step: 'Department Verification', date: 'Pending', completed: false },
          { step: 'Inspection & Repair', date: 'Pending', completed: false },
          { step: 'Resolution Verified', date: 'Pending', completed: false }
        ]
      };

      onSubmitNewGrievance(newGrievanceItem);
      setIsSubmitting(false);
      setSubmittedSuccess(newId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[32px] border-4 border-[#EEE9FF] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#F7F5FF] text-zinc-500 hover:text-[#171717] hover:bg-[#EEE9FF]"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#35B96B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-[#171717]">Grievance Lodged Successfully!</h3>
            
            <div className="bg-[#F7F5FF] p-4 rounded-2xl border border-[#EEE9FF] max-w-md mx-auto">
              <p className="text-xs font-bold text-zinc-500 uppercase">Your Tracking Code:</p>
              <p className="text-2xl font-black text-[#6546D9] font-mono mt-1">{submittedSuccess}</p>
            </div>

            <p className="text-xs text-zinc-600 font-medium max-w-md mx-auto">
              Your report has been logged and forwarded to Ward 14 Municipal Engineer. You can track real-time progress under 'Your Grievances'.
            </p>

            <button
              onClick={onClose}
              className="bg-[#6546D9] text-white font-extrabold text-sm px-8 py-3 rounded-2xl shadow-md"
            >
              Done & View Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* MODAL HEADER */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE9FF] text-[#6546D9] font-black text-[11px] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD84D]" />
                <span>NEW GRIEVANCE REPORT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">Lodge a Public Grievance</h2>
              <p className="text-xs text-zinc-500 font-medium mt-1">Select issue category, add location & photo to initiate municipal repair.</p>
            </div>

            {/* CATEGORY SELECTOR GRID */}
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
                Select Problem Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROBLEM_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.title)}
                    className={`p-2.5 rounded-2xl text-left border-2 text-xs font-extrabold transition-all ${
                      selectedCategory === cat.title
                        ? 'bg-[#6546D9] text-white border-[#6546D9] shadow-md'
                        : 'bg-white text-zinc-700 border-[#EEE9FF] hover:border-[#DCD1FF]'
                    }`}
                  >
                    {cat.title}
                  </button>
                ))}
              </div>
            </div>

            {/* ISSUE TITLE & DESCRIPTION */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                  Issue Summary Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep pothole causing heavy traffic jam"
                  className="w-full p-3 rounded-2xl bg-[#F8F6FF] border-2 border-[#EEE9FF] text-xs font-semibold focus:outline-none focus:border-[#6546D9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                  Detailed Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the exact issue location, duration and severity..."
                  className="w-full p-3 rounded-2xl bg-[#F8F6FF] border-2 border-[#EEE9FF] text-xs font-semibold focus:outline-none focus:border-[#6546D9] resize-none"
                />
              </div>
            </div>

            {/* LOCATION & URGENCY ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                  Location / Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#F8F6FF] border-2 border-[#EEE9FF] text-xs font-semibold focus:outline-none focus:border-[#6546D9]"
                  />
                  <MapPin className="w-4 h-4 text-[#6546D9] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                  Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Low', 'Medium', 'Critical'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setUrgency(lvl as UrgencyLevel)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        urgency === lvl
                          ? lvl === 'Critical' ? 'bg-red-500 text-white border-red-500' : 'bg-[#6546D9] text-white border-[#6546D9]'
                          : 'bg-[#F8F6FF] text-zinc-700 border-[#EEE9FF]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PHOTO ATTACHMENT DROPZONE */}
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                Attach Photo Evidence (Optional)
              </label>
              
              <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-[#DCD1FF] bg-[#F7F5FF] hover:bg-[#EEE9FF] cursor-pointer transition-colors">
                <Camera className="w-6 h-6 text-[#6546D9] mb-1" />
                <span className="text-xs font-bold text-[#6546D9]">Click to upload image or drop photo here</span>
                <span className="text-[10px] text-zinc-400 font-medium">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photoPreview && (
                <div className="mt-2 flex items-center gap-3 bg-[#EEE9FF] p-2 rounded-xl">
                  <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-xs font-bold text-emerald-700">Photo attached successfully</span>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#6546D9] hover:bg-[#5234c2] text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg shadow-purple-600/25 transition-all"
            >
              {isSubmitting ? (
                <span>Generating Grievance Ticket...</span>
              ) : (
                <>
                  <span>Submit Grievance to Ward Office</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD84D]" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
