import { Link } from "react-router-dom";

import { PublicNavbar } from "@/features/public/components/PublicNavbar";
import { PublicFooter } from "@/features/public/components/PublicFooter";
import { MaterialIcon } from "@/features/public/components/MaterialIcon";
import { PUBLIC_ROUTES } from "@/features/public/constants/routes";

export function AboutPage() {
  return (
    <>
      <PublicNavbar activeItem="about" />
      <main className="pt-20">
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="relative z-10 max-w-max-width mx-auto px-gutter-desktop">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="inline-block py-1 px-3 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm mb-6 uppercase tracking-wider">
                Our Purpose
              </span>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8 leading-tight">
                Driving the future of facility management through connection.
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-10 rounded-xl group hover:border-primary transition-colors">
                <div className="w-14 h-14 bg-primary-fixed flex items-center justify-center rounded-lg mb-8 text-primary group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="rocket_launch"
                  >
                    rocket_launch
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg mb-4 text-primary">
                  Our Mission
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  "To simplify and connect global maintenance operations"
                </p>
              </div>

              <div className="glass-card p-10 rounded-xl group hover:border-secondary transition-colors">
                <div className="w-14 h-14 bg-secondary-fixed flex items-center justify-center rounded-lg mb-8 text-secondary group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="visibility"
                  >
                    visibility
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg mb-4 text-secondary">
                  Our Vision
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  "A world where facility issues are resolved instantly through
                  connected systems"
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border-subtle bg-surface-container-lowest py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-max-width px-gutter-mobile md:px-gutter-desktop">
            <div className="mb-8 md:mb-16">
              <h2 className="mb-2 font-headline-lg text-headline-lg text-on-surface">
                Our Story
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                From a small basement to a global infrastructure standard.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12 md:auto-rows-[minmax(200px,240px)]">
              <div className="glass-card flex flex-col justify-center rounded-xl p-6 sm:p-8 md:col-span-8 md:row-span-2 md:p-10">
                <p className="mb-4 font-body-lg text-body-lg leading-relaxed text-on-surface sm:mb-6 sm:leading-[1.8] md:mb-6">
                  MaintainPro began with a simple observation: the world&apos;s
                  most critical infrastructure was often managed with the most
                  outdated tools. In 2018, our founders set out to build a
                  bridge between high-stakes physical facilities and modern
                  digital efficiency.
                </p>
                <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant sm:leading-[1.8]">
                  We believe that when maintenance technicians have the right
                  data at their fingertips, the world runs smoother. Today, we
                  support over 10,000 facilities worldwide, ensuring that
                  safety, reliability, and sustainability are never compromised.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:contents">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[3/2] md:col-span-4 md:aspect-auto md:min-h-0 md:h-full">
                  <img
                    alt="Founder Team"
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdhmPMKR6fyZkVeLscIs3rQ5CuMIK3eJd27-tD3c2N-aOK8qRjuO894c5PnHDZLc5lmEKNtNIfjPPvRM0Cx01ueTgE4jG406NpETOb3ijQpqdtxSrY4v8yA4TzS3pqCDZ37n57QXke0vfvuYJf3yuHHGZkuhm1m1EzGN7aQIpojJGUuCnT7_rZ5nU88_093V4V2qBFXoYCBQ9Iz4c5GD--EetjPTZa4edgvBYiZlGDAd1OgQJx4LUL55F1PX7-ZSU2waxeCMv4NN0"
                  />
                </div>

                <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[3/2] md:col-span-4 md:aspect-auto md:min-h-0 md:h-full">
                  <img
                    alt="Technician at work"
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN1Xb35mceeuc6hWkuijaDmCbjUT9wEaVYkk301jW79wpG9Rfu_H_6g6FF3X0vqMc5XU36g1jOrvEaKPPLrIUBBmxhbWRl87HcRYC_4sNqI0ivU0fyc6XjJNbAGXiZL-mHt2u1kRDaAor39ZNIrTA1XaWHY4mbKXqtabnOxB3cTnlhMA8CsnTCzKDNIVXLd-hEBWt1DWFABcUcE0JQfoaXTzhT3fuDcFC1NFALgxzY12nGlLYyAatWIcFBimr-Qm0mY92jP7Q3PUM"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-max-width mx-auto px-gutter-desktop text-center">
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              The Minds Behind MaintainPro
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-16">
              A disciplined team of engineers, facility experts, and designers
              dedicated to building the backbone of modern operations.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="aspect-square rounded-xl overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500 border border-border-subtle">
                  <img
                    alt="CEO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVK-2p6FF1YXHTdQPrlpdeDBv9Wdfx5EpRnphzVyjqNpOaF9I9eeb0RnFllByz-ClWtcRxo8WWXVEwMZ-T8YBkXInv_wm-d2hbeRPBOTAot0iB8lPqmU2_CRRgfFZRSncf5fUBSd7yKq-LXinGUajyfhbAebIE3td4RDKjQkItUUmImVb9YRBh5A_FM0THQ-8GHl77wU6znPv71gKoEeRjHNHoNU2cSFtuUx-NxqHZ_iOZ71-PSOukqVK0I7eY25aqAhnw1B_JHIo"
                  />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Marcus Thorne
                </h3>
                <p className="font-label-md text-label-md text-primary mb-2 uppercase">
                  Chief Executive Officer
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Former Infrastructure Director at Global Logistics.
                </p>
              </div>

              <div className="group">
                <div className="aspect-square rounded-xl overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500 border border-border-subtle">
                  <img
                    alt="CTO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdTh5krr2dOTbuawl1o9V297B-2ub_qVv89i2E7_Hu5POLr0IfeclFnXmlPt9-b5NSV6VGEGfg23gncUvtLknsNhAoz5WDJbHTr3vgezIrVOaDDtJdzZm5uG8xzcYh5VgkThAEYwvwwpl8tNVgu-bJqPO0KtMOFo_DITe02hOxjnb82XA0xrD213d28bUFxE5PG0bjfehYpcHT5EJ1VAdC-QcES0v0QjHPlCll7rtMFShrLpv7A60P50A7jcK-wLl6hberOedOvFY"
                  />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Sarah Jenkins
                </h3>
                <p className="font-label-md text-label-md text-primary mb-2 uppercase">
                  Chief Technology Officer
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Distributed Systems Specialist and AI Architect.
                </p>
              </div>

              <div className="group">
                <div className="aspect-square rounded-xl overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500 border border-border-subtle">
                  <img
                    alt="COO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq50RF3hwPjnSOjAAPsxKQSOIz1rCnhVIxr_PSaojO1eCcYj_l9CGDnc2iOEHWGXQabJ3D3xwDOoMrkHzd9y_nHR17603E9thuLWbuXE0m3wMOc6Zt5QW5q1KoTN1Qdwp1efHiryYmlUBq0H6dJ-jE9_W6BFHcR0wIbNOyCeQAZNJChewt4telwxETjDCXOBWurCImGqf2D7b7yretx8b7tX4WymbPF41B_rLKO5y-D94zVm31l04O6t5y89CPfl-CIHqd9xJ7Azg"
                  />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  David Chen
                </h3>
                <p className="font-label-md text-label-md text-primary mb-2 uppercase">
                  Chief Operations Officer
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  20+ years in Large-Scale Facility Management.
                </p>
              </div>

              <div className="group">
                <div className="aspect-square rounded-xl overflow-hidden mb-6 grayscale hover:grayscale-0 transition-all duration-500 border border-border-subtle">
                  <img
                    alt="Head of Design"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTW-dBVHH1Eu-SbUPYmkmf85Xov2ZRwbP6A4g5WdiuyIxEccrZXcEWqZqZxLE4M1aw5ta_Kk-79-CkjvpYS5WQLRcodXm5es0ot32g-PD_cZHOjHEq1mGsBJkcSQT-ccV6CftLIrE0dlIJhy2bEsPGMAiZxruq3CRm3Mkn3J5rJfRMj4JENODf3BuohpSXswNDtOrIFh2A_mwzNtt46yAuZjrao3b8y28KQXPJnAcC2wRQP8tZMjWSlXjOBLeTA6JLqQ0Cexrl-jQ"
                  />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Elena Rodriguez
                </h3>
                <p className="font-label-md text-label-md text-primary mb-2 uppercase">
                  Head of Design
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Specializing in high-utility enterprise interfaces.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-primary text-on-primary">
          <div className="max-w-max-width mx-auto px-gutter-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl">
                <h2 className="font-headline-xl text-headline-xl mb-4">
                  Values that define us.
                </h2>
                <p className="font-body-lg text-body-lg opacity-80">
                  Our code of conduct isn't on a wall; it's in our software.
                </p>
              </div>
              <Link
                to={PUBLIC_ROUTES.SIGNUP}
                className="inline-block rounded-xl bg-secondary-container px-8 py-4 font-headline-md text-headline-md text-on-secondary-container transition-colors hover:bg-secondary"
              >
                Join our mission
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="border-t border-on-primary/20 pt-8">
                <span className="font-label-sm text-label-sm opacity-50 mb-4 block">
                  01
                </span>
                <h3 className="font-headline-md text-headline-md mb-3">
                  Absolute Reliability
                </h3>
                <p className="font-body-md text-body-md opacity-70">
                  We build systems that cannot fail because we know the stakes
                  are too high for downtime.
                </p>
              </div>
              <div className="border-t border-on-primary/20 pt-8">
                <span className="font-label-sm text-label-sm opacity-50 mb-4 block">
                  02
                </span>
                <h3 className="font-headline-md text-headline-md mb-3">
                  Functional Clarity
                </h3>
                <p className="font-body-md text-body-md opacity-70">
                  Complexity is the enemy. We simplify the hardest workflows
                  into intuitive digital actions.
                </p>
              </div>
              <div className="border-t border-on-primary/20 pt-8">
                <span className="font-label-sm text-label-sm opacity-50 mb-4 block">
                  03
                </span>
                <h3 className="font-headline-md text-headline-md mb-3">
                  Global Connection
                </h3>
                <p className="font-body-md text-body-md opacity-70">
                  Breaking silos between departments, vendors, and technicians
                  for a unified front.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter variant="about" />
    </>
  );
}
