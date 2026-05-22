const express = require('express');
const router = express.Router();

// Load Submission model safely — website still works even if MongoDB is unavailable
let Submission = null;
try { Submission = require('../models/Submission'); } catch (e) { /* no DB */ }

// ===== BLOG POSTS DATA =====
const blogPosts = [
  {
    slug: 'what-is-a-fractional-cfo',
    title: 'What Is a Fractional CFO — and Does Your Business Need One?',
    category: 'CFO Insights',
    date: 'May 8, 2026',
    readTime: '6 min read',
    excerpt: 'A fractional CFO gives you senior financial leadership without the full-time salary. Here\'s how to know when your business is ready for one.',
    icon: 'fa-chart-line',
    metaDescription: 'Learn what a fractional CFO does, how much it costs, and how to know when your small business needs one. Expert guide from FinRise Advisors.',
    keywords: 'fractional CFO, fractional CFO services, fractional CFO for small business, what is a fractional CFO',
    body: `
      <h2>Let Me Be Straight With You About What a Fractional CFO Actually Is</h2>
      <p>I've been doing outsourced accounting and CFO advisory work for over 8 years, and I'll give you the honest version — not the polished pitch deck version. A fractional CFO is a senior finance executive who works with your business part-time. That's it. You get the expertise without paying a full-time salary. Simple concept, but the impact is anything but simple.</p>
      <p>Most business owners I meet are at a specific crossroads. Their bookkeeper is great at recording transactions. Their CPA shows up once a year for taxes. But nobody is asking: <em>Where are we headed financially? Can we afford this hire? Will we have cash in 90 days?</em> That gap — between compliance accounting and real financial leadership — is exactly where a fractional CFO lives.</p>
      <h2>What I Actually Do for My Clients</h2>
      <p>A pattern I encounter regularly: a manufacturing or product-based business is profitable on paper but constantly stressed about cash. When I dig into the numbers, the reasons become clear — payment terms with distributors are creating a cash gap, one product line is quietly running at negative gross margin, and there's an upcoming equipment loan with no debt service coverage modeled out. None of that shows up in a standard monthly QuickBooks report. Finding and addressing those three things — that's the job.</p>
      <ul>
        <li>Building and managing 13-week rolling cash flow forecasts</li>
        <li>Creating annual budgets and tracking actuals vs. plan every single month</li>
        <li>Preparing financial packages for boards, lenders, and investors</li>
        <li>Digging into pricing, margins, and unit economics by product or service line</li>
        <li>Guiding fundraising — SBA loans, lines of credit, equity raises</li>
        <li>Finding the cost leaks and profitability opportunities your P&L is hiding</li>
      </ul>
      <h2>Signs You're Ready — and Signs You're Already Late</h2>
      <p>I'll be honest: most owners wait too long. By the time they call me, they've already made one or two expensive decisions without proper financial analysis. Here's what to watch for:</p>
      <ul>
        <li>Revenue is past $2M and growing, but you still can't explain your true margins by product or customer</li>
        <li>You're planning a capital raise or significant debt and have no financial model built</li>
        <li>Cash flow surprises keep blindsiding you — payroll is tight, but the P&L looks fine</li>
        <li>Your accountant handles compliance but nobody on your team is thinking six months ahead</li>
        <li>You're about to hire aggressively or open a new location without stress-testing the numbers</li>
      </ul>
      <h2>The Cost Math Is Obvious — But the Real ROI Isn't</h2>
      <p>A full-time CFO with benefits runs $250,000 to $400,000 a year. A fractional CFO runs $1,500 to $5,000 a month depending on scope. Do the math. But here's what most articles won't tell you: the real return isn't the salary savings. It's the decision you <em>don't</em> make badly. One avoided bad acquisition, one properly structured line of credit, one pricing model that doesn't erode margin — that's where fractional CFOs pay for themselves. I've seen it happen in the first quarter of an engagement more times than I can count.</p>
      <p>If you're growing and you feel like your financial information is always lagging behind your decisions, that's the sign. <a href="/contact-us">Book a free consultation</a> and let's talk about what you actually need.</p>
    `
  },
  {
    slug: 'outsourced-accounting-services-for-small-business',
    title: 'Outsourced Accounting Services for Small Business: The Complete 2026 Guide',
    category: 'Business Finance',
    date: 'May 12, 2026',
    readTime: '8 min read',
    excerpt: 'Everything US small business owners need to know about outsourcing their accounting — what\'s included, how much it costs, and how to choose the right provider.',
    icon: 'fa-book-open',
    metaDescription: 'Complete guide to outsourced accounting services for small businesses in the US. Learn what\'s included, average costs, and how to choose the right outsourced accounting firm.',
    keywords: 'outsourced accounting services, outsourced accounting for small business, outsourced bookkeeping USA, accounting outsourcing services',
    body: `
      <h2>Why I Think Most Small Businesses Wait Way Too Long to Outsource Their Accounting</h2>
      <p>In 8-plus years of this work, I've seen the same pattern repeat itself. The owner handles the books themselves. Gets overwhelmed. Hires a part-time bookkeeper through a referral. That bookkeeper gets behind. Tax season becomes a disaster. The owner finally calls someone like me — usually in a panic, usually with 18 months of messy books to untangle.</p>
      <p>One of the most damaging patterns I see: a business — sometimes a multi-location retailer, sometimes a service firm — comes to me after their bookkeeper had been miscategorizing cost of goods sold as operating expenses for an extended period. The reported profit margins looked strong. The actual margins? Half of what ownership thought. Expansion decisions had been made based on completely wrong numbers. That's not a bookkeeping problem. That's a business problem — and it's far more common than most owners realize.</p>
      <h2>What Outsourced Accounting Actually Covers</h2>
      <p>People hear "outsourced accounting" and think someone will just reconcile their bank statements. That's bookkeeping. Real outsourced accounting is a full finance function operating on your behalf:</p>
      <ul>
        <li><strong>Bookkeeping:</strong> Categorizing transactions, reconciling accounts, keeping everything clean every month</li>
        <li><strong>Monthly Close:</strong> Closing the books on schedule and producing accurate P&L, balance sheet, and cash flow statements</li>
        <li><strong>Accounts Payable and Receivable:</strong> Managing vendor payments and customer invoicing so nothing slips</li>
        <li><strong>Payroll Processing:</strong> Running payroll, handling tax deposits, filing quarterly and annual returns</li>
        <li><strong>Tax Compliance:</strong> Coordinating your federal and state business tax filings with clean, organized financials</li>
        <li><strong>CFO Advisory:</strong> Cash flow forecasting, budgeting, variance analysis, and strategic financial guidance</li>
      </ul>
      <h2>The Honest Cost Breakdown</h2>
      <p>I get asked about pricing constantly, so let me give you real numbers. These reflect what you'll actually encounter in the market:</p>
      <ul>
        <li><strong>Basic bookkeeping only:</strong> $300–$800/month — fine for simple operations with low transaction volume</li>
        <li><strong>Full accounting with monthly close and statements:</strong> $800–$2,500/month</li>
        <li><strong>Full accounting plus fractional CFO advisory:</strong> $1,500–$5,000/month</li>
        <li><strong>Enterprise-level with multiple entities and a dedicated CFO:</strong> $5,000 and up</li>
      </ul>
      <h2>The In-House Math Doesn't Add Up the Way Owners Think</h2>
      <p>A mid-level staff accountant costs $70,000–$90,000 in base salary. Add 30% for benefits, payroll taxes, and HR overhead — now you're at $95,000 to $120,000 per year for one generalist who handles whatever lands on their desk. With outsourcing, that same budget gets you a team of specialists: a bookkeeper, a senior accountant, a tax professional, and CFO-level oversight. That's a qualitatively different setup.</p>
      <h2>What to Look For When Choosing a Firm</h2>
      <p>Most accountants won't tell you this, but the biggest differentiator isn't price — it's whether the firm has real industry experience in your sector. A firm that's great with e-commerce but has never touched a construction company will get your construction books wrong. Ask specifically:</p>
      <ul>
        <li>Do they specialize in US GAAP, or just data entry?</li>
        <li>Have they worked with businesses in your specific industry?</li>
        <li>Will you have a dedicated account manager, or does your work rotate through a pool?</li>
        <li>Are contracts month-to-month, or are you locking in for a year?</li>
        <li>Do they integrate with your existing software — QuickBooks, Xero, whatever you're using?</li>
      </ul>
      <p>Those questions will tell you everything you need to know. <a href="/contact-us">Book a free consultation</a> with us and I'll give you a straight answer on whether we're the right fit — no sales pressure.</p>
    `
  },
  {
    slug: 'construction-accounting-services-for-contractors',
    title: 'Construction Accounting Services: What Every Contractor Needs to Know',
    category: 'Construction',
    date: 'May 5, 2026',
    readTime: '7 min read',
    excerpt: 'General accountants often get construction wrong. Here\'s what specialized construction accounting actually covers — and why it matters for your profitability.',
    icon: 'fa-hard-hat',
    metaDescription: 'Specialized construction accounting services for US contractors and builders. Job costing, WIP reporting, AIA billing, retainage tracking, and more. Learn what you\'re missing.',
    keywords: 'construction accounting services, construction bookkeeping, job costing for contractors, WIP reporting, AIA billing services, outsourced construction accounting',
    body: `
      <h2>Most General Accountants Get Construction Wrong — And It Costs Contractors Dearly</h2>
      <p>I've reviewed the books for a significant number of contractors over the years. One of the most common things I see is a perfectly competent general accountant who simply doesn't understand construction. They're not bad at their job. Construction is just a different animal. Long-term contracts, project-based revenue, retainage, AIA billing, WIP schedules — none of that exists in a typical small business accounting setup. And when it's handled wrong, the financial statements are misleading at best and dangerous at worst.</p>
      <p>A situation I encounter more than once a year: a commercial contractor switches to us after their previous accountant had been booking all retainage as earned revenue the moment it was billed. The income statement looked fantastic. But when a bonding agent reviewed the WIP schedule, the numbers didn't hold up. The result is a multi-month restatement process — and a shaken relationship with the surety. That's the kind of damage a well-meaning but underqualified accountant can cause in construction specifically.</p>
      <h2>What Real Construction Accounting Covers</h2>
      <h3>Job Costing Done Right</h3>
      <p>Job costing is tracking every dollar — labor, materials, subcontractors, equipment, allocated overhead — against each individual project in real time. Not at the end of the job. In real time, while you can still act on it. Most of the contractors I work with were only getting a job cost summary after the job was closed. By then, it's just a post-mortem.</p>
      <h3>WIP Schedule Preparation</h3>
      <p>The WIP schedule is the single most important financial report in construction. It shows earned revenue versus billed revenue on every active job, calculating overbillings and underbillings accurately. Your surety requires it. Your bank wants it for your line of credit. If you can't produce one on demand, you're not financially credible in this industry. Period.</p>
      <h3>AIA G702/G703 Billing</h3>
      <p>Commercial owners and GCs expect AIA-formatted payment applications. A properly prepared G702/G703 with an accurate schedule of values, correct percentage completion figures, and clean retainage tracking gets you paid faster and with fewer disputes. Sloppy billing is one of the easiest ways to create payment conflicts on a job.</p>
      <h3>Retainage Tracking</h3>
      <p>Untracked retainage is one of the biggest cash flow leaks I see in construction. I've worked with contractors who had $400,000 or more in collectible retainage sitting on old closed jobs that nobody had followed up on. That's not a small number. Retainage needs to be tracked by project, by contract, and by due date.</p>
      <h3>Lien Waiver Management</h3>
      <p>Missing or incorrect lien waivers are a top reason payments get delayed. Conditional and unconditional lien waivers need to be prepared, tracked, and exchanged properly for every payment application. It's administrative, but it protects you legally and keeps cash moving.</p>
      <h3>GAAP Revenue Recognition</h3>
      <p>Percentage of Completion versus Completed Contract — getting this right matters enormously for your financial statements. Lenders, bonding agents, and potential buyers evaluate your business based on GAAP-compliant financials. Using the wrong method doesn't just skew your numbers; it can violate loan covenants or trigger bonding issues.</p>
      <h2>The Software We Use</h2>
      <p>In my experience, most residential and commercial contractors are running QuickBooks Online, QuickBooks Enterprise, Buildertrend, JobTread, or Procore. We work fluently in all of them. We'll meet you where you are — no forced migrations, no unnecessary switching costs.</p>
    `
  },
  {
    slug: 'job-costing-for-contractors',
    title: '5 Signs Your Construction Business Needs Better Job Costing',
    category: 'Construction',
    date: 'April 22, 2026',
    readTime: '5 min read',
    excerpt: 'If you don\'t know which jobs made money until months after they\'re done, your job costing is broken. Here\'s how to fix it.',
    icon: 'fa-calculator',
    metaDescription: 'Is your construction business losing money on jobs without knowing it? Here are 5 signs your job costing is broken — and how to fix it.',
    keywords: 'job costing for contractors, construction job costing, project cost tracking, construction profitability',
    body: `
      <h2>I'll Tell You Exactly What Broken Job Costing Looks Like — Because I've Seen It Consistently</h2>
      <p>In my 8+ years of working with contractors, I've reviewed job cost reports across residential builders, commercial GCs, specialty subs, and everyone in between. Here's what I know for certain: the majority of contractors I meet for the first time don't have reliable job costing. They have something that looks like job costing. It's not the same thing.</p>
      <p>Profit in construction is made or lost at the project level. Your company P&L doesn't tell you which jobs are profitable. It tells you if the whole business is profitable — and only after the fact. Real job costing tells you, while the project is in progress, whether you're on budget or heading off a cliff.</p>
      <h2>Sign #1: You Can't Explain Why Some Jobs Are More Profitable Than Others</h2>
      <p>I ask this question on almost every first call with a new contractor client: "Tell me why your last three jobs had different margins." If the answer is "I'm not really sure" — that's broken job costing. You should be able to point to specific line items. Labor overrun on framing. Material costs spiked. Sub came in $30K over estimate. If you can't explain the variance, you can't prevent it next time.</p>
      <h2>Sign #2: You Find Out a Job Lost Money After It's Done</h2>
      <p>A pattern I see regularly: a contractor is consistently winning bids and staying busy, but despite a full schedule, there's almost no cash at the end of the month. When we dig into the numbers, several recent jobs had lost money — and nobody knew until we ran the job cost analysis after close-out. At that point, all you can do is learn from it. Real-time job costing catches overruns while you still have leverage to act.</p>
      <h2>Sign #3: Your Estimates Are Based on Feel, Not History</h2>
      <p>Good estimating is built on historical job cost data. If you don't have reliable job cost records, your estimates are educated guesses at best. You're either leaving margin on the table by bidding too high, or you're winning jobs you'll lose money on. Neither is a business model.</p>
      <h2>Sign #4: Your Costs Are Miscoded in the Books</h2>
      <p>Most accountants who don't specialize in construction code costs by vendor, not by cost type and job. That means subcontractor labor gets lumped with material costs, equipment rental disappears into overhead, and your job cost reports are meaningless. I've seen this exact problem at firms with $15M in revenue still running on a general accountant who "gets the basics." The basics aren't enough here.</p>
      <h2>Sign #5: You Have No WIP Schedule</h2>
      <p>If your bonding agent or SBA lender asks for a WIP schedule and you don't have one, that conversation ends badly. The WIP schedule is the credibility document in construction finance. Not having it tells sophisticated counterparties that your financial controls are weak. That affects your bonding capacity, your credit terms, and frankly your reputation in the industry. Build the habit now — not when you need it.</p>
      <p>If any of these five signs describe your business, the good news is all of it is fixable. <a href="/contact-us">Reach out to us</a> and I'll tell you exactly what it takes to get your job costing to where it should be.</p>
    `
  },
  {
    slug: 'wip-reporting-guide',
    title: 'The Complete Guide to WIP Reporting for Contractors',
    category: 'Construction',
    date: 'April 10, 2026',
    readTime: '7 min read',
    excerpt: 'Your WIP schedule is the most important financial report in construction. Here\'s what it is, why it matters, and how to get it right.',
    icon: 'fa-table',
    metaDescription: 'Complete guide to WIP (Work-In-Progress) reporting for construction contractors. Learn about overbillings, underbillings, revenue recognition, and how to prepare a WIP schedule.',
    keywords: 'WIP reporting, WIP schedule construction, work in progress construction accounting, construction revenue recognition',
    body: `
      <h2>The WIP Schedule Is the Most Misunderstood Report in Construction Finance</h2>
      <p>I've prepared and reviewed WIP schedules throughout my career in construction accounting. And I can tell you that the majority of contractors either don't produce one at all, or produce one that's wrong in ways they don't realize. That's a problem — because this report is how the most important people in your financial life evaluate your business.</p>
      <p>Your surety uses it to determine your bonding capacity. Your bank uses it to assess your line of credit. If you're ever planning to sell the business, a buyer's accountant will scrutinize it heavily. Getting it right isn't optional. It's foundational.</p>
      <h2>What a WIP Schedule Actually Shows</h2>
      <p>A Work-In-Progress schedule calculates how much revenue you've <em>earned</em> on each active job based on actual completion — not how much you've billed, not how much you've collected. Those three numbers are almost never the same, and the differences between them tell the real story of your financial position.</p>
      <p>For each job, the schedule calculates: total contract value, total estimated costs, costs incurred to date, percentage complete, earned revenue to date, total billed to date, and the resulting overbilling or underbilling. Every line feeds into your balance sheet and income statement under GAAP accounting.</p>
      <h2>Overbilling: Why It Looks Like a Win But Isn't</h2>
      <p>When you've billed more than you've earned based on completion, that excess is a liability called "billings in excess of costs." I've talked to contractors who thought a large overbilling balance meant they were ahead. It means the opposite — you've received cash for work you haven't done yet. You owe that performance. It's a future obligation sitting on your balance sheet, and sophisticated lenders and sureties see it immediately.</p>
      <h2>Underbilling: The Hidden Asset Most Contractors Miss</h2>
      <p>When you've earned more revenue than you've billed, that difference is an asset called "costs in excess of billings." A situation I encounter regularly: a subcontractor has significant underbillings sitting unrecognized because billing applications have fallen behind. The balance sheet looks weaker than the true business position. The banker gets nervous. Once we clean up the WIP schedule and submit the overdue applications, the financial picture looks completely different — accurately reflecting the work that's actually been performed. That kind of correction changes how lenders and sureties view the business.</p>
      <h2>The Two Revenue Recognition Methods You Need to Understand</h2>
      <ul>
        <li><strong>Percentage of Completion:</strong> Revenue recognized progressively as the project advances. This is the standard method for long-term contracts and what most commercial lenders and sureties expect to see. It gives you the most accurate picture of financial position at any point in time.</li>
        <li><strong>Completed Contract:</strong> Revenue recognized only when the entire job is finished. Simpler to track, but it creates lumpy financial statements that are harder for lenders to interpret and can obscure how well the business is actually doing during active construction periods.</li>
      </ul>
      <h2>Common WIP Schedule Mistakes I See Constantly</h2>
      <p>Using cost-to-complete estimates that are too optimistic. Forgetting to include change orders in the contract value. Mixing completed jobs into active job calculations. Using billings as a proxy for percentage complete instead of calculating actual cost incurred over total estimated cost. Any one of these errors produces a WIP schedule that tells the wrong story — and the people reviewing it will often catch it before you do.</p>
      <p>If you don't have a clean, current WIP schedule — or you're not sure if yours is accurate — <a href="/contact-us">let's talk</a>. This is fixable, and getting it right changes how every key stakeholder views your business.</p>
    `
  },
  {
    slug: 'cash-flow-forecasting-guide',
    title: 'Cash Flow Forecasting for Small Businesses: A Practical Guide',
    category: 'Business Finance',
    date: 'March 14, 2026',
    readTime: '6 min read',
    excerpt: 'Running out of cash is the #1 reason businesses fail — even profitable ones. Here\'s how to build a cash flow forecast that keeps you safe.',
    icon: 'fa-chart-area',
    metaDescription: 'Learn how to build a cash flow forecast for your small business. 13-week rolling forecast, annual cash flow budget, and warning signs to watch — practical guide for US business owners.',
    keywords: 'cash flow forecasting small business, 13 week cash flow forecast, business cash flow management, cash flow planning',
    body: `
      <h2>Profitable Businesses Go Bankrupt. I've Watched It Happen.</h2>
      <p>Profit and cash are not the same thing. Every experienced accountant knows this, but most business owners don't fully believe it until they're staring at a bank balance that can't cover payroll while their P&L shows a healthy net income. I've seen it happen to businesses at various revenue levels — growing fast, looking successful from the outside, and running dangerously low on cash.</p>
      <p>A scenario I've worked through more than once: a contractor is profitable year after year, then lands their biggest contract ever. They front-load materials, pay subs, and staff up before any billing comes in. Collections from the GC run 60 to 90 days. By month three, they can't make payroll without drawing down their entire line of credit. When I build the 13-week forecast retroactively, the shortfall is completely predictable. If the model had been in place beforehand, we would have arranged additional credit six months earlier. That's the difference between reacting to a cash crisis and preventing one.</p>
      <h2>What a 13-Week Cash Flow Forecast Actually Is</h2>
      <p>It's a week-by-week model showing every dollar coming in and every dollar going out for the next 91 days. Not categories. Not estimates. Specific transactions tied to specific weeks — when a customer pays, when payroll runs, when that quarterly insurance premium hits. The point is to see shortfalls 30, 60, or 90 days before they happen — when you still have time to act.</p>
      <h2>What Goes Into Building One</h2>
      <ul>
        <li>Your accounts receivable aging report and realistic collection date estimates by customer</li>
        <li>Your accounts payable schedule and the payment terms with each vendor</li>
        <li>Payroll dates and amounts, including employer tax deposits</li>
        <li>All known fixed payments — rent, loan principal and interest, insurance, subscriptions</li>
        <li>Expected new billings based on your job backlog and billing schedule</li>
        <li>Any capital expenditures or large one-time payments planned in the window</li>
      </ul>
      <h2>The Warning Signs That Tell Me a Business Needs This Yesterday</h2>
      <p>I'll be direct about what I watch for with new clients:</p>
      <ul>
        <li>Days Sales Outstanding creeping up month over month — customers are paying slower and nobody is tracking it</li>
        <li>Operating cash flow consistently running below net income — there's a cash drain somewhere in the working capital cycle</li>
        <li>Regularly drawing on the line of credit to cover payroll — that's a structural cash flow problem, not a timing issue</li>
        <li>No cash reserve of any kind — one bad month or one slow-paying customer triggers a crisis</li>
        <li>Financial decisions made based on bank balance, not a forward-looking forecast</li>
      </ul>
      <h2>The Annual Cash Budget vs. the 13-Week Rolling Forecast</h2>
      <p>These serve different purposes. The annual cash budget is strategic — it shows you the expected cash flow shape of the entire year and helps with major decisions. The 13-week rolling forecast is operational — it's updated every week and is your early warning system. You need both. Most small businesses have neither.</p>
      <p>If you don't have a cash flow forecast and you're running a business of any meaningful size, that's the first thing I'd build with you. <a href="/contact-us">Let's talk about what that looks like for your specific situation.</a></p>
    `
  },
  {
    slug: 'aia-billing-explained',
    title: 'AIA Billing Explained: G702 and G703 Forms for Contractors',
    category: 'Construction',
    date: 'February 27, 2026',
    readTime: '5 min read',
    excerpt: 'AIA billing is the standard payment format for commercial construction. Here\'s exactly how G702 and G703 forms work.',
    icon: 'fa-file-invoice',
    metaDescription: 'AIA G702 and G703 billing forms explained for construction contractors. Learn how AIA billing works, common mistakes that delay payment, and how to prepare accurate pay applications.',
    keywords: 'AIA billing, AIA G702 G703, construction pay application, AIA billing for contractors, schedule of values construction',
    body: `
      <h2>AIA Billing Gets You Paid — When It's Done Right</h2>
      <p>If you work on commercial projects — whether you're a GC, a sub, or an owner's rep — AIA billing is the language of getting paid. The G702 and G703 forms are the industry standard for a reason: they create a clear, auditable record of what work has been completed, what materials are on site, what's been billed previously, and what's owed now. When done correctly, they speed up payment and prevent disputes. When done sloppily, they hand the owner or GC an excuse to hold your money.</p>
      <p>A situation I encounter regularly: a subcontractor is consistently waiting 60, 75, even 90 days for payment on a contract with Net 30 terms. When I review the pay applications, I find the same issues — a front-loaded schedule of values, percentage complete figures that are inconsistent from period to period, and missing conditional lien waivers on several submissions. The owner's rep has been rejecting applications and requesting resubmittals, and the contractor doesn't fully understand why. Rebuilding the billing process from the ground up — getting the schedule of values right, applying completion percentages consistently, tracking lien waivers properly — typically brings collection time down significantly.</p>
      <h2>The G702 — Application for Payment (The Cover Sheet)</h2>
      <p>The G702 is the summary document. It shows the total original contract sum, all approved change orders and their cumulative total, total work completed to date including stored materials, retainage percentage and dollar amount being held, total previously certified, and the net amount due for the current period. Every number on this sheet has to be accurate and has to tie exactly to the G703 detail below it. A single math error here is enough to get the whole application kicked back.</p>
      <h2>The G703 — Schedule of Values (The Detail)</h2>
      <p>The G703 is where all the work happens. It lists every line item in the contract — site work, foundation, structural steel, framing, MEP rough-in, finishes, and so on — with the scheduled value for each, the percentage complete this period, the percentage complete cumulatively, materials stored on site, and the dollar amount earned this application. A well-constructed schedule of values makes the story of the project's progress completely transparent. A poorly constructed one invites scrutiny and disputes.</p>
      <h2>The Mistakes That Actually Delay Payment</h2>
      <p>I want to be specific here because vague advice doesn't help anyone:</p>
      <ul>
        <li><strong>Front-loading the schedule of values:</strong> Assigning more value to early-phase items than they actually represent so you can bill heavily upfront. Experienced owners' reps catch this immediately, and it destroys your credibility for the rest of the project.</li>
        <li><strong>Inconsistent percentage complete figures:</strong> If framing is at 60% complete this month and 55% complete next month, you're going to get questions. Completion percentages should reflect actual field progress, tracked consistently.</li>
        <li><strong>Missing or incorrect lien waivers:</strong> Most commercial contracts require a conditional lien waiver from you — and from your major subs and material suppliers — with every pay application. Missing even one can hold up the entire payment.</li>
        <li><strong>Math errors that prevent G702 and G703 from tying out:</strong> The totals have to balance. This sounds obvious, but I've reviewed applications from contractors billing seven figures who had arithmetic errors causing the documents not to reconcile. Build a spreadsheet that does the math automatically — don't rely on manual entry.</li>
        <li><strong>Not tracking approved change orders properly:</strong> Change orders need to be incorporated into the contract value on the G702 and added as line items on the G703. Billing for change order work before it's formally approved is another common dispute trigger.</li>
      </ul>
      <p>AIA billing is a skill. Done well, it's a cash flow management tool. If you want a second set of eyes on your current process — or you need help setting up a billing system from scratch — <a href="/contact-us">reach out</a>. It's one of the highest-leverage things we help contractors improve.</p>
    `
  },
  {
    slug: 'fractional-cfo-cost-guide',
    title: 'Fractional CFO Cost: What to Expect to Pay in 2026',
    category: 'CFO Insights',
    date: 'May 15, 2026',
    readTime: '5 min read',
    excerpt: 'How much does a fractional CFO actually cost? We break down pricing models, what affects the rate, and how to evaluate if it\'s worth it for your business.',
    icon: 'fa-dollar-sign',
    metaDescription: 'How much does a fractional CFO cost in 2026? Breakdown of fractional CFO pricing models, hourly rates vs. monthly retainers, and how to know if it\'s worth the investment.',
    keywords: 'fractional CFO cost, fractional CFO pricing, how much does a fractional CFO cost, fractional CFO rates 2026',
    body: `
      <h2>Here's What a Fractional CFO Actually Costs in 2026 — No Vague Ranges</h2>
      <p>Every business owner I talk to wants a straight answer on price. I respect that, so I'll give you one. In my 8+ years in this business — having structured and advised on engagements across a range of industries — I can tell you what the market looks like right now, and more importantly, what actually drives the cost up or down.</p>
      <p>First, the honest caveat: pricing varies significantly based on your industry, business complexity, and what you actually need done. A $3M e-commerce company that needs monthly financial reporting is a very different engagement from a $12M multi-entity construction company that needs WIP reporting, cash flow modeling, and bank covenant monitoring. Anyone quoting you a single number without understanding your situation is guessing.</p>
      <h2>The Three Main Pricing Models</h2>
      <h3>Monthly Retainer — The Standard Approach</h3>
      <p>This is how the majority of fractional CFO firms structure their work, including us. You pay a fixed monthly fee for a defined scope: a set number of hours, specific deliverables, and regular meetings. Predictable for you, predictable for the CFO. In 2026, the typical range is <strong>$1,500 to $6,000 per month</strong> depending on scope and hours. Most growing small businesses land somewhere between $2,000 and $4,000.</p>
      <h3>Hourly Rate — For Project Work</h3>
      <p>Some fractional CFOs — particularly independents — charge by the hour. Experienced CFOs with real industry backgrounds run <strong>$175 to $350 per hour</strong>. Hourly works well for defined projects: building a financial model, preparing for a capital raise, or supporting an audit. For ongoing advisory, it can get expensive fast and creates uncertainty in your monthly spend.</p>
      <h3>Project-Based Flat Fee</h3>
      <p>For specific one-time engagements — fundraising preparation, financial model builds, acquisition analysis, budget creation — a flat project fee is common. Typical range is <strong>$3,000 to $15,000</strong> depending on complexity and timeline. This is a clean structure when the scope is clearly defined upfront.</p>
      <h2>What Actually Drives the Price Higher</h2>
      <ul>
        <li><strong>Business complexity:</strong> Multiple entities, international operations, industry-specific reporting requirements (construction WIP, healthcare revenue cycle, etc.) all add time and expertise requirements</li>
        <li><strong>Hours per month:</strong> A 5-hour monthly engagement looks very different from a 20-hour engagement. Be realistic about what you actually need</li>
        <li><strong>Deliverable complexity:</strong> Monthly board packages with investor reporting, bank covenant monitoring, and detailed variance analysis cost more than basic cash flow oversight</li>
        <li><strong>Firm vs. independent:</strong> A fractional CFO firm typically has more process infrastructure, backup coverage, and consistency — but may cost more than an independent. The question is what risk you're comfortable with</li>
        <li><strong>Cleanup work:</strong> If your books are a mess and need significant catch-up work before meaningful advisory can begin, expect an initial project fee on top of the ongoing retainer</li>
      </ul>
      <h2>The ROI Question — And the Honest Answer</h2>
      <p>I'll be blunt about this because I've seen the numbers across enough engagements to say it with confidence. The salary comparison — $2,500/month fractional versus $300,000/year full-time — is real and it matters. But that's not where most clients actually recover the cost.</p>
      <p>The real ROI is in the decisions. The acquisition that looked good on the surface but had a fatal cash flow assumption nobody modeled out. The pricing structure that was slowly eroding gross margin without anyone noticing. The line of credit negotiation where having clean, forward-looking financials got a significantly better rate. I've seen clients recover the annual cost of a fractional CFO in a single better decision. It happens regularly.</p>
      <p>Most clients I work with find the engagement pays for itself within the first quarter. Not because I'm selling something — because that's what senior financial oversight does when it's applied to a real business with real decisions to make. <a href="/contact-us">Talk to us</a> about your specific situation and I'll give you a straight scope recommendation.</p>
    `
  }
];

