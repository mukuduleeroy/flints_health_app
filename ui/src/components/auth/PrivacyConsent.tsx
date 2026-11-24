import React, { useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface PrivacyConsentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export function PrivacyConsent({ checked, onChange }: PrivacyConsentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-sage/5 rounded-xl p-4 border border-sage/10">
      <label className="flex items-start space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-sage text-sage focus:ring-sage"
        />
        <div className="flex-1">
          <span className="text-sm text-primary">
            I understand this profile and its data are saved on this device
            only.
          </span>
        </div>
      </label>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-1 text-xs text-sage font-medium mt-2 ml-7 hover:underline"
      >
        <ShieldCheck size={12} />
        <span>What does this mean?</span>
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="overflow-hidden"
          >
            <p className="text-xs text-secondary mt-2 ml-7 leading-relaxed">
              Flints has no backend or AI connection in this version. Your notes
              are not uploaded. Deleting the app or clearing its data may remove
              your profiles and notes. A device password opens an existing local
              profile; it does not create a cloud account.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
