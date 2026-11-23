export interface ProductCategory {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  technicalLabel: string;
  description: string;
  specifications: string[];
  applications: string[];
  containerStyle:
    | "bottle-gold"
    | "bottle-red"
    | "bottle-silver"
    | "bottle-amber"
    | "drum-steel"
    | "drum-charcoal"
    | "pail-graphite"
    | "canister-slate";
  accentHex: string;
  ambientGlow: string;
  viscosityGrades: string[];
}

export interface IndustrySector {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  operatingFocus: string;
  recommendedLines: string[];
  imageUrl: string;
  imageAlt: string;
}

export interface EngineBenefit {
  id: string;
  step: string;
  title: string;
  summary: string;
  detail: string;
  targetRpmLabel: string;
  thermalZoneLabel: string;
}

export interface CertificationStandard {
  code: string;
  title: string;
  scope: string;
}

export const APEX_CONTACT = {
  brandName: "APEXLUBES",
  legalName: "Apex Lubricants Factory LLC",
  dubaiOffice:
    "Suite 405-406, B Block, 4th Floor, Centurion Star Building (Opposite Deira City Center), P.O. Box 40743, Dubai, U.A.E.",
  ajmanFactory:
    "Apex Lubricants Factory, Opposite Hamriyah Free Zone 2, Gate Number 3, Ajman, U.A.E.",
  phone: "+971-4-2217273",
  fax: "+971-4-2215940",
  whatsapp: "+971-50-7983153",
  email: "info@apexlubes.com",
  website: "https://apexlubes.com",
} as const;

