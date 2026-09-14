/** MaintainPro runs against the live backend. Demo fixtures are no longer a runtime mode. */
export const runtimeConfig = { demoMode: false } as const

/** @deprecated Kept temporarily for modules being migrated; always false. */
export const isDemoMode = false