// ===== HOME =====
router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Outsourced Accounting & Fractional CFO Services for US Businesses | FinRise Advisors',
    metaDescription: 'FinRise Advisors provides outsourced accounting, bookkeeping, payroll, and fractional CFO services for US small and mid-sized businesses. Save up to 50% vs. in-house. Book a free consultation.',
    keywords: 'outsourced accounting, fractional CFO services, bookkeeping services USA, outsourced CFO, accounting firm USA',
    page: 'home',
    canonicalUrl: 'https://www.finriseadvisors.com/'
  });
});

// ===== ABOUT =====
router.get('/about-us', (req, res) => {
  res.render('pages/about', {
    title: 'About FinRise Advisors | US Outsourced Accounting Experts',
    metaDescription: 'Learn about FinRise Advisors — a dedicated outsourced accounting and fractional CFO firm serving US businesses. US GAAP expertise, dedicated teams, no long-term contracts.',
    keywords: 'FinRise Advisors, about FinRise, outsourced accounting firm USA, accounting advisory firm',
    page: 'about',
    canonicalUrl: 'https://www.finriseadvisors.com/about-us'
  });
});

// ===== SERVICES =====
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: 'Outsourced Accounting, Fractional CFO & Construction Accounting Services | FinRise Advisors',
    metaDescription: 'Full-service outsourced accounting, fractional CFO, bookkeeping, payroll, construction accounting, and tax compliance for US businesses. US GAAP experts. Get a free quote.',
    keywords: 'outsourced accounting services, fractional CFO services, construction accounting, bookkeeping services, payroll services USA, tax compliance',
    page: 'services',
    canonicalUrl: 'https://www.finriseadvisors.com/services'
  });
});

