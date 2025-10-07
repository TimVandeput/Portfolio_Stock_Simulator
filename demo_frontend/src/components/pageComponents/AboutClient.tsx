"use client";

import Tabs from "@/components/ui/Tabs";
import DynamicIcon from "@/components/ui/DynamicIcon";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/cards/FeatureCard";
import InfoCard from "@/components/cards/InfoCard";

export default function AboutClient() {
  const aboutTabs = [
    {
      id: "project",
      label: "About the Project",
      content: (
        <div className="space-y-6">
          <SectionHeader icon="briefcase" title="Stock Simulator" />

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
            <p>
              This Stock Simulator is a comprehensive financial application
              designed to provide users with a realistic trading experience
              without the financial risks of real market trading.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <FeatureCard
                icon="trending-up"
                iconColor="text-emerald-500"
                title="Market Data"
                description="Stock price data with 15-minute delays via Finnhub API integration"
              />
              <FeatureCard
                icon="pie-chart"
                iconColor="text-blue-500"
                title="Portfolio Management"
                description="Track your investments, view performance analytics and manage holdings"
              />
              <FeatureCard
                icon="database"
                iconColor="text-amber-500"
                title="Symbol Library"
                description="Curated selection of 50 popular stocks for trading simulation"
              />
              <FeatureCard
                icon="bar-chart"
                iconColor="text-purple-500"
                title="Interactive Charts"
                description="Visual performance tracking and historical data visualization"
              />
            </div>

            <p>
              Built with modern web technologies including Next.js, TypeScript,
              and Tailwind CSS, the application delivers a professional,
              responsive experience across all devices.
            </p>

            <div className="neu-card p-4 rounded-xl bg-blue-50/5 border-l-4 border-l-blue-500 mt-6">
              <h3 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
                <DynamicIcon
                  iconName="info"
                  size={16}
                  className="text-blue-500"
                />
                Demo Application Note
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-justify">
                This application serves as a demonstration of my development
                capabilities. As a portfolio piece, certain technical
                limitations were accepted for budget considerations, including
                the 15-minute data delay from Finnhub and a curated selection of
                50 symbols rather than the full market catalog.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "designer",
      label: "About the Designer",
      content: (
        <div className="space-y-6">
          <SectionHeader icon="user" title="Meet the Developer" />

          <div className="neu-card p-6 rounded-xl border-l-4 border-l-[var(--accent)] mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--accent)]/20">
                <img
                  src="/TimV.jpg"
                  alt="Tim Vandeput"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                    Tim Vandeput
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    Full-Stack Developer & UI/UX Designer
                  </p>
                </div>

                <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed text-justify">
                  <p>
                    Passionate developer with expertise in modern web
                    technologies and a keen eye for design aesthetics. I
                    specialize in creating intuitive user experiences that
                    balance functionality with visual appeal.
                  </p>

                  <p>
                    My approach focuses on building clean, performant
                    applications with attention to detail and user-centered
                    design principles, always striving to deliver solutions that
                    make a positive impact.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      "React",
                      "TypeScript",
                      "Next.js",
                      "Node.js",
                      "UI/UX Design",
                      "Financial Tech",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
            <p>
              This project represents a combination of technical expertise and
              thoughtful design, showcasing modern development practices and
              attention to user experience across all aspects of the
              application.
            </p>

            <p>
              Every component has been carefully crafted to demonstrate both
              technical proficiency and design consistency, reflecting a
              commitment to quality and best practices in web development.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "disclaimer",
      label: "Disclaimer",
      content: (
        <div className="space-y-6">
          <SectionHeader
            icon="alert-triangle"
            title="Important Notice"
            iconColor="rgb(245, 158, 11)"
          />

          <div className="neu-card p-6 rounded-xl border-l-4 border-l-amber-500 bg-amber-50/5 mb-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-3 text-lg">
              Educational Purpose Only
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-justify">
              This stock simulator is designed solely for educational and
              demonstration purposes. It does not constitute financial advice
              and should not be used as the basis for actual investment
              decisions.
            </p>
          </div>

          <div className="space-y-4">
            <InfoCard
              icon="clock"
              iconColor="text-blue-500"
              title="Data Limitations"
              description="Market data is provided by Finnhub with a 15-minute delay. Only 50 curated symbols are available for trading. These limitations were accepted for budget considerations in this demo application."
            />
            <InfoCard
              icon="shield"
              iconColor="text-green-500"
              title="No Financial Risk"
              description="All transactions within this simulator use virtual currency. No real money is involved, and no actual securities are purchased or sold through this application."
            />
            <InfoCard
              icon="book-open"
              iconColor="text-purple-500"
              title="Learning Tool"
              description="This simulator is intended to help users understand basic investment concepts and trading mechanics without financial consequences. Always consult qualified financial advisors for real investment decisions."
            />
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-4 mt-6">
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed text-justify">
              By using this application, you acknowledge that you understand
              this is a simulation and agree to use it responsibly for
              educational purposes only. The developers assume no responsibility
              for any decisions made based on information provided by this
              simulator.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            About
          </h1>
          <p className="text-[var(--text-secondary)]">
            Learn more about this project, its creator, and important
            disclaimers
          </p>
        </div>

        <Tabs tabs={aboutTabs} defaultActiveTab="project" />
      </div>
    </div>
  );
}
