import { Link } from 'react-router-dom'

import { PublicNavbar } from '@/features/public/components/PublicNavbar'
import { PublicFooter } from '@/features/public/components/PublicFooter'
import { MaterialIcon } from '@/features/public/components/MaterialIcon'
import { PUBLIC_ROUTES } from '@/features/public/constants/routes'

export function LandingPage() {
  return (
    <>
      <PublicNavbar />
      <main className="pt-20">

<section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(97,97,255,0.08),transparent)] -z-10"></div>
<div className="max-w-max-width mx-auto px-gutter-desktop grid lg:grid-cols-2 gap-16 items-center">
<div className="space-y-8">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high text-primary rounded-full font-label-sm">
<span className="material-symbols-outlined text-sm" data-icon="bolt">bolt</span>
                        Next-Gen CMMS Infrastructure
                    </div>
<h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
                        Smarter Facility Maintenance. <span className="text-secondary">Connected Workflows.</span> Faster Resolution.
                    </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                        MaintainPro connects organizations with technicians and vendors in real-time using intelligent job dispatch and location-based matching.
                    </p>
<div className="flex flex-col sm:flex-row gap-4">
<Link to={PUBLIC_ROUTES.SIGNUP_ORG} className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md shadow-lg shadow-primary/20 hover:shadow-xl transition-all">Get Started as an Organization</Link>
<Link to={PUBLIC_ROUTES.SIGNUP} className="border border-outline text-primary px-8 py-4 rounded-lg font-label-md hover:bg-surface-container-low transition-all">Join as Technician / Vendor</Link>
</div>
</div>

<div className="relative">
<div className="glass-card rounded-xl p-4 shadow-2xl overflow-hidden border-border-subtle">
<div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
<div className="flex gap-2">
<div className="w-3 h-3 rounded-full bg-status-danger/20"></div>
<div className="w-3 h-3 rounded-full bg-status-warning/20"></div>
<div className="w-3 h-3 rounded-full bg-status-success/20"></div>
</div>
<div className="font-label-sm text-outline">Work Order Dispatcher</div>
</div>
<div className="grid grid-cols-3 gap-4 mb-6">
<div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle">
<div className="text-outline font-label-sm">Active Jobs</div>
<div className="text-headline-md font-headline-md text-primary">124</div>
</div>
<div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle">
<div className="text-outline font-label-sm">Technicians Near</div>
<div className="text-headline-md font-headline-md text-secondary">18</div>
</div>
<div className="bg-surface-subtle p-3 rounded-lg border border-border-subtle">
<div className="text-outline font-label-sm">SLA Health</div>
<div className="text-headline-md font-headline-md text-status-success">98%</div>
</div>
</div>
<div className="rounded-lg h-64 overflow-hidden relative">
<img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv3wN3UUc1uTN6C0KcJs06rwdiuOji33fEx1tGXc7lO5ieJmbmfFvpK-dPAG7kskr-uKYrZgtkMeiciL5NJF45DY7hZlB34iebyEBs-DDmPZy1fWQuLNggdYwDMdlaju8YBSi1ap6z3NruWhvbFypELikDawRW_61lCiXeVc_eFqgGgijVMhw_gVjFEqIOyhdC4pfEXZ8N4cW2__l1rMd22OnXlt5UC0Hmd0f2OQEdcnJUVenV3w0XEvqJIKeSXwZvZ9NM9i-Mjec" alt="" />
<div className="absolute inset-0 bg-primary/10"></div>
<div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow-sm border border-border-subtle flex flex-col gap-2">
<div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
<div className="w-2 h-2 rounded-full bg-secondary"></div>
</div>
</div>
</div>

<div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
<div className="w-10 h-10 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
<span className="material-symbols-outlined" data-icon="check_circle">check_circle</span>
</div>
<div>
<div className="font-label-md">Match Found</div>
<div className="font-label-sm text-outline">Lead Tech: John D.</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-24 bg-surface-subtle" id="features">
<div className="max-w-max-width mx-auto px-gutter-desktop">
<div className="text-center mb-16">
<h2 className="font-headline-xl text-headline-xl mb-4">Powerful Enterprise Toolkit</h2>
<p className="text-on-surface-variant max-w-2xl mx-auto font-body-lg">
                        Our platform is designed to handle the complexities of large-scale facilities management with ease.
                    </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="md:col-span-2 glass-card p-8 rounded-2xl border border-border-subtle hover:border-primary/30 transition-all group">