// ===== PRICING =====
router.get('/pricing', (req, res) => {
  res.render('pages/pricing', {
    title: 'Pricing — Outsourced Accounting & CFO Services | FinRise Advisors',
    metaDescription: 'Transparent, flexible pricing for outsourced accounting and fractional CFO services. Starter from $499/month. Growth from $1,499/month. No long-term contracts. Get a custom quote.',
    keywords: 'outsourced accounting pricing, fractional CFO cost, accounting services price, bookkeeping services cost',
    page: 'pricing',
    canonicalUrl: 'https://www.finriseadvisors.com/pricing'
  });
});

// ===== RESOURCES =====
router.get('/resources', (req, res) => {
  res.render('pages/resources', {
    title: 'Free Accounting & Finance Resources for US Businesses | FinRise Advisors',
    metaDescription: 'Free downloadable templates and checklists for US business owners: WIP schedule template, cash flow forecast, job costing checklist, and more. Download now — no signup required.',
    keywords: 'free accounting templates, WIP schedule template, cash flow forecast template, job costing template, construction accounting checklist',
    page: 'resources',
    canonicalUrl: 'https://www.finriseadvisors.com/resources'
  });
});

// ===== BLOG LIST =====
router.get('/blog', (req, res) => {
  res.render('pages/blog', {
    title: 'Accounting & CFO Insights Blog | FinRise Advisors',
    metaDescription: 'Accounting tips, fractional CFO insights, construction finance guides, and cash flow strategies for US business owners. Read the FinRise Advisors blog.',
    keywords: 'accounting blog, CFO insights, construction accounting blog, business finance tips, bookkeeping tips',
    page: 'blog',
    canonicalUrl: 'https://www.finriseadvisors.com/blog',
    posts: blogPosts
  });
});

