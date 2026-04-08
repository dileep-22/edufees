import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgingReportTab } from "../components/reports/AgingReportTab";
import { CollectionsSummaryTab } from "../components/reports/CollectionsSummaryTab";
import { PaymentMethodsTab } from "../components/reports/PaymentMethodsTab";
import { StudentBalancesTab } from "../components/reports/StudentBalancesTab";

const TABS = [
  { value: "collections", label: "Collections Summary" },
  { value: "balances", label: "Student Balances" },
  { value: "aging", label: "Aging Report" },
  { value: "methods", label: "Payment Methods" },
];

export default function ReportsPage() {
  return (
    <Layout>
      <div className="p-6 space-y-6" data-ocid="reports-page">
        <PageHeader
          title="Reports"
          description="Financial insights and payment analytics across all fee structures"
        />

        <Tabs defaultValue="collections" className="space-y-4">
          <TabsList className="bg-secondary border border-border h-auto p-1 gap-1">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground"
                data-ocid={`tab-${tab.value}`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="collections" className="mt-0">
            <CollectionsSummaryTab />
          </TabsContent>

          <TabsContent value="balances" className="mt-0">
            <StudentBalancesTab />
          </TabsContent>

          <TabsContent value="aging" className="mt-0">
            <AgingReportTab />
          </TabsContent>

          <TabsContent value="methods" className="mt-0">
            <PaymentMethodsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