<span className="material-symbols-outlined text-4xl text-primary mb-6" data-icon="assignment">assignment</span>
<h3 className="font-headline-md text-headline-md mb-2">Work Order Management</h3>
<p className="text-on-surface-variant">Centralized hub for tracking every ticket from inception to sign-off. Automated status updates keep all stakeholders informed without manual entry.</p>
</div>
<div className="glass-card p-8 rounded-2xl border border-border-subtle hover:border-primary/30 transition-all group">
<span className="material-symbols-outlined text-4xl text-secondary mb-6" data-icon="bolt">bolt</span>
<h3 className="font-headline-md text-headline-md mb-2">Real-Time Dispatch</h3>
<p className="text-on-surface-variant">Instant notifications to the right technicians as soon as a request is logged.</p>
</div>
<div className="glass-card p-8 rounded-2xl border border-border-subtle hover:border-primary/30 transition-all group">
<span className="material-symbols-outlined text-4xl text-status-success mb-6" data-icon="location_on">location_on</span>
<h3 className="font-headline-md text-headline-md mb-2">Location Matching</h3>
<p className="text-on-surface-variant">Smart routing finds the closest qualified vendor to minimize downtime and travel costs.</p>
</div>
<div className="md:col-span-2 glass-card p-8 rounded-2xl border border-border-subtle hover:border-primary/30 transition-all group">
<span className="material-symbols-outlined text-4xl text-primary-container mb-6" data-icon="groups">groups</span>
<h3 className="font-headline-md text-headline-md mb-2">Multi-Role System</h3>
<p className="text-on-surface-variant">Dedicated dashboards for facility managers, independent technicians, and vendor organizations, ensuring everyone sees exactly what they need.</p>
</div>
</div>
</div>
</section>

<section className="py-24" id="how-it-works">
<div className="max-w-max-width mx-auto px-gutter-desktop">
<div className="text-center mb-16">
<h2 className="font-headline-xl text-headline-xl mb-4">Three Steps to Resolution</h2>
</div>
<div className="relative">
<div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-border-subtle -z-10"></div>
<div className="grid md:grid-cols-3 gap-12">
<div className="bg-white p-8 rounded-2xl text-center space-y-4 border border-border-subtle relative">
<div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold absolute -top-6 left-1/2 -translate-x-1/2">1</div>
<span className="material-symbols-outlined text-5xl text-primary" data-icon="edit_document">edit_document</span>
<h4 className="font-headline-md text-headline-md">Create Request</h4>
<p className="text-on-surface-variant">Input asset details and priority levels via mobile or desktop app.</p>
</div>
<div className="bg-white p-8 rounded-2xl text-center space-y-4 border border-border-subtle relative">
<div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold absolute -top-6 left-1/2 -translate-x-1/2">2</div>
<span className="material-symbols-outlined text-5xl text-primary" data-icon="near_me">near_me</span>
<h4 className="font-headline-md text-headline-md">Match Technician</h4>
<p className="text-on-surface-variant">AI matches skills and proximity to find the best provider in minutes.</p>
</div>
<div className="bg-white p-8 rounded-2xl text-center space-y-4 border border-border-subtle relative">
<div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold absolute -top-6 left-1/2 -translate-x-1/2">3</div>
<span className="material-symbols-outlined text-5xl text-primary" data-icon="task_alt">task_alt</span>
<h4 className="font-headline-md text-headline-md">Complete Job</h4>
<p className="text-on-surface-variant">Verify completion with photos, digital signatures, and instant invoices.</p>
</div>
</div>
</div>
</div>
</section>

<section className="py-24 bg-primary text-on-primary">
<div className="max-w-max-width mx-auto px-gutter-desktop grid md:grid-cols-2 gap-px bg-primary-container/20 overflow-hidden rounded-3xl border border-primary-container">
<div className="p-12 lg:p-20 flex flex-col justify-center space-y-6">
<h2 className="font-headline-xl text-headline-xl">For Organizations</h2>
<p className="text-primary-fixed text-body-lg">Maintain assets with surgical precision. Reduce overhead, eliminate paper logs, and get 24/7 visibility into your facility health.</p>
<ul className="space-y-3">
<li className="flex items-center gap-3"><span className="material-symbols-outlined text-status-success" data-icon="check_circle">check_circle</span> Asset Lifecycle Tracking</li>
<li className="flex items-center gap-3"><span className="material-symbols-outlined text-status-success" data-icon="check_circle">check_circle</span> Automated Reporting</li>
<li className="flex items-center gap-3"><span className="material-symbols-outlined text-status-success" data-icon="check_circle">check_circle</span> Cost Management & Invoicing</li>
</ul>
<Link to={PUBLIC_ROUTES.SIGNUP_ORG} className="bg-white text-primary px-8 py-4 rounded-lg font-label-md w-fit hover:bg-primary-fixed transition-colors">Start Organizing</Link>
</div>
<div className="p-12 lg:p-20 flex flex-col justify-center space-y-6 bg-primary-container">
<h2 className="font-headline-xl text-headline-xl">For Technicians & Vendors</h2>
<p className="text-primary-fixed text-body-lg">Grow your business with a steady stream of local maintenance jobs. Manage your team and payments in one place.</p>
<ul className="space-y-3">
<li className="flex items-center gap-3"><span className="material-symbols-outlined text-status-success" data-icon="check_circle">check_circle</span> Flexible Job Marketplace</li>
<li className="flex items-center gap-3"><span className="material-symbols-outlined text-status-success" data-icon="check_circle">check_circle</span> Faster Payment Cycles</li>
<li className="flex items-center gap-3"><span className="material-symbols-outlined text-status-success" data-icon="check_circle">check_circle</span> Route Optimization</li>
</ul>
<Link to={PUBLIC_ROUTES.SIGNUP} className="bg-secondary text-on-primary px-8 py-4 rounded-lg font-label-md w-fit hover:opacity-90 transition-colors">Apply to Join</Link>
</div>
</div>
</section>