// ===== BLOG POST =====
router.get('/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (!post) return res.redirect('/blog');
  const related = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  res.render('pages/blog-post', {
    title: `${post.title} | FinRise Advisors`,
    metaDescription: post.metaDescription,
    keywords: post.keywords,
    page: 'blog',
    canonicalUrl: `https://www.finriseadvisors.com/blog/${post.slug}`,
    post,
    related
  });
});

// ===== CONTACT =====
router.get('/contact-us', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact FinRise Advisors | Book a Free Consultation',
    metaDescription: 'Book a free 30-minute consultation with FinRise Advisors. Get expert advice on outsourced accounting, bookkeeping, payroll, or fractional CFO services for your US business.',
    keywords: 'contact FinRise Advisors, book free consultation, outsourced accounting consultation, fractional CFO consultation',
    page: 'contact',
    canonicalUrl: 'https://www.finriseadvisors.com/contact-us'
  });
});

// ===== PRIVACY POLICY =====
router.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy-policy', {
    title: 'Privacy Policy | FinRise Advisors',
    metaDescription: 'Read the FinRise Advisors Privacy Policy — how we collect, use, and protect your information when you visit our website.',
    keywords: 'FinRise Advisors privacy policy',
    page: '',
    canonicalUrl: 'https://www.finriseadvisors.com/privacy-policy'
  });
});

