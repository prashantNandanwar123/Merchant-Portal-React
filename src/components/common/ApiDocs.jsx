import { BookOpen, Download, FileText, LifeBuoy, Rocket } from "lucide-react";
import PageHeader from "./PageHeader";
import Panel from "./Panel";

// Shared by the merchant and the reseller portal.
export default function ApiDocs() {
  return (
    <>
      <PageHeader
        title="HelloPe Payment Gateway API"
        subtitle="Integrate HelloPe's payment processing into your application."
      />

      <Panel title="API overview" icon={BookOpen}>
        <div className="space-y-3 text-sm leading-6 text-slate-700">
          <p>
            HelloPe Payment Gateway provides a robust set of REST APIs that enable businesses to securely
            accept, process, and manage online payments.
          </p>
          <p>
            Whether you&apos;re processing one-time payments, recurring billing, subscription payments, or
            handling complex payment workflows, HelloPe offers all the tools you need to get started quickly.
          </p>
        </div>
      </Panel>

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-600">Production</h3>
          <p className="mb-5 text-sm leading-6 text-slate-700">
            Use this endpoint when you&apos;re ready to process live transactions. All requests interact with
            your live account and real funds will be involved.
          </p>
          <div className="break-all rounded-lg bg-slate-100 px-4 py-3 font-mono text-xs text-slate-800 sm:text-sm">
            Base URL: https://pay.hellope.co.in/
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-600">Integration doc</h3>
          <p className="mb-5 text-sm leading-6 text-slate-700">
            The integration guide to connect your application with our payment APIs: endpoints, request
            parameters, authentication details and response formats.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 px-4 py-2.5">
            <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-slate-800 sm:text-sm">
              <FileText size={16} className="shrink-0 text-red-500" />
              <span className="truncate">integration-doc.pdf</span>
            </span>
            <a
              href="/files/integration-doc.pdf"
              download
              title="Download integration doc"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-bold text-neutral-900 transition hover:bg-brand-dark"
            >
              <Download size={15} /> Download
            </a>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-sky-900">
          <LifeBuoy size={20} /> Need help?
        </h2>
        <p className="mb-4 text-sm leading-6 text-slate-700">
          Our developer support team is here to assist you with API integration, testing, production
          onboarding, and troubleshooting.
        </p>
        <a href="mailto:support@hellope.co.in" className="font-semibold text-sky-700 hover:underline">
          support@hellope.co.in
        </a>
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-700">
          <Rocket size={16} className="mt-0.5 shrink-0" />
          <span>
            <b>Integration support:</b> sandbox setup, production onboarding, webhooks, API troubleshooting and
            payment gateway assistance.
          </span>
        </p>
      </section>
    </>
  );
}
