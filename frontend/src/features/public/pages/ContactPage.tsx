import { useRef, useState } from 'react'

import { PublicNavbar } from '@/features/public/components/PublicNavbar'
import { PublicFooter } from '@/features/public/components/PublicFooter'
import { MaterialIcon } from '@/features/public/components/MaterialIcon'

type SubmitState = 'idle' | 'loading' | 'success'

export function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitState !== 'idle') return

    setSubmitState('loading')
    window.setTimeout(() => {
      setSubmitState('success')
      formRef.current?.reset()
      window.setTimeout(() => setSubmitState('idle'), 3000)
    }, 1500)
  }

  return (
    <>
      <PublicNavbar activeItem="contact" />
      <main className="mx-auto max-w-max-width px-gutter-desktop pb-20 pt-32">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="mb-4 font-headline-xl text-headline-xl text-primary">
            Let&apos;s solve your maintenance challenges together.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Our technical support team is ready to help you optimize your facility operations. Reach
            out and experience the MaintainPro standard.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="bento-card rounded-xl p-8 md:col-span-7">
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle px-4 py-3 font-body-md outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                    Work Email
                  </label>
                  <input
                    className="w-full rounded-lg border border-border-subtle px-4 py-3 font-body-md outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    id="email"
                    name="email"
                    placeholder="john@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  className="w-full resize-none rounded-lg border border-border-subtle px-4 py-3 font-body-md outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  id="message"
                  name="message"
                  placeholder="How can we help your organization?"
                  required
                  rows={5}
                />
              </div>
              <button
                type="submit"
                disabled={submitState === 'loading'}
                className={`w-full rounded-lg py-4 font-headline-md text-headline-md shadow-sm transition-colors ${
                  submitState === 'success'
                    ? 'bg-status-success text-white'
                    : 'bg-primary text-white hover:bg-primary-container'
                }`}
              >
                {submitState === 'loading' && (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </span>
                )}
                {submitState === 'success' && (
                  <span className="flex items-center justify-center gap-2">
                    <MaterialIcon name="check_circle" />
                    Message Sent
                  </span>
                )}
                {submitState === 'idle' && 'Send Message'}
              </button>
            </form>
          </div>

          <div className="space-y-8 md:col-span-5">
            <div className="bento-card space-y-6 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-surface-container p-3">
                  <MaterialIcon name="mail" className="text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-headline-md text-headline-md text-primary">Support Email</h3>
                  <a
                    className="font-body-lg text-body-lg font-medium text-secondary hover:underline"
                    href="mailto:support@maintainpro.com"
                  >
                    support@maintainpro.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-surface-container p-3">
                  <MaterialIcon name="timer" className="text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-headline-md text-headline-md text-primary">Response Time</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    We respond within 24 hours
                  </p>
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-status-success/10 px-3 py-1 font-label-sm text-label-sm text-status-success">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-status-success" />
                    Currently Online
                  </span>
                </div>
              </div>
            </div>

            <div className="group bento-card overflow-hidden rounded-xl">
              <div className="relative flex h-64 w-full items-center justify-center bg-surface-container-high">
                <img
                  alt="Map location"
                  className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:grayscale-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIIhHJ6B7mBkqOjTjQCSmdUcU-CfTsGynTpO7594gLSmJ7IiZPrboOpMOcH9jA_lkEcK5_-OhirsD70QydPjmidn0co8-do04wp0MDnSrsDK8EO5ZbZTSOCPiAnqTU6B1ssA4D__q4tTPlfN0mgl1jpaVlc2n084eEyVUHRlgiowPIXE6FZqNzYMvJM1Lzmz7d8wUPWO29QiCRhV4RuEQ_3IqekOdC6VW2cwe6Fve8C4IBYmeheioqgsC_65Pd9iEkRTRryf_VGc4"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-12 w-12 transform items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform group-hover:scale-110">
                    <MaterialIcon name="location_on" filled />
                  </div>
                  <div className="mt-4 rounded-lg border border-border-subtle bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm">
                    <p className="font-label-md text-label-md text-primary">
                      Headquarters: San Francisco, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <PublicFooter variant="contact" />
    </>
  )
}