export const ENGINE_BENEFITS: EngineBenefit[] = [
  {
    id: "reduced-friction",
    step: "01",
    title: "Reduced Friction",
    summary: "Engineered lubrication to support smooth operation.",
    detail:
      "Formulated with refined base stocks and friction-modifying additive chemistry to establish a consistent hydrodynamic oil film across crankshaft journals, cam lobes, and gear teeth.",
    targetRpmLabel: "Hydrodynamic Film Active",
    thermalZoneLabel: "Shear-Stable Viscosity",
  },
  {
    id: "thermal-stability",
    step: "02",
    title: "Thermal Stability",
    summary: "Designed for demanding operating temperatures.",
    detail:
      "High-oxidation-resistance formulations help control thermal breakdown, varnish, and sludge build-up during sustained high-load automotive and industrial operating cycles.",
    targetRpmLabel: "Thermal Equilibrium",
    thermalZoneLabel: "High-Temp Oxidation Control",
  },
  {
    id: "component-protection",
    step: "03",
    title: "Component Protection",
    summary: "Lubrication solutions for automotive and industrial equipment.",
    detail:
      "Anti-wear and corrosion-inhibiting packages guard pistons, bearings, hydraulic pumps, and transmission assemblies from metal-to-metal contact under heavy mechanical stress.",
    targetRpmLabel: "Anti-Wear Barrier",
    thermalZoneLabel: "Corrosion & Deposit Shield",
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: "gasoline-engine-oils",
    index: "01",
    title: "Gasoline Engine Oils",
    shortTitle: "Gasoline Oils",
    technicalLabel: "API SN / SM / SL / SJ · Fully Synthetic & Mineral",
    description:
      "Formulated for modern passenger cars, SUVs, vans, and light commercial petrol engines in fully synthetic, semi-synthetic, and conventional grades.",
    specifications: [
      "API SC / SF / SJ / SL / SM / SN",
      "SAE 0W-20 / 5W-30 / 5W-40 / 10W-30 / 20W-50",
      "ASTM Tested Formulations",
    ],
    applications: [
      "Passenger Vehicles",
      "Turbocharged Petrol Engines",
      "High-Mileage Fleets",
    ],
    containerStyle: "bottle-gold",
    accentHex: "#F28C28",
    ambientGlow: "rgba(242, 140, 40, 0.16)",
    viscosityGrades: ["0W-20", "5W-30", "5W-40", "10W-30", "20W-50"],
  },
  {
    id: "diesel-engine-oils",
    index: "02",
    title: "Diesel Engine Oils",
    shortTitle: "Diesel Oils",
    technicalLabel: "API CJ-4 / CI-4 / CH-4 / CF-4 · Heavy Duty Turbo",
    description:
      "Advanced turbo diesel engine oils engineered to match specifications for major diesel trucks, buses, earthmoving fleets, and light commercial diesel vehicles.",
    specifications: [
      "API CC / CF / CF-4 / CH-4 / CI-4 / CJ-4",
      "SAE 15W-40 / 20W-50 / 10W-40",
      "High TBN Soot Control",
    ],
    applications: [
      "Heavy-Duty Trucks & Buses",
      "Turbocharged Diesel Fleets",
      "Off-Highway Machinery",
    ],
    containerStyle: "bottle-silver",
    accentHex: "#F4F4F4",
    ambientGlow: "rgba(244, 244, 244, 0.14)",
    viscosityGrades: ["10W-40", "15W-40", "20W-50", "SAE 40", "SAE 50"],
  },
  {
    id: "motorcycle-oils",
    index: "03",
    title: "Motorcycle Oils",
    shortTitle: "2T / 4T & Racing",
    technicalLabel: "4T & 2T Formulations · Marine Outboard TC-W3",
    description:
      "Dedicated 4T and 2T motorcycle engine oils and outboard motor oils built for wet-clutch responsiveness, high-RPM thermal stability, and clean combustion.",
    specifications: [
      "4T Racing & Street Series",
      "2T Two-Stroke Engine Oils",
      "Outboard Motor TC-W3",
    ],
    applications: [
      "4-Stroke Motorcycles",
      "2-Stroke Scooters & Bikes",
      "Outboard Marine Engines",
    ],
    containerStyle: "bottle-red",
    accentHex: "#F28C28",
    ambientGlow: "rgba(242, 140, 40, 0.16)",
    viscosityGrades: ["10W-30", "10W-40", "20W-40", "20W-50", "2T / TC-W3"],
  },
  {
    id: "gear-transmission-oils",
    index: "04",
    title: "Gear & Transmission Oils",
    shortTitle: "Gear & ATF",
    technicalLabel: "ATF Dexron III · API GL-4 / GL-5",
    description:
      "Extreme-pressure automotive and heavy-duty gear oils alongside smooth-shifting Automatic Transmission Fluids for manual gearboxes, axles, and differentials.",
    specifications: [
      "ATF Dexron III & Multi-Vehicle",
      "API GL-4 / GL-5 EP Gear Oils",
      "SAE 80W-90 / 85W-140 / 75W-90",
    ],
    applications: [
      "Automatic Transmissions",
      "Heavy Axles & Differentials",
      "Manual Gearboxes",
    ],
    containerStyle: "bottle-amber",
    accentHex: "#F28C28",
    ambientGlow: "rgba(242, 140, 40, 0.16)",
    viscosityGrades: ["Dexron III", "75W-90", "80W-90", "85W-140", "SAE 90"],
  },
  {
    id: "hydraulic-oils",
    index: "05",
    title: "Hydraulic Oils",
    shortTitle: "Hydraulic Fluids",
    technicalLabel: "ISO VG 10 / 32 / 46 / 68 / 100 / 150 · Anti-Wear",
    description:
      "High-viscosity-index anti-wear hydraulic fluids delivering oxidation stability, rapid air release, and pump protection under sustained industrial pressure.",
    specifications: [
      "ISO VG 10 / 32 / 46 / 68 / 100 / 150",
      "Anti-Wear Additive System",
      "Thermal & Hydrolytic Stability",
    ],
    applications: [
      "Industrial Hydraulic Presses",
      "Excavators & Cranes",
      "High-Pressure Fluid Systems",
    ],
    containerStyle: "drum-steel",
    accentHex: "#F4F4F4",
    ambientGlow: "rgba(244, 244, 244, 0.13)",
    viscosityGrades: ["ISO VG 32", "ISO VG 46", "ISO VG 68", "ISO VG 100"],
  },
  {
    id: "industrial-lubricants",
    index: "06",
    title: "Industrial Lubricants",
    shortTitle: "Industrial Range",
    technicalLabel:
      "Turbine · Compressor · Transformer · Cutting & Heat Transfer",
    description:
      "Specialized industrial oil portfolio engineered for continuous-duty compressors, power turbines, transformers, metalworking cutting operations, and marine propulsion.",
    specifications: [
      "Compressor & Turbine Oils",
      "Transformer & Heat Transfer Oils",
      "Cutting Oils & Marine Engine Oils",
    ],
    applications: [
      "Power Generation & Turbines",
      "Rotary & Reciprocating Compressors",
      "Precision Metalworking",
    ],
    containerStyle: "drum-charcoal",
    accentHex: "#F28C28",
    ambientGlow: "rgba(242, 140, 40, 0.15)",
    viscosityGrades: [
      "ISO VG 32",
      "ISO VG 46",
      "ISO VG 68",
      "ISO VG 100",
      "ISO VG 220",
    ],
  },
  {
    id: "greases",
    index: "07",
    title: "Greases",
    shortTitle: "EP & Complex Greases",
    technicalLabel:
      "Lithium EP2 / EP3 · Calcium MP2 / MP3 · Complex & Bentonite",
    description:
      "Consistent-structure lubricating greases ranging from Calcium MP2/MP3 multipurpose formulas to Lithium Complex high-temperature and non-soap Bentonite greases.",
    specifications: [
      "Lithium EP2 / EP3 & Lithium Complex",
      "Calcium Multipurpose MP2 / MP3",
      "High-Temp Non-Soap Bentonite",
    ],
    applications: [
      "Rolling & Plain Bearings",
      "Heavy Chassis & Pins",
      "High-Load Industrial Joints",
    ],
    containerStyle: "pail-graphite",
    accentHex: "#F28C28",
    ambientGlow: "rgba(242, 140, 40, 0.15)",
    viscosityGrades: ["NLGI 2", "NLGI 3", "EP2", "EP3"],
  },
  {
    id: "coolants-brake-fluids",
    index: "08",
    title: "Coolants & Brake Fluids",
    shortTitle: "Coolants & Brake",
    technicalLabel:
      "DOT 3 / DOT 4 Brake Fluids · Radiator Antifreeze & Coolants",
    description:
      "Protective radiator coolants, antifreeze concentrates, and high-boiling-point hydraulic brake fluids engineered to prevent corrosion, cavitation, and vapor lock.",
    specifications: [
      "DOT 3 & DOT 4 Brake Fluids",
      "Extended-Life Radiator Coolants",
      "Anti-Boil & Anti-Corrosion Package",
    ],
    applications: [
      "Passenger & Commercial Cooling",
      "Hydraulic Braking Systems",
      "Extreme Ambient Climates",
    ],
    containerStyle: "canister-slate",
    accentHex: "#F28C28",
    ambientGlow: "rgba(242, 140, 40, 0.15)",
    viscosityGrades: ["DOT 3", "DOT 4", "33% / 50% / Concentrate"],
  },
];