<section className="py-24" id="pricing">
<div className="max-w-max-width mx-auto px-gutter-desktop">
<div className="text-center mb-16">
<h2 className="font-headline-xl text-headline-xl mb-4">Scalable Pricing for Every Scale</h2>
</div>
<div className="grid md:grid-cols-3 gap-8">

<div className="bg-white border border-border-subtle p-8 rounded-2xl hover:border-primary transition-colors flex flex-col">
<div className="font-label-md text-outline mb-4">STARTER</div>
<div className="text-headline-xl font-headline-xl mb-6">$49<span className="text-body-md font-normal text-on-surface-variant">/mo</span></div>
<p className="text-on-surface-variant mb-8 font-body-md">Ideal for small facilities with under 50 assets.</p>
<ul className="space-y-4 mb-12 flex-grow">
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> 50 Asset Limit</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Standard Dispatch</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Mobile App Access</li>
</ul>
<Link to={PUBLIC_ROUTES.SIGNUP_ORG} className="block w-full rounded-lg border border-primary py-3 text-center font-label-md text-primary transition-all hover:bg-surface-container-low">Choose Starter</Link>
</div>

<div className="bg-white border-2 border-primary p-8 rounded-2xl shadow-xl flex flex-col relative scale-105 z-10">
<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
<div className="font-label-md text-primary mb-4">BUSINESS</div>
<div className="text-headline-xl font-headline-xl mb-6">$199<span className="text-body-md font-normal text-on-surface-variant">/mo</span></div>
<p className="text-on-surface-variant mb-8 font-body-md">Perfect for multi-site organizations and growing vendors.</p>
<ul className="space-y-4 mb-12 flex-grow">
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Unlimited Assets</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Location Matching</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Advanced Analytics</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> SLA Tracking</li>
</ul>
<Link to={PUBLIC_ROUTES.SIGNUP_ORG} className="block w-full rounded-lg bg-primary py-3 text-center font-label-md text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90">Choose Business</Link>
</div>

<div className="bg-white border border-border-subtle p-8 rounded-2xl hover:border-primary transition-colors flex flex-col">
<div className="font-label-md text-outline mb-4">ENTERPRISE</div>
<div className="text-headline-xl font-headline-xl mb-6">Custom</div>
<p className="text-on-surface-variant mb-8 font-body-md">Bespoke solutions for national portfolios and large enterprises.</p>
<ul className="space-y-4 mb-12 flex-grow">
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Dedicated Support</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> API Access</li>
<li className="flex items-center gap-3 font-body-md"><span className="material-symbols-outlined text-primary text-lg" data-icon="done">done</span> Custom Integrations</li>
</ul>
<Link to={PUBLIC_ROUTES.CONTACT} className="block w-full rounded-lg border border-primary py-3 text-center font-label-md text-primary transition-all hover:bg-surface-container-low">Contact Sales</Link>
</div>
</div>
</div>
</section>

<section className="py-24">
<div className="max-w-4xl mx-auto px-gutter-desktop text-center">
<div className="bg-surface-container-high rounded-[2rem] p-12 lg:p-20 relative overflow-hidden border border-border-subtle">
<div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32"></div>
<div className="relative z-10">
<h2 className="font-headline-xl text-headline-xl mb-6">Transform Your Facility Operations Today</h2>
<p className="text-on-surface-variant text-body-lg mb-10 max-w-xl mx-auto">
                            Join over 5,000 organizations and technicians who trust MaintainPro for their critical infrastructure needs.
                        </p>
<div className="flex flex-col sm:flex-row gap-4 justify-center">
<Link to={PUBLIC_ROUTES.SIGNUP} className="bg-primary text-on-primary px-10 py-5 rounded-xl font-label-md hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">Get Started Now</Link>
<Link to={PUBLIC_ROUTES.CONTACT} className="bg-white text-on-surface px-10 py-5 rounded-xl font-label-md border border-border-subtle hover:bg-surface-subtle transition-all">Request a Demo</Link>
</div>
</div>
</div>
</div>
</section>
</main>
      <PublicFooter variant="landing" />
      
      <Link
        to={PUBLIC_ROUTES.CONTACT}
        className="group fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-on-primary shadow-2xl transition-all hover:scale-110 active:scale-95"
        aria-label="Contact Support"
      >
        <MaterialIcon name="support_agent" className="text-3xl" />
        <span className="absolute right-full mr-4 whitespace-nowrap rounded bg-on-surface px-3 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
          Contact Support
        </span>
      </Link>
    </>
  )
}
