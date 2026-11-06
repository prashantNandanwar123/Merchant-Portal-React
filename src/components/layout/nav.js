import {
  BarChart3, Bitcoin, BookOpen, CircleUser, FileText, Globe2, Key, LayoutDashboard, Link2,
  Settings, ShieldCheck, Store, Webhook,
} from "lucide-react";

export const merchantNav = {
  portal: "Merchant Portal",
  profilePath: "/app/profile",
  items: [
    { section: "Main" },
    { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/app/paymentlinks", label: "Payment Links", icon: Link2 },
    { to: "/app/reports", label: "Reports", icon: BarChart3 },
    {
      label: "Crypto Management",
      icon: Bitcoin,
      children: [
        { to: "/app/crypto-dashboard", label: "Dashboard", title: "Crypto Dashboard", icon: LayoutDashboard },
        { to: "/app/crypto-reports", label: "Reports", title: "Crypto Reports", icon: BarChart3 },
      ],
    },
    { section: "Manage" },
    {
      label: "Settings",
      icon: Settings,
      children: [
        { to: "/app/api-keys", label: "API Keys", icon: Key },
        { to: "/app/webhooks", label: "Webhooks", icon: Webhook },
        { to: "/app/ip-Whishlist", label: "IP Whitelist", icon: ShieldCheck },
        { to: "/app/profile", label: "Profile", icon: CircleUser },
        { to: "/app/apidoc", label: "API Docs", icon: BookOpen },
      ],
    },
  ],
};

export const resellerNav = {
  portal: "Reseller Portal",
  profilePath: "/reseller/reProfile",
  items: [
    { section: "Main" },
    { to: "/reseller/reDashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/reseller/merchants", label: "Merchants", icon: Store },
    { to: "/reseller/reReport", label: "Reports", icon: FileText },
    { to: "/reseller/api-docs", label: "API Docs", icon: Globe2 },
  ],
};

// path (lower-case) -> page title. Built from the nav so titles can never drift
// (the old Navbar looked up "/app/paymentlinks" but the link was "/app/PaymentLinks").
export const titleFor = (nav, pathname) => {
  const flat = nav.items.flatMap((i) => (i.children ? i.children : i.to ? [i] : []));
  const hit = flat.find((i) => i.to.toLowerCase() === pathname.toLowerCase());
  const extra = { "/reseller": "Dashboard", "/reseller/": "Dashboard" };
  return hit?.title || hit?.label || extra[pathname] || "Dashboard";
};