export const INDUSTRY_SECTORS: IndustrySector[] = [
  {
    id: "automotive",
    name: "Automotive",
    subtitle: "Passenger Vehicles, SUVs & Motorcycles",
    description:
      "From modern multi-valve petrol engines to high-revving 4T motorcycles, Apex automotive lubricants are blended to protect against sludge, thermal shear, and cold-start wear.",
    operatingFocus:
      "API SN / SM / SL Petrol & 4T Formulations · ATF Dexron III · DOT 4",
    recommendedLines: [
      "Gasoline Engine Oils",
      "Motorcycle Oils",
      "Gear & Transmission Oils",
      "Coolants & Brake Fluids",
    ],
    imageUrl:
      "/assets/images/industry_automotive_performance_1795415831855.jpg",
    imageAlt:
      "Twin-turbo V8 automotive engine assembly in a dark precision studio",
  },
  {
    id: "heavy-duty",
    name: "Heavy Duty",
    subtitle: "Commercial Trucking, Logistics & Transit Fleets",
    description:
      "Turbocharged diesel fleets operating across high ambient Middle East and global corridors rely on high-TBN oil chemistry to manage soot dispersion and extended service loads.",
    operatingFocus: "API CJ-4 / CI-4 / CH-4 Turbo Diesel · SAE 15W-40 & 20W-50",
    recommendedLines: [
      "Diesel Engine Oils",
      "Gear & Transmission Oils",
      "Greases",
      "Coolants & Brake Fluids",
    ],
    imageUrl: "/assets/images/industry_marine_heavy_duty_1795415832876.jpg",
    imageAlt: "Heavy-duty diesel engine block and high-pressure fluid manifold",
  },
  {
    id: "construction",
    name: "Construction",
    subtitle: "Earthmoving, Cranes & Site Hydraulics",
    description:
      "Excavators, loaders, and mobile cranes demand anti-wear hydraulic fluids and extreme-pressure lithium greases that hold film integrity under shock loads and dust exposure.",
    operatingFocus:
      "ISO VG 46 / 68 Anti-Wear Hydraulic · Lithium EP2 / EP3 Greases",
    recommendedLines: ["Hydraulic Oils", "Diesel Engine Oils", "Greases"],
    imageUrl: "/assets/images/industry_heavy_industrial_1795415832052.jpg",
    imageAlt:
      "Heavy-duty industrial hydraulic turbine and planetary gear assembly",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    subtitle: "Plant Machinery, Turbines & Metalworking",
    description:
      "Continuous factory lines require specialized compressor, turbine, transformer, heat transfer, and metal cutting oils formulated for thermal stability and reduced downtime.",
    operatingFocus:
      "Compressor, Turbine, Heat Transfer & Cutting Oils · ISO VG 32–220",
    recommendedLines: ["Industrial Lubricants", "Hydraulic Oils", "Greases"],
    imageUrl: "/assets/images/manufacturing_blending_plant_1795415831959.jpg",
    imageAlt:
      "Automated stainless steel industrial blending vessels and precision piping",
  },
  {
    id: "marine",
    name: "Marine",
    subtitle: "Commercial Vessels & Outboard Propulsion",
    description:
      "Marine diesel trunk-piston lubricants and TC-W3 outboard oils engineered to combat moisture ingress, acid neutralization, and sustained saltwater operating demands.",
    operatingFocus:
      "Marine Engine Oils · TC-W3 Outboard · Anti-Corrosion Greases",
    recommendedLines: [
      "Industrial Lubricants",
      "Motorcycle Oils",
      "Diesel Engine Oils",
    ],
    imageUrl: "/assets/images/industry_marine_heavy_duty_1795415832876.jpg",
    imageAlt:
      "Commercial maritime propulsion engine room and stainless steel manifolds",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    subtitle: "Tractors, Harvesters & Irrigation Drives",
    description:
      "Super Tractor Oil Universal (STOU SAE 15W-40) and multipurpose agricultural lubricants simplify fleet maintenance across engines, transmissions, and wet brakes.",
    operatingFocus: "Tractor Oil STOU SAE 15W-40 · Calcium MP2 / MP3 Greases",
    recommendedLines: [
      "Diesel Engine Oils",
      "Hydraulic Oils",
      "Gear & Transmission Oils",
      "Greases",
    ],
    imageUrl: "/assets/images/industry_heavy_industrial_1795415832052.jpg",
    imageAlt:
      "High-torque planetary gear drive and heavy agricultural transmission assembly",
  },
];

export const CERTIFICATIONS: CertificationStandard[] = [
  {
    code: "ISO 9001:2015",
    title: "Quality Management System",
    scope:
      "Consistent automated blending tolerances and raw-to-finished batch traceability.",
  },
  {
    code: "ISO 14001:2015",
    title: "Environmental Management",
    scope:
      "Responsible manufacturing processes across our UAE blending operations.",
  },
  {
    code: "ISO 45001:2018",
    title: "Occupational Health & Safety",
    scope:
      "Controlled handling and plant safety protocols across blending and filling lines.",
  },
  {
    code: "API · SAE · ASTM",
    title: "Industry Formulation Standards",
    scope:
      "Lubricants formulated and laboratory-tested to align with international OEM & petroleum specifications.",
  },
];
