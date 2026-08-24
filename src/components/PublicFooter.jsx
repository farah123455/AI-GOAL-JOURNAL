import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[#190D0F] py-12 px-6">
      <div className="mx-auto max-w-[1250px]">
        <div className="grid gap-8 md:grid-cols-4 pb-8 border-b border-border">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy shadow-card">
                <Target size={18} className="text-cream" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-cream">
                  GOAL JOURNAL
                </p>
                <p className="text-[9px] uppercase tracking-[0.18em] text-beige/70">
                  Growth workspace
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-beige/60 max-w-sm leading-relaxed">
              An intelligent personal reflection and goal-tracking platform. Turns conversational text and voice reflections into structured momentum, actionable blockers, and weekly accountability coaching.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream mb-3">Product</h4>
            <ul className="flex flex-col gap-2 text-xs text-beige/60">
              <li><a href="#features" className="hover:text-cream transition">Voice Reflection</a></li>
              <li><a href="#features" className="hover:text-cream transition">Gemini AI Structuring</a></li>
              <li><a href="#features" className="hover:text-cream transition">Goal Progress Engine</a></li>
              <li><a href="#features" className="hover:text-cream transition">Accountability Coach</a></li>
            </ul>
          </div>

          {/* Quick Access Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream mb-3">Account</h4>
            <ul className="flex flex-col gap-2 text-xs text-beige/60">
              <li><Link to="/login" className="hover:text-cream transition">Sign In to Workspace</Link></li>
              <li><Link to="/register" className="hover:text-cream transition">Create Free Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-beige/50">
          <p>© {new Date().getFullYear()} AI Goal Journal & Accountability Coach. All rights reserved.</p>
          <p className="italic text-cream font-medium">Powered by Google Gemini & faster-whisper.</p>
        </div>
      </div>
    </footer>
  );
}
