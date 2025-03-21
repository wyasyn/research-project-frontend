import OnboardingFlow from "@/components/onboarding-flow";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-3xl">
        <OnboardingFlow />
      </div>
    </main>
  );
}
