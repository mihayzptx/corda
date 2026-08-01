import React from 'react';

interface Step0Props {
  company: { name: string; industry: string; teamSize: string };
  onCompanyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onIndustryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setTeamSize: (size: string) => void;
  onContinue: () => void;
  continueDisabled: boolean;
}

export function Step0Company({
  company,
  onCompanyNameChange,
  onIndustryChange,
  setTeamSize,
  onContinue,
  continueDisabled,
}: Step0Props) {
  const teamSizeOptions = ['1-5', '6-20', '21-50', '51+'];
  const industryOptions = [
    'Home Services (HVAC, Plumbing, Electrical)',
    'Cleaning Services',
    'Landscaping & Lawn Care',
    'Construction & Contracting',
    'IT & Managed Services',
    'Consulting & Professional Services',
    'Other',
  ];

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Tell us about your company</h2>
      <p className="mb-6 text-sm opacity-70">A few basics so we can tailor the rest of setup to how you work.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium mb-1">
            Company name
          </label>
          <input
            id="company-name"
            type="text"
            placeholder="e.g. Riverside Plumbing Co."
            value={company.name}
            onChange={onCompanyNameChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="company-industry" className="block text-sm font-medium mb-1">
            Industry
          </label>
          <select
            id="company-industry"
            value={company.industry}
            onChange={onIndustryChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">Select an industry</option>
            {industryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Team size</label>
          <div className="flex gap-2">
            {teamSizeOptions.map((size) => (
              <label key={size} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="team-size"
                  checked={company.teamSize === size}
                  onChange={() => setTeamSize(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
