import React, { useState, useEffect } from 'react';
import { ThreeDotsLoader } from './ui/ThreeDotsLoader';
import { X, Crown, Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from '../context/AuthContext';
import { useUpgradeModal } from '../context/ModalContext';
import PortalModal from './PortalModal';
import toast from 'react-hot-toast';
import { normalizePlanName } from '../constants/planPolicy';

interface UpgradeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  feature?: string;
  message?: string;
  showOnlyBusiness?: boolean;
}

// Plan tier ordering
const PLAN_TIER: Record<string, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  BUSINESS: 3,
  BUSINESS_TRIAL: 3,
};

interface PlanCard {
  id: string;
  label: string;
  monthlyKey: string;
  yearlyKey: string;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlySaving: string;
  badge: string;
  highlights: string[];
  isPrimary: boolean; // true = black card (flagship), false = blue outline
}

const ALL_PLAN_CARDS: PlanCard[] = [
  {
    id: 'STARTER',
    label: 'Starter',
    monthlyKey: 'STARTER_MONTHLY',
    yearlyKey: 'STARTER_YEARLY',
    monthlyPrice: '299',
    yearlyPrice: '2,990',
    yearlySaving: 'Save 17%',
    badge: 'Entry Plan',
    isPrimary: false,
    highlights: [
      '1,000 links / month',
      '25 dynamic QR codes',
      'Custom slug, password & expiry',
      'Rich link preview',
      '30-day analytics',
    ],
  },
  {
    id: 'PRO',
    label: 'Pro',
    monthlyKey: 'PRO_MONTHLY',
    yearlyKey: 'PRO_YEARLY',
    monthlyPrice: '999',
    yearlyPrice: '9,990',
    yearlySaving: 'Save 17%',
    badge: 'Most Popular',
    isPrimary: true,
    highlights: [
      'Unlimited links',
      '500 dynamic QR + full customisation',
      '2 custom domains',
      'Geo & deep-link routing',
      'Lead lock, trust badge, pixel retargeting',
      '90-day analytics',
    ],
  },
  {
    id: 'BUSINESS',
    label: 'Business',
    monthlyKey: 'BUSINESS_MONTHLY',
    yearlyKey: 'BUSINESS_YEARLY',
    monthlyPrice: '3,499',
    yearlyPrice: '34,990',
    yearlySaving: 'Save 17%',
    badge: 'For Teams',
    isPrimary: false,
    highlights: [
      'Everything in Pro',
      'Unlimited QR + files (2 GB)',
      '10 custom domains, 10 members',
      'White-label, A/B testing, webhooks',
      '1-year analytics + data export',
    ],
  },
];

