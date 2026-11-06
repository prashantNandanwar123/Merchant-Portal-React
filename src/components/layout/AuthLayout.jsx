import { Outlet } from "react-router-dom";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";
import logo from "../../assets/logo-white.png";
import hero from "../../assets/hero.jpg";

const perks = [
  { icon: ShieldCheck, title: "Secure transactions", text: "Bank-level encrypted payment infrastructure." },
  { icon: Zap, title: "Fast settlement", text: "Receive your payments quickly and securely." },
  { icon: BarChart3, title: "Analytics", text: "Smart reports to grow your business." },
];

// Brand panel (large screens) + scrolling form area. Used by every logged-out screen.
export default function AuthLayout() {
  return (
    <main className="min-h-dvh bg-slate-100 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section className="relative hidden overflow-hidden bg-sidebar text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:p-10">
        <img src={hero} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar via-sidebar/70 to-sidebar" />

        <div className="relative">
          <img src={logo} alt="HelloPe" className="-ml-6 h-24 w-auto object-contain" />
          <h2 className="mt-2 text-3xl font-extrabold leading-tight">
            Manage your business payments <span className="text-brand">effortlessly</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            Secure platform for merchants with lightning-fast settlements and a powerful dashboard.
          </p>
        </div>

        <ul className="relative space-y-3">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-brand">
                <Icon size={19} />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-0.5 text-xs text-slate-300">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-8">
        <div className="mb-6 grid place-items-center rounded-2xl bg-sidebar px-4 shadow-md lg:hidden">
          <img src={logo} alt="HelloPe" className="h-16 w-auto object-contain" />
        </div>
        <Outlet />
      </section>
    </main>
  );
}
