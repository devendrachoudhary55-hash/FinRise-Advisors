/**
 * The editorial plan for scheduled posts.
 *
 * Kept separate from the posts themselves so the schedule can be reviewed as a
 * whole — 90 posts only works if the topics are genuinely distinct, and that is
 * only visible when they sit in one list. Each entry becomes one post in
 * content/posts/ when written.
 *
 * cat: Construction | CFO Insights | Business Finance
 */

module.exports = [
  // ---- Job costing and cost control ----
  { slug: 'job-cost-coding-for-field-crews', title: 'Getting Field Crews to Code Job Costs Correctly', cat: 'Construction', kw: 'job cost coding, field time coding, construction cost codes' },
  { slug: 'cost-codes-vs-chart-of-accounts', title: 'Cost Codes vs. Chart of Accounts: Why Contractors Confuse Them', cat: 'Construction', kw: 'construction cost codes, contractor chart of accounts, job cost structure' },
  { slug: 'committed-cost-tracking', title: 'Committed Costs: The Number Missing From Your Job Report', cat: 'Construction', kw: 'committed costs construction, purchase order tracking, job cost commitments' },
  { slug: 'cost-to-complete-estimates', title: 'How to Produce a Cost-to-Complete You Can Defend', cat: 'Construction', kw: 'cost to complete, estimate at completion, construction forecasting' },
  { slug: 'job-cost-variance-analysis', title: 'Reading Job Cost Variances Before They Become Losses', cat: 'Construction', kw: 'job cost variance, construction budget variance, cost overrun analysis' },
  { slug: 'indirect-cost-allocation-construction', title: 'Allocating Indirect Costs Without Distorting Job Margins', cat: 'Construction', kw: 'indirect cost allocation, construction overhead allocation, burden rate' },
  { slug: 'small-tools-and-consumables', title: 'Small Tools and Consumables: Expense or Allocate?', cat: 'Construction', kw: 'small tools expense, construction consumables accounting' },
  { slug: 'self-performed-vs-subcontracted-margin', title: 'Self-Performed vs. Subcontracted Work: Where Margin Actually Comes From', cat: 'Construction', kw: 'self perform vs subcontract, construction gross margin analysis' },
  { slug: 'crew-productivity-tracking', title: 'Tracking Crew Productivity in Units, Not Just Dollars', cat: 'Construction', kw: 'crew productivity, labor productivity construction, unit cost tracking' },
  { slug: 'material-waste-and-shrinkage', title: 'Accounting for Material Waste and Shrinkage on Jobs', cat: 'Construction', kw: 'material waste construction, inventory shrinkage contractor' },

  // ---- WIP and revenue recognition ----
  { slug: 'wip-fade-analysis', title: 'WIP Fade: Catching Margin Erosion Before Close', cat: 'Construction', kw: 'WIP fade analysis, gross profit fade, construction margin erosion' },
  { slug: 'over-under-billing-explained', title: 'Overbillings and Underbillings, Explained Without Jargon', cat: 'Construction', kw: 'overbillings underbillings, billings in excess of costs' },
  { slug: 'asc-606-for-contractors', title: 'ASC 606 for Contractors: What Actually Changed', cat: 'Construction', kw: 'ASC 606 construction, revenue recognition contractors' },
  { slug: 'performance-obligations-construction', title: 'Identifying Performance Obligations in a Construction Contract', cat: 'Construction', kw: 'performance obligations ASC 606, construction contract accounting' },
  { slug: 'unbilled-revenue-contractors', title: 'Unbilled Revenue: What It Means and When to Worry', cat: 'Construction', kw: 'unbilled revenue construction, work in progress receivable' },
  { slug: 'backlog-reporting-contractors', title: 'Backlog Reporting: The Number Lenders Ask For First', cat: 'Construction', kw: 'construction backlog report, contract backlog schedule' },
  { slug: 'wip-schedule-review-checklist', title: 'A Review Checklist for Your WIP Schedule', cat: 'Construction', kw: 'WIP schedule review, WIP schedule checklist construction' },
  { slug: 'contract-types-and-revenue', title: 'Lump Sum, T&M, Cost-Plus and GMP: How Each Hits Your Books', cat: 'Construction', kw: 'construction contract types, GMP accounting, cost plus contract' },
  { slug: 'mobilization-costs-accounting', title: 'Mobilization Costs: Capitalize, Defer, or Expense?', cat: 'Construction', kw: 'mobilization costs accounting, construction pre-contract costs' },
  { slug: 'contingency-and-allowances', title: 'Contingency and Allowances in Contract Accounting', cat: 'Construction', kw: 'construction contingency accounting, contract allowances' },

  // ---- Billing and collections ----
  { slug: 'schedule-of-values-construction', title: 'Building a Schedule of Values That Gets You Paid Faster', cat: 'Construction', kw: 'schedule of values, SOV construction, front loading schedule of values' },
  { slug: 'pay-application-rejections', title: 'Why Pay Applications Get Rejected — and How to Stop It', cat: 'Construction', kw: 'pay application rejected, AIA pay app errors, progress billing problems' },
  { slug: 'progress-billing-best-practices', title: 'Progress Billing Practices That Shorten Your Cash Cycle', cat: 'Construction', kw: 'progress billing construction, contractor billing cycle' },
  { slug: 'time-and-material-billing', title: 'Time and Material Billing Without Losing the Argument', cat: 'Construction', kw: 'T&M billing construction, time and material invoicing contractor' },
  { slug: 'joint-check-agreements', title: 'Joint Check Agreements: How They Work and What They Cost You', cat: 'Construction', kw: 'joint check agreement construction, joint check accounting' },
  { slug: 'pay-when-paid-vs-pay-if-paid', title: 'Pay-When-Paid vs. Pay-If-Paid: The Clause That Decides Your Cash', cat: 'Construction', kw: 'pay when paid, pay if paid clause, subcontractor payment terms' },
  { slug: 'prompt-payment-acts', title: 'Prompt Payment Acts: The Leverage Most Contractors Never Use', cat: 'Construction', kw: 'prompt payment act construction, late payment interest contractor' },
  { slug: 'construction-collections-process', title: 'A Collections Process for Contractors Who Hate Collections', cat: 'Construction', kw: 'construction collections, contractor accounts receivable process' },
  { slug: 'retention-receivable-aging', title: 'Aging Your Retention Receivable Separately — and Why', cat: 'Construction', kw: 'retention receivable aging, retainage AR tracking' },
  { slug: 'final-billing-and-closeout', title: 'Closeout Accounting: Getting the Last 10% Off the Books', cat: 'Construction', kw: 'construction closeout accounting, final billing contractor' },

  // ---- Payroll and labor ----
  { slug: 'davis-bacon-compliance', title: 'Davis-Bacon Compliance Without the Panic', cat: 'Construction', kw: 'Davis-Bacon Act compliance, prevailing wage federal projects' },
  { slug: 'union-payroll-fringe-benefits', title: 'Union Payroll and Fringe Benefit Reporting for Contractors', cat: 'Construction', kw: 'union payroll construction, fringe benefit reporting, union reporting contractor' },
  { slug: 'multi-state-payroll-contractors', title: 'Multi-State Payroll When Your Crews Cross State Lines', cat: 'Construction', kw: 'multi state payroll construction, contractor payroll nexus' },
  { slug: 'per-diem-and-travel-pay', title: 'Per Diem and Travel Pay: Taxable or Not?', cat: 'Construction', kw: 'per diem construction workers, travel pay taxable contractor' },
  { slug: 'workers-comp-audit-preparation', title: 'Surviving a Workers Comp Audit With Your Numbers Intact', cat: 'Construction', kw: 'workers comp audit construction, contractor insurance audit' },
  { slug: 'labor-burden-vs-billable-rate', title: 'Labor Burden vs. Billable Rate: Two Numbers, Two Jobs', cat: 'Construction', kw: 'labor burden rate, billable rate construction, fully loaded labor cost' },
  { slug: 'overtime-cost-planning', title: 'What Overtime Actually Costs a Contractor', cat: 'Construction', kw: 'construction overtime cost, overtime labor burden' },
  { slug: 'employee-vs-subcontractor-classification', title: 'Employee or Subcontractor? The Test That Decides', cat: 'Construction', kw: 'worker classification construction, 1099 vs W2 contractor' },
  { slug: 'payroll-allocation-to-jobs', title: 'Allocating Payroll to Jobs So Your Costs Mean Something', cat: 'Construction', kw: 'payroll job allocation, construction labor distribution' },
  { slug: 'certified-payroll-common-errors', title: 'The Certified Payroll Errors That Trigger Withholding', cat: 'Construction', kw: 'certified payroll errors, WH-347 mistakes, prevailing wage violations' },

  // ---- Compliance and risk ----
  { slug: 'mechanics-lien-deadlines', title: 'Mechanics Lien Deadlines: A Calendar You Cannot Miss', cat: 'Construction', kw: 'mechanics lien deadline, preliminary notice construction' },
  { slug: 'preliminary-notices', title: 'Preliminary Notices: Cheap Insurance for Getting Paid', cat: 'Construction', kw: 'preliminary notice construction, 20 day notice lien rights' },
  { slug: 'insurance-certificate-tracking', title: 'Tracking Subcontractor Insurance Certificates Before It Costs You', cat: 'Construction', kw: 'COI tracking construction, subcontractor insurance compliance' },
  { slug: 'subcontractor-default-risk', title: 'What Happens to Your Books When a Sub Walks Off', cat: 'Construction', kw: 'subcontractor default, sub walks off job accounting' },
  { slug: 'warranty-reserves-construction', title: 'Setting a Warranty Reserve That Holds Up', cat: 'Construction', kw: 'construction warranty reserve, warranty accrual contractor' },
  { slug: 'change-order-disputes', title: 'Accounting for Change Orders in Dispute', cat: 'Construction', kw: 'disputed change order accounting, unapproved change orders' },
  { slug: 'claims-and-delay-damages', title: 'Claims, Delay Damages and When to Recognize Them', cat: 'Construction', kw: 'construction claims accounting, delay damages revenue' },
  { slug: 'liquidated-damages-accounting', title: 'Liquidated Damages: Accruing for a Deadline You Might Miss', cat: 'Construction', kw: 'liquidated damages construction, LD accrual contractor' },
  { slug: 'contract-review-for-cash-terms', title: 'Reading a Construction Contract for Its Cash Terms', cat: 'Construction', kw: 'construction contract cash terms, payment clause review' },
  { slug: 'audit-readiness-contractors', title: 'What a Contractor Audit Actually Tests', cat: 'Construction', kw: 'construction audit preparation, contractor financial statement audit' },

  // ---- Cash flow and financing ----
  { slug: 'draw-schedule-cash-planning', title: 'Planning Cash Around a Draw Schedule', cat: 'Construction', kw: 'construction draw schedule, contractor cash flow timing' },
  { slug: 'working-capital-for-contractors', title: 'How Much Working Capital a Contractor Actually Needs', cat: 'Construction', kw: 'construction working capital, contractor liquidity requirements' },
  { slug: 'line-of-credit-for-contractors', title: 'Using a Line of Credit Without Becoming Dependent on It', cat: 'Construction', kw: 'contractor line of credit, construction revolving credit' },
  { slug: 'equipment-financing-decisions', title: 'Buy, Lease or Rent: Running the Equipment Numbers', cat: 'Construction', kw: 'construction equipment financing, buy vs lease equipment contractor' },
  { slug: 'receivables-factoring-construction', title: 'Factoring Construction Receivables: The Real Cost', cat: 'Construction', kw: 'construction invoice factoring, contractor receivables financing' },
  { slug: 'cash-flow-by-job', title: 'Forecasting Cash Job by Job, Not Just Company-Wide', cat: 'Construction', kw: 'job level cash flow, construction cash forecast by project' },
  { slug: 'seasonality-cash-planning', title: 'Planning for the Season When the Work Stops', cat: 'Construction', kw: 'construction seasonality cash, winter slowdown contractor finance' },
  { slug: 'dso-for-contractors', title: 'Days Sales Outstanding for Contractors: A Different Calculation', cat: 'Construction', kw: 'DSO construction, contractor days sales outstanding' },
  { slug: 'growth-cash-trap', title: 'The Growth Trap: Why Winning More Work Can Break You', cat: 'CFO Insights', kw: 'construction growth cash flow, overtrading contractor' },
  { slug: 'break-even-by-division', title: 'Break-Even Analysis by Division, Not Just Company', cat: 'CFO Insights', kw: 'construction break even analysis, division profitability contractor' },

  // ---- Bonding and surety ----
  { slug: 'surety-prequalification-process', title: 'What a Surety Looks At Before Bonding You', cat: 'Construction', kw: 'surety prequalification, bonding capacity contractor' },
  { slug: 'increasing-bonding-capacity', title: 'Increasing Bonding Capacity Through Your Financials', cat: 'Construction', kw: 'increase bonding capacity, surety credit construction' },
  { slug: 'bid-vs-performance-bonds', title: 'Bid Bonds, Performance Bonds and Payment Bonds Compared', cat: 'Construction', kw: 'bid bond vs performance bond, construction bond types' },
  { slug: 'reviewed-vs-audited-statements', title: 'Reviewed or Audited Financials: What Your Surety Requires', cat: 'Construction', kw: 'reviewed vs audited financial statements construction, surety requirements' },
  { slug: 'personal-guarantees-indemnity', title: 'Personal Guarantees and Indemnity Agreements in Bonding', cat: 'Construction', kw: 'surety indemnity agreement, personal guarantee contractor bond' },
  { slug: 'bonding-red-flags', title: 'The Financial Red Flags That Cost Contractors Their Bond Line', cat: 'Construction', kw: 'bonding red flags, surety credit problems contractor' },

  // ---- Tax ----
  { slug: 'section-460-long-term-contracts', title: 'Section 460: Long-Term Contract Tax Rules for Contractors', cat: 'Construction', kw: 'Section 460 construction, long term contract tax method' },
  { slug: 'small-contractor-exemption', title: 'The Small Contractor Exemption and Whether You Qualify', cat: 'Construction', kw: 'small contractor exemption, gross receipts test construction' },
  { slug: 'look-back-method-explained', title: 'The Look-Back Method, Explained for Contractors', cat: 'Construction', kw: 'look back method construction, Form 8697' },
  { slug: 'cash-vs-accrual-contractors', title: 'Cash or Accrual: Which Method Fits Your Contracting Business', cat: 'Construction', kw: 'cash vs accrual construction, contractor accounting method' },
  { slug: 'sales-tax-on-construction', title: 'Sales Tax on Construction Work: The Rules Change by State', cat: 'Construction', kw: 'construction sales tax, contractor use tax by state' },
  { slug: 'multi-state-tax-nexus-contractors', title: 'When Working in Another State Creates a Tax Problem', cat: 'Construction', kw: 'construction nexus multi state, contractor state tax registration' },
  { slug: 'section-179d-for-contractors', title: '179D and the Energy Deductions Contractors Miss', cat: 'Construction', kw: '179D deduction contractor, energy efficient commercial building deduction' },
  { slug: 'rd-credit-for-construction', title: 'The R&D Credit Construction Companies Overlook', cat: 'Construction', kw: 'R&D tax credit construction, research credit contractor' },
  { slug: 'entity-structure-for-contractors', title: 'Choosing an Entity Structure as a Contractor', cat: 'Construction', kw: 'contractor entity structure, S corp construction company' },
  { slug: 'related-party-equipment-rental', title: 'Renting Equipment From Your Own Entity: Doing It Properly', cat: 'Construction', kw: 'related party equipment rental construction, equipment company structure' },

  // ---- Systems and process ----
  { slug: 'quickbooks-setup-for-contractors', title: 'Setting Up QuickBooks Properly for a Contracting Business', cat: 'Construction', kw: 'QuickBooks for contractors setup, construction QuickBooks chart of accounts' },
  { slug: 'construction-erp-selection', title: 'Choosing Construction Accounting Software Without Regret', cat: 'Construction', kw: 'construction accounting software, Sage vs Foundation vs Procore' },
  { slug: 'procore-quickbooks-integration', title: 'Connecting Project Management to Accounting Without Double Entry', cat: 'Construction', kw: 'Procore QuickBooks integration, construction software integration' },
  { slug: 'month-end-close-for-contractors', title: 'A Month-End Close Calendar Built for Contractors', cat: 'Construction', kw: 'construction month end close, contractor closing checklist' },
  { slug: 'document-management-for-jobs', title: 'Job Documentation That Survives a Dispute', cat: 'Construction', kw: 'construction document management, job file organization contractor' },
  { slug: 'approval-workflows-construction', title: 'Approval Workflows That Stop Cost Leakage', cat: 'Construction', kw: 'construction approval workflow, PO approval process contractor' },
  { slug: 'purchase-order-discipline', title: 'Purchase Order Discipline on Jobs That Move Fast', cat: 'Construction', kw: 'construction purchase order process, PO system contractor' },
  { slug: 'field-to-office-data-flow', title: 'Getting Data From the Field to the Office Without Friction', cat: 'Construction', kw: 'field data capture construction, daily reports to accounting' },
  { slug: 'when-to-hire-a-controller', title: 'When a Contractor Needs a Controller, Not Just a Bookkeeper', cat: 'CFO Insights', kw: 'construction controller, when to hire controller contractor' },

  // ---- Reporting and KPIs ----
  { slug: 'kpis-for-contractors', title: 'The Handful of KPIs That Actually Run a Contracting Business', cat: 'CFO Insights', kw: 'construction KPIs, contractor key performance indicators' },
  { slug: 'reading-a-contractor-balance-sheet', title: 'How to Read a Contractor Balance Sheet', cat: 'CFO Insights', kw: 'contractor balance sheet, construction financial statement analysis' },
  { slug: 'monthly-reporting-package-contractors', title: 'What Belongs in a Contractor Monthly Reporting Package', cat: 'CFO Insights', kw: 'construction monthly reporting, contractor financial package' },
  { slug: 'lender-reporting-requirements', title: 'Meeting Lender Reporting Requirements Without Scrambling', cat: 'CFO Insights', kw: 'lender reporting construction, bank covenant reporting contractor' },
  { slug: 'financial-covenants-contractors', title: 'Financial Covenants: The Ratios Your Bank Is Watching', cat: 'CFO Insights', kw: 'construction loan covenants, contractor financial ratios' },
  { slug: 'gross-margin-by-job-type', title: 'Comparing Gross Margin Across Job Types', cat: 'CFO Insights', kw: 'construction gross margin by job type, project profitability comparison' },
  { slug: 'estimating-vs-actual-feedback-loop', title: 'Closing the Loop Between Estimating and Actual Cost', cat: 'Construction', kw: 'estimating vs actual construction, bid accuracy feedback' },
  { slug: 'overhead-recovery-rate', title: 'Are You Recovering Overhead? The Rate Most Contractors Guess', cat: 'CFO Insights', kw: 'overhead recovery construction, contractor overhead rate' },
  { slug: 'bid-hit-rate-analysis', title: 'Bid Hit Rate: What Your Win Percentage Is Telling You', cat: 'CFO Insights', kw: 'construction bid hit rate, contractor win rate analysis' },
  { slug: 'owner-compensation-contractors', title: 'Setting Owner Compensation in a Contracting Business', cat: 'CFO Insights', kw: 'contractor owner salary, construction owner compensation' },
  { slug: 'exit-planning-for-contractors', title: 'What a Contracting Business Is Worth — and What Raises It', cat: 'CFO Insights', kw: 'construction company valuation, contractor exit planning' },
];
