import React from 'react'

const AvailableVariables = () => {
  return (
<div 
            className="rounded-xl p-4 sm:p-6"
            style={{
              backgroundColor: 'var(--cardSecondary)',
              border: `1px solid var(--border)`
            }}
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Available Variables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{MemberFirstName}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{MemberFullName}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{MemberUsername}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{SponsorName}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{MemberEmail}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{LoginLink}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{AdminFeeLink}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{SponsorPaymentLink}}"}
              </code>
              <code 
                className="rounded-lg px-2 sm:px-3 py-2 font-mono break-all"
                style={{
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`,
                  color: 'var(--accent)'
                }}
              >
                {"{{ConfirmEmailLink}}"}
              </code>
            </div>
            <p className="text-xs sm:text-sm mt-3" style={{ color: 'var(--textSecondary)' }}>
              Use these variables in your template. They will be replaced with actual values when sending emails.
            </p>
          </div>  )
}

export default AvailableVariables