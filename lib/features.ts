// Each claim is backed by a test in medusapos/app; `tests` names those files (paths in that repo).
// Add a feature here only with its test. `released` is true when the feature is in release 0.2.0,
// false when it is only in the live demo so far (the app's docs/release-notes/next.md: "Not releasable yet").
export type FeatureIcon = 'wifi-off' | 'store' | 'banknote' | 'calculator' | 'scan-barcode' | 'smartphone' | 'percent' | 'pause' | 'pencil' | 'coins' | 'user-round';

export type Feature = {
  icon: FeatureIcon;
  title: string;
  description: string;
  tests: readonly string[];
  released: boolean;
};

export const features: readonly Feature[] = [
  {
    icon: 'wifi-off',
    title: 'Sells offline',
    description: "Keep selling from the loaded catalogue when the connection drops. Queued sales sync when you're back online, and each one lands in Medusa exactly once.",
    tests: ['e2e/offline.spec.ts'],
    released: true,
  },
  {
    icon: 'store',
    title: 'Real Medusa orders',
    description: 'Each sale becomes a paid, completed order in your Medusa store with stock deducted, recorded by the MedusaPOS plugin.',
    tests: ['e2e/smoke.spec.ts', 'packages/medusa-plugin/integration-tests/http/order-create.spec.ts'],
    released: true,
  },
  {
    icon: 'banknote',
    title: 'Cash and card terminal',
    description: 'Take cash, or take a card on your own terminal and record it as an external payment. Each sale ends with a receipt you can print. MedusaPOS does not charge cards itself.',
    tests: ['e2e/smoke.spec.ts', 'apps/expo/tests/sale.test.tsx'],
    released: true,
  },
  {
    icon: 'calculator',
    title: 'Registers',
    description: "Open with a float, record cash paid in and out, then count and close. A large difference needs a manager's approval.",
    tests: ['e2e/register.spec.ts'],
    released: true,
  },
  {
    icon: 'scan-barcode',
    title: 'Scan or search',
    description: 'Use a keyboard-wedge barcode scanner, or search by name, SKU or barcode.',
    tests: ['apps/expo/tests/catalogue.test.tsx', 'e2e/phone-cart.spec.ts'],
    released: true,
  },
  {
    icon: 'smartphone',
    title: 'Phone and counter',
    description: 'The same app works on a counter screen and on a phone, with the cart a tap away.',
    tests: ['e2e/phone-cart.spec.ts'],
    released: true,
  },
  {
    icon: 'percent',
    title: 'Discounts',
    description: 'Take a percentage or a fixed amount off a line or the whole order. The cart and receipt show each discount, and Medusa records it on the order.',
    tests: ['e2e/discount.spec.ts', 'apps/expo/tests/discount.test.tsx'],
    released: true,
  },
  {
    icon: 'pause',
    title: 'Parked sales',
    description: "Park the current sale, ring up the next one, then resume or discard the parked sale. A resumed sale picks up today's catalogue prices.",
    tests: ['e2e/parked-sales.spec.ts', 'apps/expo/tests/parked-sales.test.tsx'],
    released: true,
  },
  {
    icon: 'pencil',
    title: 'Line price edit',
    description: "Change a line's unit price at the till, with an optional reason. The order reaches Medusa at the price you charged.",
    tests: ['e2e/parked-sales.spec.ts', 'apps/expo/tests/parked-sales.test.tsx'],
    released: true,
  },
  {
    icon: 'coins',
    title: 'Split tender',
    description: 'Split one sale between your card terminal and cash. Change comes from the cash part only, and the Medusa order records both payments.',
    tests: ['e2e/split-tender.spec.ts', 'apps/expo/tests/split-tender.test.tsx', 'packages/medusa-plugin/integration-tests/http/order-create.spec.ts'],
    released: true,
  },
  {
    icon: 'user-round',
    title: 'Customers',
    description: 'Search for a customer or create one at the till, and the Medusa order is linked to them. Searching and creating need a connection.',
    tests: ['e2e/customers.spec.ts', 'apps/expo/tests/customer-picker.test.tsx'],
    released: true,
  },
];
