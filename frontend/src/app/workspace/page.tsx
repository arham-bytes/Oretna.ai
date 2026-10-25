'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MainResearchView from '@/components/MainResearchView';
import ChatThreadView from '@/components/ChatThreadView';
import OretnaLogo from '@/components/OretnaLogo';
import { Conversation, GroupedConversations } from '@/types/chat';

const INITIAL_CONVERSATIONS: GroupedConversations = {
  today: [
    {
      id: 'today-1',
      title: 'Monetary policy transmission in e...',
      fullTitle: 'Monetary policy transmission in emerging markets',
      subtitle: 'Research thread in Macroeconomics & Monetary Policy',
      messages: [
        {
          role: 'user',
          content: 'What are the main channels through which monetary policy shocks transmit in emerging market economies compared to advanced economies?'
        },
        {
          role: 'assistant',
          content: `In emerging market economies (EMEs), the transmission of monetary policy shocks departs significantly from standard textbook New Keynesian models due to financial frictions, exchange rate pass-through, and sovereign risk premia.\n\nKey transmission channels include:\n1. **The Exchange Rate Channel**: Often dominant in EMEs. Policy rate shifts induce currency appreciation or depreciation, directly shifting import prices and balance sheet values for dollar-denominated debt (original sin).\n2. **The Bank Lending Channel**: Highly active due to heavy bank dependency and less developed local corporate bond markets.\n3. **The Risk Premium Channel**: Unconventional tightening often impacts domestic sovereign yields via capital flow volatility and global risk appetite (VIX sensitivity).`,
          sources: [
            { title: 'Obstfeld & Rogoff (2002) - Global Transmission', year: '2002', url: '#' },
            { title: 'BIS Paper No. 110 - Monetary policy in EMEs', year: '2021', url: '#' },
            { title: 'Rey (2015) - Dilemma not Trilemma', year: '2015', url: '#' }
          ],
          keyFindings: [
            'Exchange rate fluctuations exert outsized real economy effects relative to domestic interest rate channels in open EMEs.',
            'Foreign currency liability exposure amplifies contractionary shocks through collateral valuation impairment.'
          ]
        }
      ]
    },
    {
      id: 'today-2',
      title: 'Staggered difference-in-differences',
      fullTitle: 'Staggered difference-in-differences estimators and event studies',
      subtitle: 'Research thread in Econometrics & Causal Inference',
      messages: [
        {
          role: 'user',
          content: 'Why does traditional two-way fixed effects (TWFE) fail under staggered treatment adoption with heterogeneous effects?'
        },
        {
          role: 'assistant',
          content: `When treatment adoption is staggered over time and treatment effects vary across cohorts or dynamically over time, the standard Two-Way Fixed Effects (TWFE) estimator produces biased and potentially negative-weighted average treatment effects.\n\nThis occurs because already-treated units act as effective control units for later-treated units, subtracting earlier dynamic treatment effects from recent adopters.\n\nModern robust alternatives include:\n- **Callaway & Sant’Anna (2021)**: Group-time average treatment effects estimator.\n- **Sun & Abraham (2021)**: Interaction-weighted estimator for event studies.\n- **Goodman-Bacon (2021)**: Variance-weighted decomposition of TWFE into 2x2 DiD comparisons.`,
          sources: [
            { title: 'Goodman-Bacon - Difference-in-differences with variation in treatment timing', year: '2021', url: '#' },
            { title: 'Callaway & Sant’Anna - Difference-in-Differences with Multiple Time Periods', year: '2021', url: '#' }
          ],
          keyFindings: [
            'Negative weights in TWFE can invert estimated sign even when all unit effects are strictly positive.',
            'Cohort-specific estimators prevent forbidden comparisons between already-treated units.'
          ]
        }
      ]
    },
    {
      id: 'today-3',
      title: 'Loss aversion: evidence and critiq...',
      fullTitle: 'Loss aversion: empirical evidence and contemporary critiques',
      subtitle: 'Research thread in Behavioral Economics',
      messages: [
        {
          role: 'user',
          content: 'Summarize the core empirical debates surrounding loss aversion in contemporary behavioral decision research.'
        },
        {
          role: 'assistant',
          content: `While Kahneman & Tversky (1979) established loss aversion as a cornerstone of Prospect Theory (with a typical lambda ~ 1.5 - 2.5), recent replication efforts and cognitive modeling debate its universal validity.\n\nKey nuances under empirical scrutiny include:\n- **Inattention vs True Loss Aversion**: Gal & Rucker (2018) argue inertia and status quo bias can explain observed resistance to change without invoking asymmetric utility loss.\n- **Stakes Dependence**: In high-stakes natural experiments (e.g., game shows, housing market losses), loss aversion holds firmly, but lab lottery choices often show weaker or state-dependent effects.`,
          sources: [
            { title: 'Kahneman & Tversky - Prospect Theory: Decision under Risk', year: '1979', url: '#' },
            { title: 'Gal & Rucker - The Loss of Loss Aversion', year: '2018', url: '#' }
          ]
        }
      ]
    }
  ],
  yesterday: [
    {
      id: 'yest-1',
      title: 'Interpreting a p-value without over...',
      fullTitle: 'Interpreting a p-value without overstating evidence',
      subtitle: 'Research thread in Applied Statistics',
      messages: [
        {
          role: 'user',
          content: 'How should researchers accurately interpret a p-value of 0.04 without overstating evidentiary strength?'
        },
        {
          role: 'assistant',
          content: `A p-value of 0.04 indicates that, under the assumption that the null hypothesis is strictly true, the probability of observing test statistics as extreme as or more extreme than the observed data is 4%.\n\nImportantly:\n- It does not represent the probability that the null hypothesis is true.\n- According to Bayesian calibration (Sellke, Bayarri, Berger 2001), a p-value of 0.04 corresponds to a minimum false positive risk of roughly 26% to 29% under a 50% prior probability.\n- Always present effect sizes and confidence intervals alongside significance tests.`,
          sources: [
            { title: 'Wasserstein & Lazar - ASA Statement on P-Values', year: '2016', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'yest-2',
      title: 'Central bank digital currencies (CB...',
      fullTitle: 'Central bank digital currencies: architecture and financial stability',
      subtitle: 'Research thread in Monetary Policy',
      messages: [
        {
          role: 'user',
          content: 'What are the main financial stability risks associated with retail CBDCs?'
        },
        {
          role: 'assistant',
          content: `The primary systemic risks of retail CBDCs involve disintermediation of commercial banks and the potential acceleration of digital bank runs during crises.\n\nMitigation strategies analyzed in recent central bank pilot studies include:\n- Tiered remuneration caps on interest-bearing CBDC holdings.\n- Hard holding limits for individual accounts.\n- Two-tiered distribution architectures where commercial banks continue to handle customer onboarding and payment processing.`,
          sources: [
            { title: 'ECB Occasional Paper - The digital euro and financial stability', year: '2022', url: '#' },
            { title: 'Federal Reserve Board - Money and Payments in the Digital Age', year: '2022', url: '#' }
          ]
        }
      ]
    }
  ],
  previous: [
    {
      id: 'prev-1',
      title: 'Structural VAR identification with...',
      fullTitle: 'Structural VAR identification with sign restrictions',
      subtitle: 'Research thread in Macroeconometrics',
      messages: [
        {
          role: 'user',
          content: 'Explain the advantages and pitfalls of sign restrictions in SVAR models.'
        },
        {
          role: 'assistant',
          content: `Sign restrictions allow economists to identify structural shocks without imposing controversial zero restrictions.\n\nHowever, Baumeister & Hamilton (2015) demonstrate that uniform Haar priors on rotation matrices inadvertently place informative implicit priors on impulse response functions, necessitating Bayesian sign restriction techniques with explicit structural priors.`,
          sources: [
            { title: 'Uhlig (2005) - What are the effects of monetary policy on output?', year: '2005', url: '#' },
            { title: 'Baumeister & Hamilton (2015) - Sign Restrictions in SVARs', year: '2015', url: '#' }
          ]
        }
      ]
    },
    {
      id: 'prev-2',
      title: 'Synthetic control methods in policy...',
      fullTitle: 'Synthetic control methods in policy evaluation',
      subtitle: 'Research thread in Econometrics',
      messages: [
        {
          role: 'user',
          content: 'When is Synthetic Control preferred over Difference-in-Differences?'
        },
        {
          role: 'assistant',
          content: `Synthetic Control (Abadie et al.) is preferred when there is a single treated aggregate unit (e.g., country, state) and standard parallel trends assumption in DiD is implausible due to idiosyncratic pre-treatment trends.`,
          sources: [
            { title: 'Abadie, Diamond & Hainmueller (2010) - Synthetic Control Methods', year: '2010', url: '#' }
          ]
        }
      ]
    }
  ]
};

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [accessChecking, setAccessChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [conversations, setConversations] = useState<GroupedConversations>(INITIAL_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Enforce pre-launch restriction: Nobody can access the chatbox
  useEffect(() => {
    async function verifyAccess() {
      try {
        const res = await fetch('/api/survey/status');
        if (res.status === 401) {
          router.replace('/login?redirect=/onboarding/survey');
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/login?redirect=/onboarding/survey');
          return;
        }
        if (!data.surveyCompleted) {
          router.replace('/onboarding/survey');
          return;
        }
        // Even verified users cannot access the chatbox in pre-launch
        router.replace('/onboarding/thank-you');
      } catch (err) {
        router.replace('/onboarding/survey');
      }
    }
    verifyAccess();
  }, [router]);

  const handleSelectChat = (chat: Conversation) => {
    setActiveChat(chat);
  };

  const handleNewChat = () => {
    setActiveChat(null);
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && !activeChat && isAuthorized) {
      handleSendMessage(query);
    }
  }, [searchParams, isAuthorized]);

  const handleSendMessage = (payload: { text: string; file: File | null } | string) => {
    const text = typeof payload === 'string' ? payload : payload.text;
    const file = typeof payload === 'string' ? null : payload.file;

    const newChatId = `chat-${Date.now()}`;
    const truncatedTitle = text.length > 34 ? text.slice(0, 34) + '...' : text;

    const newChat: Conversation = {
      id: newChatId,
      title: truncatedTitle,
      fullTitle: text,
      subtitle: 'Research thread in your workspace',
      messages: [
        {
          role: 'user',
          content: text,
          file: file ? file.name : null,
        },
        {
          role: 'assistant',
          content: `Synthesizing current academic literature and empirical data for: "${text}"...\n\nBased on peer-reviewed findings and cross-disciplinary analyses:\n1. Core theoretical foundations indicate significant systemic interactions.\n2. Recent empirical studies emphasize nuanced methodological considerations and state-dependent effects.\n3. Quantitative evidence suggests further inquiry into boundary conditions and robustness checks.`,
          sources: [
            { title: 'Journal of Academic Research & Synthesis', year: '2024', url: '#' },
            { title: 'National Bureau of Economic & Scientific Working Papers', year: '2023', url: '#' }
          ],
          keyFindings: [
            'Empirical literature establishes multi-factor causality across cross-sectional cohorts.',
            'Methodological validity hinges upon accurate identification strategy and transparent robustness testing.'
          ]
        }
      ]
    };

    setConversations((prev) => ({
      ...prev,
      today: [newChat, ...prev.today]
    }));

    setActiveChat(newChat);
  };

  const handleSendFollowUp = (text: string) => {
    if (!activeChat) return;

    const updatedChat: Conversation = {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        { role: 'user', content: text },
        {
          role: 'assistant',
          content: `Further probing: "${text}"\n\nCross-referencing primary sources and empirical literature:\n- Identified complementary perspectives across subsequent econometric models.\n- Controlling for confounding factors reaffirms core hypothesis while refining effect magnitudes.`,
          sources: [
            { title: 'Quarterly Review of Empirical Sciences', year: '2024', url: '#' }
          ]
        }
      ]
    };

    setActiveChat(updatedChat);
  };

  if (accessChecking || !isAuthorized) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#FAF9F5] text-[#262628] select-none">
        <OretnaLogo size={28} />
        <div className="mt-5 flex items-center gap-2.5 text-xs text-[#78736B]">
          <div className="w-4 h-4 border-2 border-[#1E1E1E] border-t-transparent rounded-full animate-spin" />
          <span>Verifying access permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white relative">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeChatId={activeChat?.id}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative bg-white overflow-hidden">
        <Header
          activeChat={activeChat}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto relative flex flex-col">
          {activeChat ? (
            <ChatThreadView
              chat={activeChat}
              onSendFollowUp={handleSendFollowUp}
            />
          ) : (
            <MainResearchView onSendMessage={handleSendMessage} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-white text-gray-400">Loading workspace...</div>}>
      <WorkspaceContent />
    </Suspense>
  );
}
