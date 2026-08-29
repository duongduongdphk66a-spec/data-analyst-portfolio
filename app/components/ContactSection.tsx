'use client';

import React from 'react';
import { Mail, Github, Linkedin, ArrowUpRight, Download } from 'lucide-react';
import { ProfileData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { trackVisitorAction } from '../lib/visitorTracking';
import { sanitizeUrl } from '../lib/security';

interface ContactSectionProps {
  profile: ProfileData;
}

export default function ContactSection({ profile }: ContactSectionProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const handleEmailClick = () => {
    trackVisitorAction('Contact: Email click', 'email', 'contact');
  };

  const handleSocialClick = (platform: string) => {
    trackVisitorAction(`Contact: ${platform} click`, platform, 'contact');
  };

  const handleDownloadCV = () => {
    trackVisitorAction('Contact: Download CV', 'CV Download', 'download');
    window.open('/website.pdf', '_blank');
  };

  const email = profile.email || 'mavanhung.da@gmail.com';

  return (
    <section id="contact" className="section-alt py-20 md:py-28 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">

          <p className="text-xs font-heading font-semibold uppercase tracking-[0.15em] text-ink-muted mb-3">
            {isEn ? 'Contact' : 'Liên hệ'}
          </p>

          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-ink dark:text-white mb-5 leading-tight">
            {isEn
              ? "Let's turn data into decisions."
              : 'Cùng biến dữ liệu thành quyết định.'}
          </h2>

          <p className="text-base text-ink-secondary dark:text-slate-300 mb-10 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            {isEn
              ? "I'm open to Data Analyst internships, freelance analytics projects, and research collaborations. Reach out and let's discuss how data can drive your next strategic move."
              : 'Tôi sẵn sàng cho vị trí Intern Data Analyst, dự án freelance phân tích dữ liệu, và hợp tác nghiên cứu. Hãy liên hệ để cùng thảo luận cách dữ liệu có thể thúc đẩy chiến lược tiếp theo của bạn.'}
          </p>

          {/* Contact links */}
          <div className="space-y-4 mb-10">
            {/* Email */}
            <a
              href={`mailto:${email}`}
              onClick={handleEmailClick}
              className="group flex items-center gap-3 text-ink dark:text-slate-200 hover:text-accent-deep dark:hover:text-amber-400 transition-colors duration-200"
            >
              <span className="w-10 h-10 rounded-lg bg-ground border border-border-subtle dark:bg-slate-900 dark:border-slate-700 flex items-center justify-center group-hover:border-accent dark:group-hover:border-amber-400 transition-colors duration-200 shadow-xs">
                <Mail className="w-4 h-4 text-ink-muted dark:text-slate-400 group-hover:text-accent-deep dark:group-hover:text-amber-400 transition-colors" />
              </span>
              <span className="text-sm font-heading font-medium">{email}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* LinkedIn */}
            {profile.linkedin && (
              <a
                href={sanitizeUrl(profile.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('LinkedIn')}
                className="group flex items-center gap-3 text-ink dark:text-slate-200 hover:text-accent-deep dark:hover:text-amber-400 transition-colors duration-200"
              >
                <span className="w-10 h-10 rounded-lg bg-ground border border-border-subtle dark:bg-slate-900 dark:border-slate-700 flex items-center justify-center group-hover:border-accent dark:group-hover:border-amber-400 transition-colors duration-200 shadow-xs">
                  <Linkedin className="w-4 h-4 text-ink-muted dark:text-slate-400 group-hover:text-accent-deep dark:group-hover:text-amber-400 transition-colors" />
                </span>
                <span className="text-sm font-heading font-medium">LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {/* GitHub */}
            {profile.github && (
              <a
                href={sanitizeUrl(profile.github)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSocialClick('GitHub')}
                className="group flex items-center gap-3 text-ink dark:text-slate-200 hover:text-accent-deep dark:hover:text-amber-400 transition-colors duration-200"
              >
                <span className="w-10 h-10 rounded-lg bg-ground border border-border-subtle dark:bg-slate-900 dark:border-slate-700 flex items-center justify-center group-hover:border-accent dark:group-hover:border-amber-400 transition-colors duration-200 shadow-xs">
                  <Github className="w-4 h-4 text-ink-muted dark:text-slate-400 group-hover:text-accent-deep dark:group-hover:text-amber-400 transition-colors" />
                </span>
                <span className="text-sm font-heading font-medium">GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-muted dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleDownloadCV}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-accent hover:bg-accent-deep dark:bg-amber-400 dark:hover:bg-amber-300 text-slate-950 font-heading font-semibold text-sm rounded-lg transition-colors duration-200 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            {isEn ? 'Download Full CV (PDF)' : 'Tải CV đầy đủ (PDF)'}
          </button>
        </div>
      </div>
    </section>
  );
}
