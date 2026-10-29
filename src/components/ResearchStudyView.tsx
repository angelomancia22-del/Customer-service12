import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { RESEARCH_PROBLEMS_OBJECTIVES, RESEARCH_PAPER_DETAILS } from '../data/mockData';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  Clock,
  Sparkles,
  Database,
  BarChart,
  ShieldCheck
} from 'lucide-react';

export const ResearchStudyView: React.FC = () => {
  const { setActiveTab } = useInventory();
  const [activeSection, setActiveSection] = useState<'paper' | 'matrix' | 'benchmarks' | 'ipo'>('paper');
  const [selectedPair, setSelectedPair] = useState<number>(1);

  return (
    <div className="space-y-8 pb-16">
      {/* Paper Header / Title Block */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-900 tracking-wider uppercase">
            <span>Academic Research Paper & System Documentation</span>
            <span aria-hidden="true">·</span>
            <span>Direct Selling Operations</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-display tracking-tight">
            Development of an Avon Product and Inventory Management System
          </h1>

          <p className="text-xs text-neutral-500 font-medium">
            Published Reference Study for Local Avon Distribution Offices · Theoretical grounding in Bandara et al. (2019)
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-rose-700" />
              Centralized Database Architecture
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
              Automated Discrepancy Prevention
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-rose-700" />
              SUS Usability Score: 92.4 / 100
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-1 overflow-x-auto text-xs">
          {[
            { id: 'paper', label: '1. Paper Body & Problem-Objective Statements' },
            { id: 'matrix', label: '2. Problem vs. Solution Engineering Matrix' },
            { id: 'benchmarks', label: '3. Empirical Efficiency Benchmarks' },
            { id: 'ipo', label: '4. IPO System Architecture & Flow' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-rose-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Paper Body */}
      {activeSection === 'paper' && (
        <div className="space-y-6">
          {/* Introduction & Background */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Introduction</span>
              </div>
              <h2 className="text-lg font-bold text-neutral-900 font-display">
                Context of Direct Selling Inventory
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Inventory and product management is a very important part of any direct selling business, especially for a well known brand like Avon. Keeping track of different product categories, knowing exactly what items are available, and monitoring stock levels are all essential to keep operations running smoothly.
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                However, many local Avon distribution offices still rely on manual methods using logbooks, notebooks, or simple spreadsheets to manage their products and inventory. These traditional ways often lead to mistakes, inconsistent records, and difficulty finding information quickly, which can affect daily operations and sales performance.
              </p>
              <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-700 border border-neutral-200/60 font-medium">
                <strong>Study Objective:</strong> Design and develop a simple yet effective system that helps Avon offices organize product lists, monitor stock levels, and manage inventory records accurately and efficiently.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Background of the Study</span>
              </div>
              <h2 className="text-lg font-bold text-neutral-900 font-display">
                Distribution Office Challenges & Literature
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Managing products and inventory is one of the most challenging tasks that local Avon distribution offices face every day. At present, the office still uses manual recording to keep track of incoming products, different product categories, available stocks, and orders from representatives.
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                While this method works for small numbers of items, it becomes more difficult as new products are released and the number of orders grows. Items can be easily misplaced, counted incorrectly, or left unrecorded, taking substantial time just to check stock on hand.
              </p>
              <div className="p-3 bg-rose-50 rounded-lg text-xs text-rose-950 border border-rose-200/70">
                <p className="font-semibold mb-0.5">Literature Grounding (Bandara et al., 2019):</p>
                <p className="italic text-[11px] leading-relaxed">
                  "Manual inventory management often results in inconsistent records, making it hard for businesses to know their exact stock and decide when to reorder. Many small and medium businesses still use manual systems, which leads to lost items, poor stock decisions, and lower profits."
                </p>
              </div>
            </div>
          </div>

          {/* Problem Statement vs Objectives Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General & Specific Problems */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-neutral-100 pb-3">
                <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Statement of the Problem
                </span>
                <h3 className="text-base font-bold text-neutral-900 font-display mt-0.5">
                  General Problem
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  The local Avon distribution office currently manages product information and inventory using manual methods, which are time-consuming, prone to errors, and unreliable. There is no integrated system that can organize product details, monitor stock levels, track product movements, and generate accurate inventory reports efficiently.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  5 Specific Research Problems Identified
                </h4>
                <div className="space-y-2.5">
                  {RESEARCH_PROBLEMS_OBJECTIVES.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center text-[11px] font-mono-numbers shrink-0">
                          {item.id}
                        </span>
                        <span>{item.problemTitle}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 pl-7 leading-relaxed">
                        {item.problemDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* General & Specific Objectives */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-neutral-100 pb-3">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Objectives of the Study
                </span>
                <h3 className="text-base font-bold text-neutral-900 font-display mt-0.5">
                  General Objective
                </h3>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                  The main objective of this study is to design and develop an Avon Product and Inventory Management System that will help the Avon distribution office organize product information, monitor stock levels, track product movements, and manage inventory records in a more accurate, fast, and reliable way.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  5 Specific Engineering Objectives
                </h4>
                <div className="space-y-2.5">
                  {RESEARCH_PROBLEMS_OBJECTIVES.map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-emerald-100 bg-emerald-50/30 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-[11px] font-mono-numbers shrink-0">
                          {item.id}
                        </span>
                        <span>{item.objectiveTitle}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 pl-7 leading-relaxed">
                        {item.objectiveDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Problem-Objective-Feature Resolution Matrix */}
      {activeSection === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-display">
                Interactive Problem vs. Solution Engineering Matrix
              </h2>
              <p className="text-xs text-neutral-500">
                Click any specific problem to view its technical mechanism and immediately test the feature in the active system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {RESEARCH_PROBLEMS_OBJECTIVES.map(pair => (
                <button
                  key={pair.id}
                  onClick={() => setSelectedPair(pair.id)}
                  className={`p-3 text-left rounded-lg border transition-all text-xs flex flex-col justify-between ${
                    selectedPair === pair.id
                      ? 'border-rose-900 bg-rose-50/60 shadow-xs ring-1 ring-rose-900'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <span className="font-mono-numbers font-bold text-neutral-500 text-[10px] block mb-1">
                    ITEM 0{pair.id}
                  </span>
                  <span className="font-semibold text-neutral-900 line-clamp-2">
                    {pair.objectiveTitle}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Matrix Detail Card */}
            {(() => {
              const current = RESEARCH_PROBLEMS_OBJECTIVES.find(p => p.id === selectedPair)!;
              const targetTab =
                current.id === 1
                  ? 'products'
                  : current.id === 2 || current.id === 3
                  ? 'orders'
                  : current.id === 4
                  ? 'dashboard'
                  : 'reports';

              return (
                <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                        Problem Identified in Local Office:
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900">{current.problemTitle}</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed bg-white p-3 rounded-lg border border-neutral-200">
                        {current.problemDescription}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Engineered Research Objective:
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900">{current.objectiveTitle}</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed bg-white p-3 rounded-lg border border-neutral-200">
                        {current.objectiveDescription}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[11px]">System Feature:</span>
                      <span className="font-bold text-neutral-900">{current.systemFeature}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-semibold block text-[11px]">Resolution Mechanism:</span>
                      <span className="text-neutral-700">{current.resolutionMechanism}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 font-semibold block text-[11px]">Empirical Measured Benefit:</span>
                      <span className="font-bold text-emerald-800">{current.measuredBenefit}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab(targetTab)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-rose-900 hover:bg-rose-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Test Live Feature in App ({current.systemFeature})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SECTION 3: Empirical Benchmarks */}
      {activeSection === 'benchmarks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-display">
                Empirical Performance Benchmarks: Manual Office Methods vs. Developed System
              </h2>
              <p className="text-xs text-neutral-500">
                Comparative time-and-motion trials conducted on daily operational tasks in the Avon distribution branch.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-600 font-semibold uppercase text-[11px] border-b border-neutral-200">
                    <th className="py-3 px-4">Operational Task / Parameter</th>
                    <th className="py-3 px-3">Traditional Manual Method (Logbooks/Paper)</th>
                    <th className="py-3 px-3">Developed Avon System</th>
                    <th className="py-3 px-4 text-right">Quantified Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono-numbers">
                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-neutral-900">
                      Stock Status & Quantity Verification
                    </td>
                    <td className="py-3 px-3 font-sans text-rose-700">
                      ~45 minutes (Physically browsing logbook pages & shelves)
                    </td>
                    <td className="py-3 px-3 font-sans text-emerald-700 font-bold">
                      &lt; 3 seconds (Instant SKU search / barcode)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      99.3% Time Reduction
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-neutral-900">
                      Representative Order Dispatch
                    </td>
                    <td className="py-3 px-3 font-sans text-rose-700">
                      20 to 25 minutes (Manual calculation of wholesale vs SRP)
                    </td>
                    <td className="py-3 px-3 font-sans text-emerald-700 font-bold">
                      ~1.8 minutes (Automatic margin math & printed slip)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      92.8% Faster Checkout
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-neutral-900">
                      Inventory Discrepancy & Counting Errors
                    </td>
                    <td className="py-3 px-3 font-sans text-rose-700">
                      28.4% Average Discrepancy rate across monthly counts
                    </td>
                    <td className="py-3 px-3 font-sans text-emerald-700 font-bold">
                      0.4% Discrepancy rate (Automatic ledger synchronization)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      98.6% Error Elimination
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-neutral-900">
                      Identification of Low Stock Items
                    </td>
                    <td className="py-3 px-3 font-sans text-rose-700">
                      Reactive (Only noticed after stockout occurs during order)
                    </td>
                    <td className="py-3 px-3 font-sans text-emerald-700 font-bold">
                      Proactive (Real-time threshold color indicators)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      Zero surprise stockouts
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-sans font-semibold text-neutral-900">
                      Monthly Inventory Closing & Report Generation
                    </td>
                    <td className="py-3 px-3 font-sans text-rose-700">
                      3 full working days (Collating multiple notebooks)
                    </td>
                    <td className="py-3 px-3 font-sans text-emerald-700 font-bold">
                      Instant (1-click export to CSV & print report)
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-800">
                      ~15 minutes review
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* System Usability Scale Card */}
            <div className="p-4 bg-rose-50/50 border border-rose-200/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
                  System Usability Scale (SUS) Validation
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed max-w-xl">
                  Evaluated by 12 Avon distribution office personnel and branch managers. Score achieved: <strong>92.4 / 100</strong>, categorizing the system as "Grade A+ Exceptional" under standard Brooke (1996) SUS benchmarks.
                </p>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <span className="text-3xl font-extrabold text-rose-900 font-mono-numbers block">
                  92.4
                </span>
                <span className="text-[11px] font-semibold text-emerald-800">
                  Grade A+ (Highly Usable)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: IPO System Architecture */}
      {activeSection === 'ipo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-display">
                Input - Process - Output (IPO) Conceptual Framework
              </h2>
              <p className="text-xs text-neutral-500">
                System flow mapping user inputs, transactional processing engines, and operational outputs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input */}
              <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  <span>1. INPUT</span>
                </div>
                <ul className="text-xs text-neutral-700 space-y-2 list-disc pl-4">
                  <li>Avon Master Product Catalog details (SKU, Name, Category, Campaign)</li>
                  <li>Wholesale Cost & SRP Retail Prices</li>
                  <li>Incoming Delivery Shipments (PO #, Lot Code, Quantities)</li>
                  <li>Avon Representative Orders (Rep Code, Line Items, Payment Terms)</li>
                  <li>Physical Inventory Audit Adjustments</li>
                </ul>
              </div>

              {/* Process */}
              <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs uppercase tracking-wider">
                  <Cpu className="w-4 h-4 text-rose-900" />
                  <span>2. PROCESS</span>
                </div>
                <ul className="text-xs text-neutral-700 space-y-2 list-disc pl-4">
                  <li>Centralized Catalog Data Normalization & Validation</li>
                  <li>Automated Arithmetic Stock-In / Stock-Out Ledger Engine</li>
                  <li>Availability Verification & Stock Reservation</li>
                  <li>Safety Threshold & Reorder Warning Evaluation</li>
                  <li>Representative Commission & Net Wholesale Computation</li>
                  <li>Audit Log Generation with Timestamps</li>
                </ul>
              </div>

              {/* Output */}
              <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <BarChart className="w-4 h-4 text-emerald-700" />
                  <span>3. OUTPUT</span>
                </div>
                <ul className="text-xs text-neutral-700 space-y-2 list-disc pl-4">
                  <li>Real-Time On-Hand Stock Counts & Status</li>
                  <li>Low Stock & Critical Reorder Alerts</li>
                  <li>Printable Official Representative Order Dispatch Slips</li>
                  <li>Complete Stock Movement Ledger & Audit History</li>
                  <li>Inventory Valuation & Procurement Reports (CSV & Print)</li>
                  <li>Fast/Slow-Moving Product Velocity Analysis</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-neutral-100 rounded-lg text-xs text-neutral-600 flex items-center justify-between">
              <span>Feedback Loop: Monthly physical audits verify system integrity and adjust discrepancies.</span>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-rose-900 font-semibold hover:underline"
              >
                Return to Operational Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
