import React from 'react'

const AvailableVariables = () => {
  return (
<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              Available Variables
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{FirstName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{MemberFullName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{MemberUsername}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{SponsorName}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{MemberEmail}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{LoginLink}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{AdminFeeLink}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{SponsorPaymentLink}}"}
              </code>
              <code className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-blue-700">
                {"{{ConfirmEmailLink}}"}
              </code>
            </div>
            <p className="text-blue-600 text-sm mt-3">
              Use these variables in your template. They will be replaced with actual values when sending emails.
            </p>
          </div>  )
}

export default AvailableVariables