const UpgradeModal: React.FC<UpgradeModalProps> = (props) => {
  const { user } = useAuth();
  const modal = useUpgradeModal();

  const isOpen = props.isOpen ?? modal.isOpen;
  const onClose = props.onClose ?? modal.close;
  const message = props.message ?? modal.message;
  const showOnlyBusiness = props.showOnlyBusiness ?? modal.showOnlyBusiness;

  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const currentPlan = normalizePlanName(
    (user as any)?.subscriptionPlan || (user as any)?.plan || 'FREE'
  );
  const currentTier = PLAN_TIER[currentPlan] ?? 0;

  const visibleCards = showOnlyBusiness
    ? ALL_PLAN_CARDS.filter((c) => c.id === 'BUSINESS')
    : ALL_PLAN_CARDS.filter((c) => (PLAN_TIER[c.id] ?? 0) > currentTier);

  const nextPlanLabel = visibleCards[0]?.label ?? 'a higher plan';
  const headerSubtitle =
    currentTier === 0
      ? 'Choose a plan to unlock premium features'
      : `You are on ${currentPlan.charAt(0) + currentPlan.slice(1).toLowerCase()} — upgrade to ${nextPlanLabel} for more`;

  useEffect(() => {
    if (isOpen && currentTier >= PLAN_TIER['BUSINESS']) {
      onClose();
    }
  }, [isOpen, currentTier]);

  const handleUpgrade = async (planKey: string, planLabel: string) => {
    if (!user?.id) {
      toast.error('Please log in to upgrade');
      return;
    }
    setIsLoading(planKey);
    try {
      await subscriptionService.initializePayment(planKey, user.id);
      toast.success(`You are now on ${planLabel}!`);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  if (!isOpen) return null;

  const cols =
    visibleCards.length === 1
      ? 'max-w-sm mx-auto'
      : visibleCards.length === 2
        ? 'grid grid-cols-1 md:grid-cols-2'
        : 'grid grid-cols-1 md:grid-cols-3';

  return (
    <PortalModal isOpen={isOpen} onClose={onClose} preventBodyScroll={true}>
      <motion.div
        className="overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl mx-4"
          >
            <div className="p-5 sm:p-7">

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-black rounded-xl text-white">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Upgrade Required</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{headerSubtitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Context message */}
              {message && (
                <p className="text-sm text-gray-600 mb-5 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5">
                  {message}
                </p>
              )}

              {/* Monthly / Yearly toggle */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gray-100 p-1 rounded-lg flex text-sm">
                  <button
                    onClick={() => setIsYearly(false)}
                    className={`px-5 py-1.5 rounded-md font-medium transition-all ${!isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsYearly(true)}
                    className={`px-5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${isYearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Yearly
                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                      Save 17%
                    </span>
                  </button>
                </div>
              </div>

              {/* Cards */}
              {visibleCards.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Crown className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold text-gray-800">You are on the highest plan.</p>
                </div>
              ) : (
                <div className={`${cols} gap-4 mb-6`}>
                  {visibleCards.map((card) => {
                    const planKey = isYearly ? card.yearlyKey : card.monthlyKey;
                    const price = isYearly ? card.yearlyPrice : card.monthlyPrice;
                    const period = isYearly ? 'year' : 'month';
                    const loading = isLoading === planKey;

                    return (
                      <div
                        key={card.id}
                        className={`relative flex flex-col rounded-xl border-2 p-5 transition-all ${card.isPrimary
                            ? 'border-black bg-black text-white'
                            : 'border-blue-600 bg-white text-gray-900'
                          }`}
                      >
                        {/* Badge */}
                        <span
                          className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${card.isPrimary
                              ? 'bg-white text-black'
                              : 'bg-blue-600 text-white'
                            }`}
                        >
                          {card.badge}
                        </span>

                        {/* Plan name + price */}
                        <h4 className="text-base font-bold mb-1">{card.label}</h4>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-3xl font-extrabold">₹{price}</span>
                          <span className={`text-sm ${card.isPrimary ? 'text-gray-300' : 'text-gray-500'}`}>
                            / {period}
                          </span>
                        </div>
                        {isYearly && (
                          <span
                            className={`text-xs font-medium mb-3 ${card.isPrimary ? 'text-blue-300' : 'text-blue-600'
                              }`}
                          >
                            {card.yearlySaving} vs monthly
                          </span>
                        )}

                        {/* Highlights */}
                        <ul className="flex-1 space-y-1.5 mt-3 mb-4">
                          {card.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check
                                className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${card.isPrimary ? 'text-blue-400' : 'text-blue-600'
                                  }`}
                              />
                              <span className={card.isPrimary ? 'text-gray-200' : 'text-gray-700'}>
                                {h}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <button
                          onClick={() => handleUpgrade(planKey, `${card.label} ${isYearly ? 'Yearly' : 'Monthly'}`)}
                          disabled={!!isLoading}
                          className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${card.isPrimary
                              ? 'bg-white text-black hover:bg-gray-100'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <ThreeDotsLoader size="xs" color={card.isPrimary ? 'bg-black' : 'bg-white'} />
                              Processing...
                            </span>
                          ) : (
                            `Upgrade to ${card.label}`
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              <p className="text-center text-xs text-gray-400">
                Secure payment via Razorpay &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; 7-day refund policy
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PortalModal>
  );
};

export default UpgradeModal;