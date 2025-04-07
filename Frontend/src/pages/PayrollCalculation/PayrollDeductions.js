const payrollDeductions = [
  {
    province: "Alberta",
    taxRate: 10.0,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "British Columbia",
    taxRate: 5.06,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Manitoba",
    taxRate: 10.8,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "New Brunswick",
    taxRate: 9.4,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Newfoundland & Labrador",
    taxRate: 8.7,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Northwest Territories",
    taxRate: 5.9,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Nova Scotia",
    taxRate: 8.79,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Nunavut",
    taxRate: 4.0,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Ontario",
    taxRate: 5.05,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Prince Edward Island",
    taxRate: 9.8,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Quebec",
    taxRate: 14.0,
    cppRate: 5.40, // QPP instead of CPP
    eiRate: 1.20, // Lower EI rate in Quebec
  },
  {
    province: "Saskatchewan",
    taxRate: 10.5,
    cppRate: 5.95,
    eiRate: 1.66,
  },
  {
    province: "Yukon",
    taxRate: 6.4,
    cppRate: 5.95,
    eiRate: 1.66,
  },
];

export default payrollDeductions;