// ===== TERMS OF USE =====
router.get('/terms-of-use', (req, res) => {
  res.render('pages/terms-of-use', {
    title: 'Terms of Use | FinRise Advisors',
    metaDescription: 'Read the FinRise Advisors Terms of Use — the rules and conditions governing your use of our website and services.',
    keywords: 'FinRise Advisors terms of use',
    page: '',
    canonicalUrl: 'https://www.finriseadvisors.com/terms-of-use'
  });
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, company, service, message } = req.body;
  if (Submission) {
    try {
      const ipAddress =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        '';
      await Submission.create({ name, email, phone, company, service, message, source: 'contact', ipAddress });
      console.log('Contact form saved:', { name, email, company, service });
    } catch (err) {
      console.error('Failed to save contact submission:', err.message);
    }
  } else {
    console.log('Contact form (no DB):', { name, email, company, service });
  }
  res.json({ success: true });
});

// ===== SITEMAP.XML =====
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://www.finriseadvisors.com';
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', freq: 'weekly' },
    { url: '/about-us', priority: '0.8', freq: 'monthly' },
    { url: '/services', priority: '0.9', freq: 'weekly' },
    { url: '/pricing', priority: '0.8', freq: 'monthly' },
    { url: '/blog', priority: '0.8', freq: 'daily' },
    { url: '/resources', priority: '0.7', freq: 'monthly' },
    { url: '/contact-us', priority: '0.7', freq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', freq: 'yearly' },
    { url: '/terms-of-use', priority: '0.3', freq: 'yearly' },
  ];

  const blogUrls = blogPosts.map(p => ({
    url: `/blog/${p.slug}`,
    priority: '0.7',
    freq: 'monthly'
  }));

  const allPages = [...staticPages, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

// ===== ROBOTS.TXT =====
router.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Sitemap: https://www.finriseadvisors.com/sitemap.xml`);
});

module.exports = router;
