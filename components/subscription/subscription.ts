export const subscriptionConfigForUser = {
  defaultPackage: "standard",

  packages: [
    {
      id: "basic",
      label: "Basic",
      price: 100,
      features: ["10 credits", "Email Support", "Standard Booking Access"],
    },

    {
      id: "standard",
      label: "Standard",
      price: 500,

      isPopular: true,
      features: [
        "50 credits",
        "Priority Support",
        "Address Verification",
        "NID / Passport Validation",
        "Social Profile Verification",
      ],
    },

    {
      id: "premium",
      label: "Premium",
      price: 1000,

      features: [
        "100 credits",
        "All Verification Checks",
        "Top Search Ranking",
        "Dedicated Support",
        "Premium Profile Badge",
      ],
    },
  ],
};
