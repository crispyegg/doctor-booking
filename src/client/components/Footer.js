import Link from "next/link";

// Contact details below are placeholders, replace them with the real clinic details
export default function Footer() {
  return (
    <footer className="mt-10 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand">+</span>
            CareSlot
          </p>
          <p className="mt-3 text-sm">Book the right doctor in a minute. Pick a treatment, choose a doctor, confirm a time.</p>
        </div>

        <div>
          <p className="font-bold text-white">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/book" className="hover:text-white">Book appointment</Link></li>
            <li><Link href="/#treatments" className="hover:text-white">Treatments</Link></li>
            <li><Link href="/#about" className="hover:text-white">About</Link></li>
            <li><Link href="/admin/login" className="hover:text-white">Admin login</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-bold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>care@careslot.example</li>
            <li>+91 00000 00000</li>
            <li>Mon to Sat, 10:00 AM to 6:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} CareSlot. All rights reserved.
      </div>
    </footer>
  );
}
