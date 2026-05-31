import { Link } from "react-router-dom";

import { PublicNavbar } from "@/features/public/components/PublicNavbar";
import { PublicFooter } from "@/features/public/components/PublicFooter";
import { MaterialIcon } from "@/features/public/components/MaterialIcon";
import { PUBLIC_ROUTES } from "@/features/public/constants/routes";

export function FeaturesPage() {
  return (
    <>
      <PublicNavbar activeItem="features" />
      <main className="pt-32 pb-24 px-gutter-mobile md:px-gutter-desktop max-w-max-width mx-auto">
        <section className="mb-24 text-center">
          <h1 className="font-headline-xl text-headline-xl text-primary mb-6">
            Connected Maintenance Workflows
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            MaintainPro synchronizes every stakeholder in your facility
            ecosystem, from request to resolution, ensuring zero data silos and
            maximum operational uptime.
          </p>
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-border-subtle shadow-lg">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv4ayuUPmMyKx64TETejWFzokHtmcIvwkN9P85OG-69SXflb9F3u4Kd2TKmcZKVeQFfNxQMC10yJZ_2Mhz6YyfCIuuKVMtZ3V0Ytw6eOqDhwENR83y4D16iBgapYzW-BUAD9GQaSaz3rdAZ5RZPT6fZ44KOrdVo3KhrwSqXUQpWqsysbtNXtykkq_wzuidzP3ihgCEw_LimrUYEwCpaBOEn_quiR5MYbK_shxDCq0tSZ7cyWaS47NjJwCzZvcyz625YBiHQ3_8MMs"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
          </div>
        </section>

        <section className="mb-32">
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-primary-container text-on-primary-container p-2 rounded-lg material-symbols-outlined">
              published_with_changes
            </span>
            <h2 className="font-headline-lg text-headline-lg">
              Work Order Lifecycle
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-bg border border-border-subtle p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-surface-container-highest font-bold text-4xl opacity-40">
                01
              </div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                add_task
              </span>
              <h3 className="font-headline-md text-headline-md mb-2">
                Submission
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Intelligent intake via mobile app, IoT sensors, or QR codes.
                Auto-categorizes based on asset history.
              </p>
            </div>

            <div className="bg-surface-bg border border-border-subtle p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-surface-container-highest font-bold text-4xl opacity-40">
                02
              </div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                dynamic_feed
              </span>
              <h3 className="font-headline-md text-headline-md mb-2">
                Triage & Routing
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Automated logic matches priority levels with required
                certifications and internal availability.
              </p>
            </div>

            <div className="bg-surface-bg border border-border-subtle p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-surface-container-highest font-bold text-4xl opacity-40">
                03
              </div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                construction
              </span>
              <h3 className="font-headline-md text-headline-md mb-2">
                Execution
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Real-time checklist tracking, photo documentation, and digital
                signature sign-off on-site.
              </p>
            </div>

            <div className="bg-surface-bg border border-border-subtle p-6 rounded-xl hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-surface-container-highest font-bold text-4xl opacity-40">
                04
              </div>
              <span className="material-symbols-outlined text-primary mb-4 text-3xl">
                analytics
              </span>
              <h3 className="font-headline-md text-headline-md mb-2">
                Verification
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Post-completion audit and auto-update of asset life-cycle
                analytics and compliance logs.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-primary-container text-on-primary-container p-2 rounded-lg material-symbols-outlined">
                  dashboard_customize
                </span>
                <h2 className="font-headline-lg text-headline-lg">
                  Role-Specific Intelligence
                </h2>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                Stop drowning in irrelevant data. MaintainPro delivers
                customized views tailored to the specific needs of each user
                tier.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container-low transition-colors group">
                  <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">
                    admin_panel_settings
                  </span>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-primary">
                      For Organizations
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Strategic KPIs, cost-per-asset reporting, and multi-site
                      compliance tracking.
                    </p>
                  </div>
                </li>
              
                <li className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container-low transition-colors group">
                  <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">
                    partner_exchange
                  </span>
                  <div>
                    <h4 className="font-headline-md text-headline-md text-primary">
                      For Vendors
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Portal for RFP responses, contract management, and
                      electronic invoicing.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-border-subtle">
              <img
                className="rounded-xl w-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0y1Pc2TDkuaTK-0172dzm6xDH-bWN9h7BRPV0YlwxZgkNDIID0opMJn6f8cbhjk4sr-hK01xIE9d_-sBgu2-hmWIWZGaVXVAt6WAVcIWzHjhkSgT1OuEU-P0F7hT2v0t5yX0UVCii2nXcSCcgRJ08YAwsWVmJP-AVXfQGp6iofBCPz_CqqzkC1o2Oe4l4RYeZgjfi8hAA3tqHz3fYXBN3SKfQ_4ZU82fsNiFeNfQ1CJujDTTd9apFcpA1n6Md1Q6-miZX9yx2zCM"
                alt=""
              />
            </div>
          </div>
        </section>

        <section className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-primary-container p-8 rounded-2xl text-on-primary-container flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl mb-6">
                explore
              </span>
              <h3 className="font-headline-lg text-headline-lg mb-4">
                Geo-Based Matching
              </h3>
              <p className="font-body-lg text-body-lg opacity-90 mb-8">
                Our proprietary algorithm calculates real-time proximity and
                traffic data to dispatch the nearest vendors with needed services,
                reducing travel time by 30%.
              </p>
              <div className="bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-md text-label-md">
                    Average Dispatch Time
                  </span>
                  <span className="font-headline-md text-headline-md">
                    14.2 mins
                  </span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-fixed w-3/4 h-full"></div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-20">
              <span className="material-symbols-outlined text-[200px]">
                my_location
              </span>
            </div>
          </div>
          <div className="bg-surface-bg border border-border-subtle p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-primary text-4xl mb-6">
                notifications_active
              </span>
              <h3 className="font-headline-lg text-headline-lg mb-4">
                Smart Notification Engine
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                Automated alerts via SMS, Push, and Email based on event
                criticality. Never miss a preventative maintenance milestone
                again.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border-l-4 border-status-danger">
                <span className="material-symbols-outlined text-status-danger">
                  warning
                </span>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-bold">
                    CRITICAL ALERT
                  </p>
                  <p className="font-body-md text-body-md">
                    HVAC System 4: Pressure exceeding safety limit.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border-l-4 border-status-success">
                <span className="material-symbols-outlined text-status-success">
                  check_circle
                </span>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-bold">
                    TASK COMPLETED
                  </p>
                  <p className="font-body-md text-body-md">
                    Annual Elevator Inspection - Site 2
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-32">
          <div className="bg-surface-subtle border border-border-subtle rounded-3xl p-12 overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <h2 className="font-headline-xl text-headline-xl text-primary mb-6">
                  Vendor Ecosystem
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                  MaintainPro streamlines external partnerships, ensuring every
                  vendor meets your high standards for quality and compliance.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <span className="bg-white p-2 rounded-lg shadow-sm material-symbols-outlined text-primary">
                      verified
                    </span>
                    <span className="font-label-md text-label-md">
                      Certificate Insurance Tracking
                    </span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="bg-white p-2 rounded-lg shadow-sm material-symbols-outlined text-primary">
                      contract_edit
                    </span>
                    <span className="font-label-md text-label-md">
                      Dynamic MSA Management
                    </span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="bg-white p-2 rounded-lg shadow-sm material-symbols-outlined text-primary">
                      rate_review
                    </span>
                    <span className="font-label-md text-label-md">
                      Performance Scorecards
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm">
                    <h4 className="font-label-md text-label-md text-secondary mb-2">
                      Automated Compliance
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Auto-suspends vendors with expired insurance or
                      certifications to prevent liability.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm">
                    <h4 className="font-label-md text-label-md text-secondary mb-2">
                      Bid Orchestration
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Send RFPs to your approved network and compare bids
                      side-by-side with AI analysis.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm">
                    <h4 className="font-label-md text-label-md text-secondary mb-2">
                      Centralized Billing
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Consolidated invoicing with 3-way matching between work
                      orders, quotes, and bills.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm">
                    <h4 className="font-label-md text-label-md text-secondary mb-2">
                      SLA Monitoring
                    </h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Track response times and first-fix ratios against
                      contractual requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-headline-lg text-headline-lg text-center mb-16">
            The Unified Maintenance Engine
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <div className="z-10 bg-white border border-border-subtle p-6 rounded-2xl w-full md:w-64 text-center shadow-md">
              <span className="material-symbols-outlined text-primary text-4xl mb-2">
                hub
              </span>
              <h5 className="font-label-md text-label-md font-bold mb-1">
                Central Hub
              </h5>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The source of truth for all asset data.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-primary/20"></div>

            <div className="z-10 bg-white border border-border-subtle p-6 rounded-2xl w-full md:w-64 text-center shadow-md">
              <span className="material-symbols-outlined text-secondary text-4xl mb-2">
                sync_alt
              </span>
              <h5 className="font-label-md text-label-md font-bold mb-1">
                Workflow Logic
              </h5>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Propelling tasks across team boundaries.
              </p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-primary/20"></div>

            <div className="z-10 bg-primary text-on-primary p-6 rounded-2xl w-full md:w-64 text-center shadow-lg">
              <span className="material-symbols-outlined text-4xl mb-2">
                auto_awesome
              </span>
              <h5 className="font-label-md text-label-md font-bold mb-1">
                Outcome Data
              </h5>
              <p className="font-body-md text-body-md opacity-90">
                Predictive insights for future budget cycles.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter variant="features" />
    </>
  );
}
