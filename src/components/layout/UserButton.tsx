import { UserButton as ClerkUserButton } from "@clerk/nextjs";

export default function UserButton() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ClerkUserButton 
        appearance={{
          elements: {
            userButtonBox: "hover:opacity-80 transition-opacity",
            userButtonTrigger: "focus:shadow-none",
            userButtonPopoverCard: "shadow-xl rounded-xl border border-gray-100",
            userButtonPopoverFooter: "hover:bg-purple-50 transition-colors",
          }
        }}
        afterSignOutUrl="/"
      />
    </div>
  );
} 