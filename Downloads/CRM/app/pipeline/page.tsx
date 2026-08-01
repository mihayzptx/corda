import { redirect } from "next/navigation";
import { PipelineBoard } from "@/components/pipeline-board";
import { Card } from "@/components/ui";
import { daysSince, formatDate } from "@/lib/crm";
import { readCrmData } from "@/lib/crm-data";

export default async function PipelinePage() {
  const data = await readCrmData();
  if (!data.setup.completed) redirect("/setup/company");
  const staleDeals = data.deals.filter((deal) => (daysSince(deal.lastActivityDate) ?? 999) >= 14).length;
  const staleAccounts = data.accounts.filter((account) => (daysSince(account.lastContactDate) ?? 999) >= 14).length;
  const activeWork = data.deals.filter((deal) => deal.stage !== "Closed Won" && deal.stage !== "Closed Lost").length;
  const recentAccounts = data.setup.completedAt
    ? data.accounts.filter((account) => account.createdAt >= data.setup.completedAt!)
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Open deals" subtitle="Pipeline items not yet closed.">
          <div className="text-3xl font-semibold text-ink-900">{activeWork}</div>
          <div className="mt-2 text-sm text-ink-600">Current live work queue.</div>
        </Card>
        <Card title="Stale deals" subtitle="14+ days since last activity.">
          <div className="text-3xl font-semibold text-ink-900">{staleDeals}</div>
          <div className="mt-2 text-sm text-ink-600">Needs a follow-up today.</div>
        </Card>
        <Card title="Stale accounts" subtitle="14+ days since last contact.">
          <div className="text-3xl font-semibold text-ink-900">{staleAccounts}</div>
          <div className="mt-2 text-sm text-ink-600">Accounts slipping out of view.</div>
        </Card>
      </div>

      {recentAccounts.length > 0 && (
        <Card title="Accounts added in setup" subtitle="These were just entered during first-time setup.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentAccounts.map((account) => (
              <div key={account.id} className="rounded-2xl border border-ink-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-ink-900">{account.companyName}</div>
                <div className="mt-1 text-sm text-ink-600">
                  {account.industry} | {account.status}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card
        title="Deal pipeline"
        subtitle={`Live board updated from the local CRM store. Last seeded on ${formatDate("2026-07-31")}.`}
      >
        <PipelineBoard
          initialStages={data.settings.stages.map((stage, idx) => ({
            id: stage,
            name: stage,
          }))}
          initialDeals={data.deals.map((deal) => {
            const account = data.accounts.find((a) => a.id === deal.accountId);
            return {
              id: deal.id,
              name: account?.companyName ?? "Unknown",
              value: deal.value.toString(),
              stageId: deal.stage,
            };
          })}
        />
      </Card>
    </div>
  );
}
