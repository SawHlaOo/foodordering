import { Link } from 'react-router-dom';

type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

export const socialLinks: SocialLink[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/MY_INSTAGRAM_URL', icon: '◎' },
  { name: 'Facebook', url: 'https://www.facebook.com/MY_FACEBOOK_URL', icon: 'f' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@MY_TIKTOK_URL', icon: '♪' },
  { name: 'Telegram', url: 'https://t.me/MY_TELEGRAM_URL', icon: '➤' }
];

export const HomeFooter = () => (
  <footer className="border-t border-slate-200 pt-8 text-sm text-slate-500">
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
      <div>
        <p className="text-lg font-extrabold text-brand-600">Your Choice</p>
        <p className="mt-2">Fresh <span aria-hidden="true">•</span> Healthy <span aria-hidden="true">•</span> Delicious</p>
      </div>

      <div>
        <h2 className="font-bold text-slate-700">Follow us</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${social.name}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-600" aria-hidden="true">{social.icon}</span>
              {social.name}
            </a>
          ))}
        </div>
      </div>

      <nav aria-label="Footer navigation">
        <h2 className="font-bold text-slate-700">Explore</h2>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <Link to="/" className="transition hover:text-brand-700 focus:outline-none focus-visible:underline">Home</Link>
          <Link to="/menu" className="transition hover:text-brand-700 focus:outline-none focus-visible:underline">Menu</Link>
          <a href="#about" className="transition hover:text-brand-700 focus:outline-none focus-visible:underline">About</a>
          <a href="#contact" className="transition hover:text-brand-700 focus:outline-none focus-visible:underline">Contact</a>
        </div>
      </nav>
    </div>

  </footer>
);