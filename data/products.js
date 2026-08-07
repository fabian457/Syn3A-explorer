// JCVI-syn3A genome length in base pairs (single circular chromosome).
// Verified against NCBI GenBank CP016816.2 ("Synthetic bacterium JCVI-Syn3A, complete genome").
const GENOME_LENGTH_BP = 543379;

// One entry per depicted "product" (protein/assembly) in the Goodsell illustration.
// `cutout` is a transparent-background PNG, pixel-aligned with assets/syn3A.webp,
// containing only that product's colored shape(s).
//
// IMPORTANT: array order is load-bearing. assets/id-map.png encodes each product's
// hit-test region using its 1-based position in this array (product N = RGB(N &
// 0xff, N >> 8, 0)) — reordering this array without regenerating id-map.png will
// make hover/click resolve to the wrong product.
//
// `loci` lists every gene/locus contributing to this product, sourced from
// "relevant files/goodsell-products-reference.json" (Table 1 of Goodsell 2022,
// cross-checked against GenBank CP016816.2). Loci with null start/end/strand
// just don't get a genome-track segment yet.
const PRODUCTS = [
  {
    id: "0001",
    displayName: "DnaA",
    fullName: "Chromosomal replication initiator protein DnaA",
    cutout: "cutouts/3A-001.png",
    loci: [
      { locusTag: "JCVISYN3A_0001", gene: "dnaA", start: 1, end: 1353, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0002",
    displayName: "DNA Polymerase",
    fullName: "DNA polymerase assembly",
    cutout: "cutouts/3A-002.png",
    loci: [
      { locusTag: "JCVISYN3A_0002", gene: "dnaN", start: 1511, end: 2638, strand: "+" },
      { locusTag: "JCVISYN3A_0044", gene: "holA", start: 40049, end: 40789, strand: "-" },
      { locusTag: "JCVISYN3A_0047", gene: "dnaX", start: 42003, end: 44009, strand: "-" },
      { locusTag: "JCVISYN3A_0303", gene: "polC", start: 183022, end: 187470, strand: "-" },
      { locusTag: "JCVISYN3A_0406", gene: "dnaG", start: 251740, end: 253578, strand: "+" },
      { locusTag: "JCVISYN3A_0608", gene: "dnaI", start: 373389, end: 374327, strand: "-" },
      { locusTag: "JCVISYN3A_0609", gene: "dnaB", start: 374337, end: 375521, strand: "-" },
      { locusTag: "JCVISYN3A_0612", gene: "dnaE", start: 379257, end: 382220, strand: "-" },
      { locusTag: "JCVISYN3A_0695", gene: "pcrA", start: 433800, end: 435968, strand: "-" },
      { locusTag: "JCVISYN3A_0826", gene: "yqeN", start: 503314, end: 504264, strand: "+" },
      { locusTag: "JCVISYN3A_0834", gene: "dnaC", start: 509138, end: 510454, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0003",
    displayName: "RnmV",
    fullName: "Ribonuclease M5",
    cutout: "cutouts/3A-003.png",
    loci: [
      { locusTag: "JCVISYN3A_0003", gene: "rnmV", start: 2675, end: 3217, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0004",
    displayName: "KsgA",
    fullName: "16S rRNA (adenine(1518)-N(6)/adenine(1519)-N(6))-dimethyltransferase",
    cutout: "cutouts/3A-004.png",
    loci: [
      { locusTag: "JCVISYN3A_0004", gene: "ksgA", start: 3207, end: 4007, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0006",
    displayName: "DNA Gyrase",
    fullName: "DNA gyrase (subunits GyrB + GyrA)",
    cutout: "cutouts/3A-006.png",
    loci: [
      { locusTag: "JCVISYN3A_0006", gene: "gyrB", start: 5515, end: 7419, strand: "+" },
      { locusTag: "JCVISYN3A_0007", gene: "gyrA", start: 7435, end: 9939, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0008",
    displayName: "Ribose/Galactose ABC Transporter",
    fullName: "Ribose/galactose ABC transporter",
    cutout: "cutouts/3A-008.png",
    loci: [
      { locusTag: "JCVISYN3A_0008", gene: "rnsD; uptD", start: 9991, end: 10968, strand: "-" },
      { locusTag: "JCVISYN3A_0009", gene: "rnsC; uptD", start: 10968, end: 13535, strand: "-" },
      { locusTag: "JCVISYN3A_0010", gene: "rnsA; uptA", start: 13525, end: 15141, strand: "-" },
      { locusTag: "JCVISYN3A_0011", gene: "rnsB; uptB", start: 15153, end: 16799, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0011",
    displayName: "Nucleoside ABC Transporter Substrate-Binding",
    fullName: "Nucleoside ABC transporter substrate-binding protein",
    cutout: "cutouts/3A-011.png",
    loci: [
      { locusTag: "JCVISYN3A_0011", gene: "rnsB; uptB", start: 15153, end: 16799, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0012",
    displayName: "MetRS",
    fullName: "Methionine--tRNA ligase",
    cutout: "cutouts/3A-012.png",
    loci: [
      { locusTag: "JCVISYN3A_0012", gene: "metRS", start: 16986, end: 18515, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0025",
    displayName: "30S Ribosome",
    fullName: "30S ribosomal subunit",
    cutout: "cutouts/3A-025.png",
    loci: [
      { locusTag: "JCVISYN3A_0025", gene: "rpsR", start: 22769, end: 22996, strand: "-" },
      { locusTag: "JCVISYN3A_0027", gene: "rpsF", start: 23468, end: 23881, strand: "-" },
      { locusTag: "JCVISYN3A_0082", gene: "rpsT", start: 63285, end: 63530, strand: "-" },
      { locusTag: "JCVISYN3A_0148", gene: "rpsL", start: 100119, end: 100538, strand: "+" },
      { locusTag: "JCVISYN3A_0149", gene: "rpsG", start: 100625, end: 101092, strand: "+" },
      { locusTag: "JCVISYN3A_0238", gene: "rpsD", start: 146578, end: 147204, strand: "-" },
      { locusTag: "JCVISYN3A_0294", gene: "rpsO", start: 176397, end: 176663, strand: "+" },
      { locusTag: "JCVISYN3A_0362", gene: "rpsP", start: 214180, end: 214458, strand: "+" },
      { locusTag: "JCVISYN3A_0482", gene: "rpsU", start: 311391, end: 311555, strand: "+" },
      { locusTag: "JCVISYN3A_0540", gene: "rpsB", start: 349834, end: 350712, strand: "-" },
      { locusTag: "JCVISYN3A_0637", gene: "rpsI", start: 395531, end: 395929, strand: "-" },
      { locusTag: "JCVISYN3A_0646", gene: "rpsK", start: 406105, end: 406494, strand: "-" },
      { locusTag: "JCVISYN3A_0647", gene: "rpsM", start: 406520, end: 406885, strand: "-" },
      { locusTag: "JCVISYN3A_0654", gene: "rpsE", start: 410768, end: 411532, strand: "-" },
      { locusTag: "JCVISYN3A_0657", gene: "rpsH", start: 412483, end: 412872, strand: "-" },
      { locusTag: "JCVISYN3A_0658", gene: "rpsN", start: 412892, end: 413077, strand: "-" },
      { locusTag: "JCVISYN3A_0662", gene: "rpsQ", start: 414381, end: 414641, strand: "-" },
      { locusTag: "JCVISYN3A_0665", gene: "rpsC", start: 415470, end: 416171, strand: "-" },
      { locusTag: "JCVISYN3A_0667", gene: "rpsS", start: 416548, end: 416814, strand: "-" },
      { locusTag: "JCVISYN3A_0672", gene: "rpsJ", start: 419409, end: 419717, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0026",
    displayName: "PriB",
    fullName: "Single-stranded DNA-binding protein",
    cutout: "cutouts/3A-026.png",
    loci: [
      { locusTag: "JCVISYN3A_0026", gene: "priB", start: 23016, end: 23456, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0029",
    displayName: "NADH Azoreductase",
    fullName: "Uncharacterized FMN-dependent NADH-azoreductase",
    cutout: "cutouts/3A-029.png",
    loci: [
      { locusTag: "JCVISYN3A_0029", gene: null, start: 24273, end: 24872, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0030",
    displayName: "ABC Transporter ATP-Binding",
    fullName: "Uncharacterized ABC transporter ATP-binding protein",
    cutout: "cutouts/3A-030.png",
    loci: [
      { locusTag: "JCVISYN3A_0030", gene: null, start: 24909, end: 25943, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0033",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-033.png",
    loci: [
      { locusTag: "JCVISYN3A_0033", gene: null, start: 26204, end: 29362, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0034",
    displayName: "Efflux ABC Transporter",
    fullName: "Uncharacterized efflux ABC transporter permease",
    cutout: "cutouts/3A-034.png",
    loci: [
      { locusTag: "JCVISYN3A_0034", gene: null, start: 29509, end: 34896, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0039",
    displayName: "FtsH",
    fullName: "Membrane anchored AAA+ protease FtsH",
    cutout: "cutouts/3A-039.png",
    loci: [
      { locusTag: "JCVISYN3A_0039", gene: "ftsH", start: 35062, end: 37008, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0040",
    displayName: "TilS",
    fullName: "tRNA lysidine(34) synthetase",
    cutout: "cutouts/3A-040.png",
    loci: [
      { locusTag: "JCVISYN3A_0040", gene: "tilS", start: 37240, end: 38445, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0042",
    displayName: "Uncharacterized Transcriptional Regulator",
    fullName: "Uncharacterized transcriptional regulator",
    cutout: "cutouts/3A-042.png",
    loci: [
      { locusTag: "JCVISYN3A_0042", gene: null, start: 38448, end: 39275, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0043",
    displayName: "YabD",
    fullName: "Uncharacterized methyltransferase",
    cutout: "cutouts/3A-043.png",
    loci: [
      { locusTag: "JCVISYN3A_0043", gene: "yabD", start: 39327, end: 40049, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0045",
    displayName: "Tmk",
    fullName: "dTMP kinase",
    cutout: "cutouts/3A-045.png",
    loci: [
      { locusTag: "JCVISYN3A_0045", gene: "tmk", start: 40767, end: 41408, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0046",
    displayName: "RecR",
    fullName: "Recombination protein RecR",
    cutout: "cutouts/3A-046.png",
    loci: [
      { locusTag: "JCVISYN3A_0046", gene: "recR", start: 41411, end: 42001, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0054",
    displayName: "AhpC",
    fullName: "Uncharacterized peroxiredoxin",
    cutout: "cutouts/3A-054.png",
    loci: [
      { locusTag: "JCVISYN3A_0054", gene: "ahpC", start: 45293, end: 45742, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0060",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-060.png",
    loci: [
      { locusTag: "JCVISYN3A_0060", gene: null, start: 46274, end: 47098, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0061",
    displayName: "SerRS",
    fullName: "Serine--tRNA ligase",
    cutout: "cutouts/3A-061.png",
    loci: [
      { locusTag: "JCVISYN3A_0061", gene: "serRS", start: 47181, end: 48449, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0063",
    displayName: "DusB",
    fullName: "Uncharacterized tRNA dihydrouridine synthase",
    cutout: "cutouts/3A-063.png",
    loci: [
      { locusTag: "JCVISYN3A_0063", gene: "dusB", start: 48559, end: 49533, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0064",
    displayName: "LysRS",
    fullName: "Lysine--tRNA ligase",
    cutout: "cutouts/3A-064.png",
    loci: [
      { locusTag: "JCVISYN3A_0064", gene: "lysRS", start: 49536, end: 51038, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0065",
    displayName: "TrxA",
    fullName: "Thioredoxin",
    cutout: "cutouts/3A-065.png",
    loci: [
      { locusTag: "JCVISYN3A_0065", gene: "trxA", start: 51128, end: 51436, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0066",
    displayName: "Low-Specificity Hydrolase",
    fullName: "Low specificity hydrolase",
    cutout: "cutouts/3A-066.png",
    loci: [
      { locusTag: "JCVISYN3A_0066", gene: null, start: 51447, end: 52289, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0076",
    displayName: "AsnRS",
    fullName: "Asparagine--tRNA ligase",
    cutout: "cutouts/3A-076.png",
    loci: [
      { locusTag: "JCVISYN3A_0076", gene: "asnRS", start: 58156, end: 59520, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0077",
    displayName: "Uncharacterized Hydrolase",
    fullName: "Uncharacterized hydrolase",
    cutout: "cutouts/3A-077.png",
    loci: [
      { locusTag: "JCVISYN3A_0077", gene: null, start: 59529, end: 60368, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0079",
    displayName: "TsaBCDE Complex",
    fullName: "tRNA N6-adenosine(37)-N6-threonylcarbamoyltransferase complex",
    cutout: "cutouts/3A-079.png",
    loci: [
      { locusTag: "JCVISYN3A_0079", gene: "tsaD", start: 60404, end: 61360, strand: "-" },
      { locusTag: "JCVISYN3A_0144", gene: "tsaC", start: 96001, end: 96501, strand: "+" },
      { locusTag: "JCVISYN3A_0270", gene: "tsaE; yjeE", start: 164055, end: 164471, strand: "+" },
      { locusTag: "JCVISYN3A_0271", gene: "tsaB; yeaZ", start: 164473, end: 165036, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0080",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-080.png",
    loci: [
      { locusTag: "JCVISYN3A_0080", gene: null, start: 61455, end: 61676, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0081",
    displayName: "MnmE / RlmFO",
    fullName: "tRNA uridine(34) 5-carboxymethylaminomethyl modification enzyme",
    cutout: "cutouts/3A-081.png",
    loci: [
      { locusTag: "JCVISYN3A_0081", gene: "mnmE; trmE", start: 61876, end: 63234, strand: "+" },
      { locusTag: "JCVISYN3A_0434", gene: "rlmFO", start: 284461, end: 285777, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0094",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-094.png",
    loci: [
      { locusTag: "JCVISYN3A_0094", gene: null, start: 63664, end: 64380, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0095",
    displayName: "SecA",
    fullName: "Preprotein translocase subunit A",
    cutout: "cutouts/3A-095.png",
    loci: [
      { locusTag: "JCVISYN3A_0095", gene: "secA", start: 64495, end: 67329, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0097",
    displayName: "YycJ",
    fullName: "Uncharacterized 5'-3' exonuclease",
    cutout: "cutouts/3A-097.png",
    loci: [
      { locusTag: "JCVISYN3A_0097", gene: "yycJ", start: 67494, end: 68405, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0105",
    displayName: "Exodeoxyribonuclease VII",
    fullName: "Exodeoxyribonuclease VII (subunits XseB + XseA)",
    cutout: "cutouts/3A-105.png",
    loci: [
      { locusTag: "JCVISYN3A_0105", gene: "xseB", start: 68809, end: 69024, strand: "-" },
      { locusTag: "JCVISYN3A_0106", gene: "xseA", start: 69014, end: 70423, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0107",
    displayName: "NusB",
    fullName: "Transcription antitermination factor",
    cutout: "cutouts/3A-107.png",
    loci: [
      { locusTag: "JCVISYN3A_0107", gene: "nusB", start: 70425, end: 70823, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0108",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-108.png",
    loci: [
      { locusTag: "JCVISYN3A_0108", gene: null, start: 70835, end: 71947, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0109",
    displayName: "Deoxyribonuclease IV",
    fullName: "Deoxyribonuclease IV",
    cutout: "cutouts/3A-109.png",
    loci: [
      { locusTag: "JCVISYN3A_0109", gene: null, start: 71973, end: 72842, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0202",
    displayName: "RsmD",
    fullName: "16S rRNA (guanine(966)-N(2))-methyltransferase",
    cutout: "cutouts/3A-202.png",
    loci: [
      { locusTag: "JCVISYN3A_0202", gene: "rsmD", start: 126259, end: 126816, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0363",
    displayName: "RimM",
    fullName: "16S rRNA processing protein",
    cutout: "cutouts/3A-363.png",
    loci: [
      { locusTag: "JCVISYN3A_0363", gene: "rimM", start: 214490, end: 214984, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0137",
    displayName: "50S Ribosome",
    fullName: "50S ribosomal subunit",
    cutout: "cutouts/3A-137.png",
    loci: [
      { locusTag: "JCVISYN3A_0137", gene: "rpmE", start: 88733, end: 89011, strand: "+" },
      { locusTag: "JCVISYN3A_0198", gene: "rplT", start: 124254, end: 124613, strand: "-" },
      { locusTag: "JCVISYN3A_0199", gene: "rpmI", start: 124632, end: 124823, strand: "-" },
      { locusTag: "JCVISYN3A_0365", gene: "rplS", start: 215710, end: 216093, strand: "+" },
      { locusTag: "JCVISYN3A_0422", gene: "rpmB", start: 274322, end: 274519, strand: "+" },
      { locusTag: "JCVISYN3A_0499", gene: "rpmA", start: 316629, end: 316910, strand: "-" },
      { locusTag: "JCVISYN3A_0501", gene: "rplU", start: 317229, end: 317531, strand: "-" },
      { locusTag: "JCVISYN3A_0526", gene: "rpmF", start: 335295, end: 335474, strand: "-" },
      { locusTag: "JCVISYN3A_0638", gene: "rplM", start: 395929, end: 396384, strand: "-" },
      { locusTag: "JCVISYN3A_0644", gene: "rplQ", start: 404769, end: 405128, strand: "-" },
      { locusTag: "JCVISYN3A_0648", gene: "rpmJ", start: 406922, end: 407035, strand: "-" },
      { locusTag: "JCVISYN3A_0653", gene: "rplO", start: 410312, end: 410749, strand: "-" },
      { locusTag: "JCVISYN3A_0655", gene: "rplR", start: 411551, end: 411901, strand: "-" },
      { locusTag: "JCVISYN3A_0656", gene: "rplF", start: 411927, end: 412469, strand: "-" },
      { locusTag: "JCVISYN3A_0659", gene: "rplE", start: 413096, end: 413638, strand: "-" },
      { locusTag: "JCVISYN3A_0660", gene: "rplX", start: 413657, end: 413983, strand: "-" },
      { locusTag: "JCVISYN3A_0661", gene: "rplN", start: 413997, end: 414365, strand: "-" },
      { locusTag: "JCVISYN3A_0663", gene: "rpmC", start: 414638, end: 415054, strand: "-" },
      { locusTag: "JCVISYN3A_0664", gene: "rplP", start: 415054, end: 415467, strand: "-" },
      { locusTag: "JCVISYN3A_0666", gene: "rplV", start: 416189, end: 416524, strand: "-" },
      { locusTag: "JCVISYN3A_0668", gene: "rplB", start: 416836, end: 417684, strand: "-" },
      { locusTag: "JCVISYN3A_0669", gene: "rplW", start: 417739, end: 418023, strand: "-" },
      { locusTag: "JCVISYN3A_0670", gene: "rplD", start: 418023, end: 418649, strand: "-" },
      { locusTag: "JCVISYN3A_0671", gene: "rplC", start: 418662, end: 419333, strand: "-" },
      { locusTag: "JCVISYN3A_0806", gene: "rplG", start: 484862, end: 485230, strand: "-" },
      { locusTag: "JCVISYN3A_0807", gene: "rplJ", start: 485299, end: 485796, strand: "-" },
      { locusTag: "JCVISYN3A_0809", gene: "rplA", start: 486023, end: 486703, strand: "-" },
      { locusTag: "JCVISYN3A_0810", gene: "rplK", start: 486703, end: 487131, strand: "-" },
      { locusTag: "JCVISYN3A_0833", gene: "rplI", start: 508692, end: 509135, strand: "+" },
      { locusTag: "JCVISYN3A_0930", gene: "rpmG", start: 319048, end: 319191, strand: "-" },
      { locusTag: "JCVISYN3A_0932", gene: "rpmG", start: 515027, end: 515188, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0117",
    displayName: "PlsY",
    fullName: "Acyl-phosphate glycerol 3-phosphate acyltransferase",
    cutout: "cutouts/3A-117.png",
    loci: [
      { locusTag: "JCVISYN3A_0117", gene: "plsY", start: 77446, end: 78207, strand: "+" }
    ],
    description: "1st acylation (uses acyl-phosphate directly) → lysophosphatidic acid",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0139",
    displayName: "NanoRNAse",
    fullName: "NanoRNAse",
    cutout: "cutouts/3A-139.png",
    loci: [
      { locusTag: "JCVISYN3A_0139", gene: "ytqI; orn", start: 90992, end: 91942, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0218",
    displayName: "GlpK",
    fullName: "Glycerol kinase",
    cutout: "cutouts/3A-218.png",
    loci: [
      { locusTag: "JCVISYN3A_0218", gene: "glpK", start: 131274, end: 132791, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0227",
    displayName: "Pyruvate Dehydrogenase Complex",
    fullName: "Pyruvate dehydrogenase complex",
    cutout: "cutouts/3A-227.png",
    loci: [
      { locusTag: "JCVISYN3A_0227", gene: "pdhC", start: 138324, end: 139649, strand: "+" },
      { locusTag: "JCVISYN3A_0228", gene: "lpdA", start: 139668, end: 141557, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0419",
    displayName: "PlsX",
    fullName: "Phosphate acyltransferase",
    cutout: "cutouts/3A-419.png",
    loci: [
      { locusTag: "JCVISYN3A_0419", gene: "plsX", start: 271137, end: 272141, strand: "-" }
    ],
    description: "shuttles acyl-phosphate ↔ acyl-ACP pool",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0420",
    displayName: "FakA",
    fullName: "Fatty acid kinase subunit A",
    cutout: "cutouts/3A-420.png",
    loci: [
      { locusTag: "JCVISYN3A_0420", gene: "fakA", start: 272174, end: 273817, strand: "-" }
    ],
    description: "produces acyl-phosphate",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0513",
    displayName: "AcpS",
    fullName: "ACP synthase",
    cutout: "cutouts/3A-513.png",
    loci: [
      { locusTag: "JCVISYN3A_0513", gene: "acpS", start: 322858, end: 323190, strand: "-" }
    ],
    description: "activates the ACP",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0616",
    displayName: "FakB1",
    fullName: "Fatty acid binding protein",
    cutout: "cutouts/3A-616.png",
    loci: [
      { locusTag: "JCVISYN3A_0616", gene: "fakB", start: 385390, end: 386229, strand: "+" }
    ],
    description: "binds imported fatty acid",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0617",
    displayName: "FakB2",
    fullName: "Fatty acid binding protein",
    cutout: "cutouts/3A-617.png",
    loci: [
      { locusTag: "JCVISYN3A_0617", gene: "fakB", start: 386240, end: 387091, strand: "+" }
    ],
    description: "binds imported fatty acid",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0621",
    displayName: "AcpA",
    fullName: "Acyl carrier protein",
    cutout: "cutouts/3A-621.png",
    loci: [
      { locusTag: "JCVISYN3A_0621", gene: "acpA", start: 387855, end: 388076, strand: "-" }
    ],
    description: "acyl carrier protein (the acyl-ACP pool)",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0512",
    displayName: "PlsC",
    fullName: "Acyl-phosphate glycerol 3-phosphate acyltransferase",
    cutout: "cutouts/3A-512.png",
    loci: [
      { locusTag: "JCVISYN3A_0512", gene: "plsC", start: 321754, end: 322701, strand: "-" }
    ],
    description: "2nd acylation (uses acyl-ACP), lysophosphatidic acid → phosphatidic acid",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0304",
    displayName: "CdsA",
    fullName: "Phosphatidate cytidylyltransferase",
    cutout: "cutouts/3A-304.png",
    loci: [
      { locusTag: "JCVISYN3A_0304", gene: "cdsA", start: 187479, end: 188507, strand: "-" }
    ],
    description: "→ CDP-diacylglycerol",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0875",
    displayName: "PgsA",
    fullName: "CDP-diacylglycerol--glycerol-3-phosphate 3-phosphatidyltransferase",
    cutout: "cutouts/3A-875.png",
    loci: [
      { locusTag: "JCVISYN3A_0875", gene: "pgsA", start: 524244, end: 524840, strand: "-" }
    ],
    description: "→ phosphatidylglycerol-phosphate",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0214",
    displayName: "PgpA",
    fullName: "Phosphatidylglycerophosphatase",
    cutout: "cutouts/3A-214.png",
    loci: [
      { locusTag: "JCVISYN3A_0214", gene: "pgpA", start: 129342, end: 130163, strand: "+" }
    ],
    description: "dephosphorylates → finished phosphatidylglycerol",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "membrane",
    displayName: "Phospholipid Membrane",
    fullName: "Phospholipid bilayer membrane",
    cutout: "cutouts/3A-membrane.png",
    loci: [],
    relatedProductIds: ["0616", "0617", "0420", "0117", "0419", "0621", "0513", "0512", "0304", "0875", "0214"],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0113",
    displayName: "BcsA",
    fullName: "Glycolipid synthase A",
    cutout: "cutouts/3A-113.png",
    loci: [
      { locusTag: "JCVISYN3A_0113", gene: "bcsA", start: 73088, end: 74437, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0115",
    displayName: "GalU",
    fullName: "UTP--glucose-1-phosphate uridylyltransferase",
    cutout: "cutouts/3A-115.png",
    loci: [
      { locusTag: "JCVISYN3A_0115", gene: "galU", start: 75879, end: 76751, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0169",
    displayName: "AmiA",
    fullName: "Oligopeptide ABC transporter substrate-binding protein",
    cutout: "cutouts/3A-169.png",
    loci: [
      { locusTag: "JCVISYN3A_0169", gene: "amiA", start: 114778, end: 117879, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0233",
    displayName: "PTS System",
    fullName: "Phosphoenolpyruvate:sugar phosphotransferase system (PTS) assembly",
    cutout: "cutouts/3A-233.png",
    loci: [
      { locusTag: "JCVISYN3A_0233", gene: "ptsI", start: 143903, end: 145624, strand: "+" },
      { locusTag: "JCVISYN3A_0234", gene: "crr", start: 145706, end: 146170, strand: "+" },
      { locusTag: "JCVISYN3A_0694", gene: "ptsH", start: 433466, end: 433735, strand: "-" },
      { locusTag: "JCVISYN3A_0779", gene: "ptsG", start: 460467, end: 462704, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0316",
    displayName: "Transketolase",
    fullName: "Transketolase",
    cutout: "cutouts/3A-316.png",
    loci: [
      { locusTag: "JCVISYN3A_0316", gene: "tkt", start: 192440, end: 194410, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0371",
    displayName: "Flippase",
    fullName: "Flippase (subunits A + B)",
    cutout: "cutouts/3A-371.png",
    loci: [
      { locusTag: "JCVISYN3A_0371", gene: "ywjA", start: 217523, end: 219394, strand: "+" },
      { locusTag: "JCVISYN3A_0372", gene: "ywjA", start: 219410, end: 221263, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0542",
    displayName: "DnaK",
    fullName: "Molecular chaperone",
    cutout: "cutouts/3A-542.png",
    loci: [
      { locusTag: "JCVISYN3A_0542", gene: "dnaK", start: 352102, end: 353877, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0601",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-601.png",
    loci: [
      { locusTag: "JCVISYN3A_0601", gene: null, start: 366679, end: 367623, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0314",
    displayName: "EcfS",
    fullName: "Uncharacterized ECF transporter S component",
    cutout: "cutouts/3A-314.png",
    loci: [
      { locusTag: "JCVISYN3A_0314", gene: "ecfS", start: 191373, end: 192107, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0439",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-439.png",
    loci: [
      { locusTag: "JCVISYN3A_0439", gene: null, start: 288217, end: 290373, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0641",
    displayName: "ECF Transporter",
    fullName: "ECF transporter (T + ATPase subunits)",
    cutout: "cutouts/3A-641.png",
    loci: [
      { locusTag: "JCVISYN3A_0641", gene: "ecfT", start: 401512, end: 402522, strand: "-" },
      { locusTag: "JCVISYN3A_0642", gene: "ecfA", start: 402536, end: 403447, strand: "-" },
      { locusTag: "JCVISYN3A_0643", gene: "ecfA", start: 403435, end: 404661, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0652",
    displayName: "Preprotein Translocase",
    fullName: "Preprotein translocase/insertase assembly",
    cutout: "cutouts/3A-652.png",
    loci: [
      { locusTag: "JCVISYN3A_0652", gene: "secY", start: 408864, end: 410312, strand: "-" },
      { locusTag: "JCVISYN3A_0774", gene: "secG", start: 456670, end: 456954, strand: "+" },
      { locusTag: "JCVISYN3A_0839", gene: "secE", start: 515188, end: 515511, strand: "+" },
      { locusTag: "JCVISYN3A_0908", gene: "yidC", start: 541408, end: 542598, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0696",
    displayName: "Uncharacterized Transporter",
    fullName: "Uncharacterized transporter",
    cutout: "cutouts/3A-696.png",
    loci: [
      { locusTag: "JCVISYN3A_0696", gene: null, start: 435985, end: 436740, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0835",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-835.png",
    loci: [
      { locusTag: "JCVISYN3A_0835", gene: null, start: 510521, end: 511828, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0876",
    displayName: "Uncharacterized Amino Acid Permease",
    fullName: "Uncharacterized amino acid permease",
    cutout: "cutouts/3A-876.png",
    loci: [
      { locusTag: "JCVISYN3A_0876", gene: null, start: 524942, end: 526522, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0143",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-143.png",
    loci: [
      { locusTag: "JCVISYN3A_0143", gene: null, start: 94520, end: 95992, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0147",
    displayName: "ClsA",
    fullName: "Cardiolipin synthase",
    cutout: "cutouts/3A-147.png",
    loci: [
      { locusTag: "JCVISYN3A_0147", gene: "clsA", start: 98466, end: 99995, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0195",
    displayName: "Spermidine/Putrescine ABC Transporter",
    fullName: "Spermidine/putrescine ABC transporter assembly",
    cutout: "cutouts/3A-195.png",
    loci: [
      { locusTag: "JCVISYN3A_0195", gene: "potC", start: 118738, end: 121848, strand: "-" },
      { locusTag: "JCVISYN3A_0196", gene: "potB", start: 121833, end: 122825, strand: "-" },
      { locusTag: "JCVISYN3A_0197", gene: "potA", start: 122825, end: 123880, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0249",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-249.png",
    loci: [
      { locusTag: "JCVISYN3A_0249", gene: null, start: 151760, end: 152338, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0296",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-296.png",
    loci: [
      { locusTag: "JCVISYN3A_0296", gene: null, start: 176894, end: 177538, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0338",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-338.png",
    loci: [
      { locusTag: "JCVISYN3A_0338", gene: null, start: 202897, end: 203616, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0401",
    displayName: "Uncharacterized Peptidase",
    fullName: "Uncharacterized peptidase",
    cutout: "cutouts/3A-401.png",
    loci: [
      { locusTag: "JCVISYN3A_0401", gene: null, start: 246267, end: 248114, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0425",
    displayName: "Phosphate ABC Transporter",
    fullName: "Phosphate ABC transporter assembly",
    cutout: "cutouts/3A-425.png",
    loci: [
      { locusTag: "JCVISYN3A_0425", gene: "pstS", start: 275282, end: 276412, strand: "+" },
      { locusTag: "JCVISYN3A_0426", gene: "pstA", start: 276464, end: 278554, strand: "+" },
      { locusTag: "JCVISYN3A_0427", gene: "pstB", start: 278547, end: 279356, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0479",
    displayName: "Uncharacterized Peptidase",
    fullName: "Uncharacterized peptidase",
    cutout: "cutouts/3A-479.png",
    loci: [
      { locusTag: "JCVISYN3A_0479", gene: null, start: 308771, end: 310417, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0518",
    displayName: "LspA",
    fullName: "Lipoprotein signal peptidase",
    cutout: "cutouts/3A-518.png",
    loci: [
      { locusTag: "JCVISYN3A_0518", gene: "lspA", start: 325942, end: 326550, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0622",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-622.png",
    loci: [
      { locusTag: "JCVISYN3A_0622", gene: null, start: 388100, end: 388462, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0636",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-636.png",
    loci: [
      { locusTag: "JCVISYN3A_0636", gene: null, start: 392583, end: 395372, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0685",
    displayName: "NatA",
    fullName: "Sodium transporter",
    cutout: "cutouts/3A-685.png",
    loci: [
      { locusTag: "JCVISYN3A_0685", gene: "natA", start: 421866, end: 423467, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0691",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-691.png",
    loci: [
      { locusTag: "JCVISYN3A_0691", gene: null, start: 429507, end: 431528, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0706",
    displayName: "Thiamine ABC Transporter",
    fullName: "Thiamine ABC transporter assembly",
    cutout: "cutouts/3A-706.png",
    loci: [
      { locusTag: "JCVISYN3A_0706", gene: "thiB", start: 438118, end: 439866, strand: "-" },
      { locusTag: "JCVISYN3A_0707", gene: "thiQ", start: 439830, end: 440579, strand: "-" },
      { locusTag: "JCVISYN3A_0708", gene: "thiB", start: 440593, end: 442056, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0787",
    displayName: "MgtA",
    fullName: "Magnesium-translocating P-type ATPase",
    cutout: "cutouts/3A-787.png",
    loci: [
      { locusTag: "JCVISYN3A_0787", gene: "mgtA", start: 463042, end: 465870, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0789",
    displayName: "F0F1 ATP Synthase",
    fullName: "F0F1 ATP synthase assembly",
    cutout: "cutouts/3A-789.png",
    loci: [
      { locusTag: "JCVISYN3A_0789", gene: "atpC", start: 466288, end: 466587, strand: "-" },
      { locusTag: "JCVISYN3A_0790", gene: "atpD", start: 466587, end: 468014, strand: "-" },
      { locusTag: "JCVISYN3A_0791", gene: "atpG", start: 468023, end: 468865, strand: "-" },
      { locusTag: "JCVISYN3A_0792", gene: "atpA", start: 468867, end: 470444, strand: "-" },
      { locusTag: "JCVISYN3A_0793", gene: "atpD", start: 470456, end: 471001, strand: "-" },
      { locusTag: "JCVISYN3A_0794", gene: "atpF", start: 471003, end: 471548, strand: "-" },
      { locusTag: "JCVISYN3A_0795", gene: "atpE", start: 471577, end: 471882, strand: "-" },
      { locusTag: "JCVISYN3A_0796", gene: "atpB", start: 471912, end: 472775, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0818",
    displayName: "Lgt",
    fullName: "Diacylglyceryl transferase",
    cutout: "cutouts/3A-818.png",
    loci: [
      { locusTag: "JCVISYN3A_0818", gene: "lgt", start: 491413, end: 492843, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0878",
    displayName: "Uncharacterized Amino Acid Permease",
    fullName: "Uncharacterized amino acid permease",
    cutout: "cutouts/3A-878.png",
    loci: [
      { locusTag: "JCVISYN3A_0878", gene: null, start: 527321, end: 528859, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0881",
    displayName: "Uncharacterized MFS Transporter",
    fullName: "Uncharacterized MFS transporter",
    cutout: "cutouts/3A-881.png",
    loci: [
      { locusTag: "JCVISYN3A_0881", gene: null, start: 531973, end: 533400, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0886",
    displayName: "GltP",
    fullName: "Proton-glutamate symporter",
    cutout: "cutouts/3A-886.png",
    loci: [
      { locusTag: "JCVISYN3A_0886", gene: "gltP", start: 535901, end: 537478, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0325",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-325.png",
    loci: [
      { locusTag: "JCVISYN3A_0325", gene: null, start: 196094, end: 197593, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0332",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-332.png",
    loci: [
      { locusTag: "JCVISYN3A_0332", gene: null, start: 201395, end: 202222, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0478",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-478.png",
    loci: [
      { locusTag: "JCVISYN3A_0478", gene: null, start: 308182, end: 308766, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0505",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-505.png",
    loci: [
      { locusTag: "JCVISYN3A_0505", gene: null, start: 319364, end: 320437, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0165",
    displayName: "Oligopeptide ABC Transporter",
    fullName: "Oligopeptide ABC transporter assembly",
    cutout: "cutouts/3A-165.png",
    loci: [
      { locusTag: "JCVISYN3A_0165", gene: "amiC", start: 108907, end: 110151, strand: "+" },
      { locusTag: "JCVISYN3A_0166", gene: null, start: 110167, end: 111177, strand: "+" },
      { locusTag: "JCVISYN3A_0167", gene: "amiE", start: 111191, end: 112891, strand: "+" },
      { locusTag: "JCVISYN3A_0168", gene: "amiF", start: 112893, end: 114761, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0248",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-248.png",
    loci: [
      { locusTag: "JCVISYN3A_0248", gene: null, start: 151198, end: 151758, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0345",
    displayName: "EcfS",
    fullName: "Uncharacterized ECF transporter S component",
    cutout: "cutouts/3A-345.png",
    loci: [
      { locusTag: "JCVISYN3A_0345", gene: "ecfS", start: 204773, end: 205663, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0398",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-398.png",
    loci: [
      { locusTag: "JCVISYN3A_0398", gene: null, start: 237760, end: 240222, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0440",
    displayName: "Uncharacterized Lipoprotein",
    fullName: "Uncharacterized lipoprotein",
    cutout: "cutouts/3A-440.png",
    loci: [
      { locusTag: "JCVISYN3A_0440", gene: null, start: 290373, end: 293309, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0516",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-516.png",
    loci: [
      { locusTag: "JCVISYN3A_0516", gene: null, start: 323735, end: 325036, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0604",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-604.png",
    loci: [
      { locusTag: "JCVISYN3A_0604", gene: null, start: 369520, end: 370188, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0605",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-605.png",
    loci: [
      { locusTag: "JCVISYN3A_0605", gene: null, start: 370371, end: 370679, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0686",
    displayName: "TrkA",
    fullName: "Potassium transporter",
    cutout: "cutouts/3A-686.png",
    loci: [
      { locusTag: "JCVISYN3A_0686", gene: "trkA", start: 423546, end: 424274, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0693",
    displayName: "Uncharacterized Protease",
    fullName: "Uncharacterized protease",
    cutout: "cutouts/3A-693.png",
    loci: [
      { locusTag: "JCVISYN3A_0693", gene: null, start: 432442, end: 433410, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0820",
    displayName: "Lgt",
    fullName: "Diacylglyceryl transferase",
    cutout: "cutouts/3A-820.png",
    loci: [
      { locusTag: "JCVISYN3A_0820", gene: "lgt", start: 493768, end: 495348, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0827",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-827.png",
    loci: [
      { locusTag: "JCVISYN3A_0827", gene: null, start: 504267, end: 505733, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0870",
    displayName: "Uncharacterized C4-Dicarboxylate ABC Transporter",
    fullName: "Uncharacterized C4-dicarboxylate ABC transporter",
    cutout: "cutouts/3A-870.png",
    loci: [
      { locusTag: "JCVISYN3A_0870", gene: null, start: 520382, end: 522148, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0877",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-877.png",
    loci: [
      { locusTag: "JCVISYN3A_0877", gene: null, start: 526669, end: 527349, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0879",
    displayName: "CorA",
    fullName: "Magnesium transporter",
    cutout: "cutouts/3A-879.png",
    loci: [
      { locusTag: "JCVISYN3A_0879", gene: "corA", start: 528917, end: 531574, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0798",
    displayName: "Upp",
    fullName: "Uracil phosphoribosyltransferase",
    cutout: "cutouts/3A-798.png",
    loci: [
      { locusTag: "JCVISYN3A_0798", gene: "upp", start: 473313, end: 473936, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0315",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-315.png",
    loci: [
      { locusTag: "JCVISYN3A_0315", gene: null, start: 192229, end: 192381, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0438",
    displayName: "HinT",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-438.png",
    loci: [
      { locusTag: "JCVISYN3A_0438", gene: "hinT", start: 287816, end: 288214, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0697",
    displayName: "Uncharacterized Glycosyl Transferase",
    fullName: "Uncharacterized glycosyl transferase",
    cutout: "cutouts/3A-697.png",
    loci: [
      { locusTag: "JCVISYN3A_0697", gene: null, start: 436740, end: 437696, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0416",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-416.png",
    loci: [
      { locusTag: "JCVISYN3A_0416", gene: null, start: 269915, end: 270304, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0298",
    displayName: "Uncharacterized L7Ae Family Protein",
    fullName: "Uncharacterized L7Ae family protein",
    cutout: "cutouts/3A-298.png",
    loci: [
      { locusTag: "JCVISYN3A_0298", gene: null, start: 179441, end: 179740, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0413",
    displayName: "Apt",
    fullName: "Adenine phosphoribosyltransferase",
    cutout: "cutouts/3A-413.png",
    loci: [
      { locusTag: "JCVISYN3A_0413", gene: "apt", start: 263747, end: 264259, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0421",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-421.png",
    loci: [
      { locusTag: "JCVISYN3A_0421", gene: null, start: 273842, end: 274153, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0411",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-411.png",
    loci: [
      { locusTag: "JCVISYN3A_0411", gene: null, start: 257951, end: 259465, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0931",
    displayName: "Met14p",
    fullName: "Adenylyl-sulfate kinase",
    cutout: "cutouts/3A-931.png",
    loci: [
      { locusTag: "JCVISYN3A_0931", gene: "met14p", start: 360403, end: 361011, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0435",
    displayName: "ManA",
    fullName: "Mannose-6-phosphate isomerase",
    cutout: "cutouts/3A-435.png",
    loci: [
      { locusTag: "JCVISYN3A_0435", gene: "manA", start: 285803, end: 286732, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0428",
    displayName: "PhoU",
    fullName: "Phosphate transport system regulatory protein",
    cutout: "cutouts/3A-428.png",
    loci: [
      { locusTag: "JCVISYN3A_0428", gene: "phoU", start: 279365, end: 280039, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0733",
    displayName: "DeoB",
    fullName: "Phosphopentomutase",
    cutout: "cutouts/3A-733.png",
    loci: [
      { locusTag: "JCVISYN3A_0733", gene: "deoB", start: 449875, end: 451551, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0418",
    displayName: "Ribonuclease III",
    fullName: "Ribonuclease III",
    cutout: "cutouts/3A-418.png",
    loci: [
      { locusTag: "JCVISYN3A_0418", gene: null, start: 270449, end: 271147, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0424",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-424.png",
    loci: [
      { locusTag: "JCVISYN3A_0424", gene: null, start: 274750, end: 275193, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0375",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-375.png",
    loci: [
      { locusTag: "JCVISYN3A_0375", gene: null, start: 223090, end: 223830, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0592",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-592.png",
    loci: [
      { locusTag: "JCVISYN3A_0592", gene: null, start: 361575, end: 362774, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0220",
    displayName: "PfkA",
    fullName: "6-Phosphofructokinase",
    cutout: "cutouts/3A-220.png",
    loci: [
      { locusTag: "JCVISYN3A_0220", gene: "pfkA", start: 133142, end: 134122, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0537",
    displayName: "PyrH",
    fullName: "UMP kinase",
    cutout: "cutouts/3A-537.png",
    loci: [
      { locusTag: "JCVISYN3A_0537", gene: "pyrH", start: 347483, end: 348196, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0918",
    displayName: "Imidazoleglycerol-Phosphate Dehydratase",
    fullName: "Imidazoleglycerol-phosphate dehydratase",
    cutout: "cutouts/3A-918.png",
    loci: [
      { locusTag: "JCVISYN3A_0918", gene: null, start: 18716, end: 19378, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0409",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-409.png",
    loci: [
      { locusTag: "JCVISYN3A_0409", gene: null, start: 255765, end: 256541, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0114",
    displayName: "BcsB",
    fullName: "Glycolipid synthase B",
    cutout: "cutouts/3A-114.png",
    loci: [
      { locusTag: "JCVISYN3A_0114", gene: "bcsB", start: 74511, end: 75431, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0142",
    displayName: "PrmC",
    fullName: "Protein-(glutamine-N5) methyltransferase, release factor-specific",
    cutout: "cutouts/3A-142.png",
    loci: [
      { locusTag: "JCVISYN3A_0142", gene: "prmC", start: 93663, end: 94511, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0215",
    displayName: "YrrK",
    fullName: "Putative pre-16S rRNA nuclease",
    cutout: "cutouts/3A-215.png",
    loci: [
      { locusTag: "JCVISYN3A_0215", gene: "yrrK", start: 130165, end: 130596, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0229",
    displayName: "Pta",
    fullName: "Phosphate acetyltransferase",
    cutout: "cutouts/3A-229.png",
    loci: [
      { locusTag: "JCVISYN3A_0229", gene: "pta", start: 141579, end: 142547, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0262",
    displayName: "Rpe",
    fullName: "Ribulose-phosphate 3-epimerase",
    cutout: "cutouts/3A-262.png",
    loci: [
      { locusTag: "JCVISYN3A_0262", gene: "rpe", start: 161214, end: 161891, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0264",
    displayName: "Uncharacterized Serine/Threonine Protein Kinase",
    fullName: "Uncharacterized serine/threonine protein kinase",
    cutout: "cutouts/3A-264.png",
    loci: [
      { locusTag: "JCVISYN3A_0264", gene: null, start: 162805, end: 163920, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0326",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-326.png",
    loci: [
      { locusTag: "JCVISYN3A_0326", gene: null, start: 197611, end: 198372, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0330",
    displayName: "Dgk",
    fullName: "Deoxyguanosine kinase",
    cutout: "cutouts/3A-330.png",
    loci: [
      { locusTag: "JCVISYN3A_0330", gene: "dgk", start: 200667, end: 201284, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0353",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-353.png",
    loci: [
      { locusTag: "JCVISYN3A_0353", gene: null, start: 209403, end: 209780, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0380",
    displayName: "NadD",
    fullName: "Nicotinate (nicotinamide) nucleotide adenylyltransferase",
    cutout: "cutouts/3A-380.png",
    loci: [
      { locusTag: "JCVISYN3A_0380", gene: "nadD", start: 226570, end: 227667, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0389",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-389.png",
    loci: [
      { locusTag: "JCVISYN3A_0389", gene: null, start: 231075, end: 233219, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0400",
    displayName: "Uncharacterized Protease",
    fullName: "Uncharacterized protease",
    cutout: "cutouts/3A-400.png",
    loci: [
      { locusTag: "JCVISYN3A_0400", gene: null, start: 245681, end: 246232, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0408",
    displayName: "TrmK",
    fullName: "Uncharacterized methyltransferase",
    cutout: "cutouts/3A-408.png",
    loci: [
      { locusTag: "JCVISYN3A_0408", gene: "trmK", start: 255101, end: 255778, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0410",
    displayName: "Uncharacterized Helicase",
    fullName: "Uncharacterized helicase",
    cutout: "cutouts/3A-410.png",
    loci: [
      { locusTag: "JCVISYN3A_0410", gene: null, start: 256550, end: 257911, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0414",
    displayName: "RelA",
    fullName: "Guanosine-3',5'-bis(diphosphate) 3'-pyrophosphohydrolase",
    cutout: "cutouts/3A-414.png",
    loci: [
      { locusTag: "JCVISYN3A_0414", gene: "relA", start: 264342, end: 266606, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0451",
    displayName: "Gapdh",
    fullName: "Glyceraldehyde-3-phosphate dehydrogenase",
    cutout: "cutouts/3A-451.png",
    loci: [
      { locusTag: "JCVISYN3A_0451", gene: "gapdh", start: 300656, end: 302071, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0503",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-503.png",
    loci: [
      { locusTag: "JCVISYN3A_0503", gene: null, start: 317677, end: 318078, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0530",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-530.png",
    loci: [
      { locusTag: "JCVISYN3A_0530", gene: null, start: 339482, end: 340090, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0549",
    displayName: "RgdB",
    fullName: "Non-canonical purine NTP pyrophosphatase",
    cutout: "cutouts/3A-549.png",
    loci: [
      { locusTag: "JCVISYN3A_0549", gene: "rgdB", start: 359294, end: 359896, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0600",
    displayName: "Ribonuclease J",
    fullName: "Ribonuclease J",
    cutout: "cutouts/3A-600.png",
    loci: [
      { locusTag: "JCVISYN3A_0600", gene: "rnjA", start: 364772, end: 366604, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0610",
    displayName: "MutM",
    fullName: "DNA-formamidopyrimidine glycosylase",
    cutout: "cutouts/3A-610.png",
    loci: [
      { locusTag: "JCVISYN3A_0610", gene: "mutM", start: 375678, end: 376502, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0614",
    displayName: "PncB",
    fullName: "Nicotinate phosphoribosyltransferase",
    cutout: "cutouts/3A-614.png",
    loci: [
      { locusTag: "JCVISYN3A_0614", gene: "pncB", start: 383668, end: 384729, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0728",
    displayName: "Uncharacterized Hydrolase",
    fullName: "Uncharacterized hydrolase",
    cutout: "cutouts/3A-728.png",
    loci: [
      { locusTag: "JCVISYN3A_0728", gene: null, start: 446009, end: 446845, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0747",
    displayName: "PunA",
    fullName: "Purine-nucleoside phosphorylase",
    cutout: "cutouts/3A-747.png",
    loci: [
      { locusTag: "JCVISYN3A_0747", gene: "punA", start: 451915, end: 452568, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0799",
    displayName: "GlyA",
    fullName: "Serine hydroxymethyltransferase",
    cutout: "cutouts/3A-799.png",
    loci: [
      { locusTag: "JCVISYN3A_0799", gene: "glyA", start: 474036, end: 475277, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0805",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-805.png",
    loci: [
      { locusTag: "JCVISYN3A_0805", gene: null, start: 483516, end: 484691, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0813",
    displayName: "GalE",
    fullName: "UDP-glucose 4-epimerase GalE",
    cutout: "cutouts/3A-813.png",
    loci: [
      { locusTag: "JCVISYN3A_0813", gene: "galE", start: 487642, end: 488640, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0814",
    displayName: "Glf",
    fullName: "UDP-galactopyranose mutase",
    cutout: "cutouts/3A-814.png",
    loci: [
      { locusTag: "JCVISYN3A_0814", gene: "glf", start: 488654, end: 489841, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0831",
    displayName: "Prs",
    fullName: "Phosphoribosylpyrophosphate synthetase",
    cutout: "cutouts/3A-831.png",
    loci: [
      { locusTag: "JCVISYN3A_0831", gene: "prs", start: 506551, end: 507585, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0887",
    displayName: "Cdr",
    fullName: "Coenzyme A Disulfide Reductase",
    cutout: "cutouts/3A-887.png",
    loci: [
      { locusTag: "JCVISYN3A_0887", gene: "cdr", start: 537498, end: 538841, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0906",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-906.png",
    loci: [
      { locusTag: "JCVISYN3A_0906", gene: null, start: 539821, end: 540537, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0913",
    displayName: "TetM",
    fullName: "Tetracycline resistance ribosomal protection protein",
    cutout: "cutouts/3A-913.png",
    loci: [
      { locusTag: "JCVISYN3A_0913", gene: "tetM", start: 20416, end: 22335, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0129",
    displayName: "PyrG",
    fullName: "CTP synthase",
    cutout: "cutouts/3A-129.png",
    loci: [
      { locusTag: "JCVISYN3A_0129", gene: "pyrG", start: 81617, end: 83215, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0281",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-281.png",
    loci: [
      { locusTag: "JCVISYN3A_0281", gene: null, start: 165787, end: 166467, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0290",
    displayName: "TruB",
    fullName: "tRNA pseudouridine(55) synthase",
    cutout: "cutouts/3A-290.png",
    loci: [
      { locusTag: "JCVISYN3A_0290", gene: "truB", start: 174743, end: 175621, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0302",
    displayName: "Fre",
    fullName: "Flavin reductase",
    cutout: "cutouts/3A-302.png",
    loci: [
      { locusTag: "JCVISYN3A_0302", gene: "fre", start: 182359, end: 183009, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0352",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-352.png",
    loci: [
      { locusTag: "JCVISYN3A_0352", gene: null, start: 208791, end: 209339, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0376",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-376.png",
    loci: [
      { locusTag: "JCVISYN3A_0376", gene: null, start: 223802, end: 224146, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0432",
    displayName: "MetK",
    fullName: "Methionine adenosyltransferase",
    cutout: "cutouts/3A-432.png",
    loci: [
      { locusTag: "JCVISYN3A_0432", gene: "metK", start: 282631, end: 283794, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0443",
    displayName: "YggN",
    fullName: "5-Formyltetrahydrofolate cyclo-ligase",
    cutout: "cutouts/3A-443.png",
    loci: [
      { locusTag: "JCVISYN3A_0443", gene: "yggN", start: 295183, end: 295746, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0730",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-730.png",
    loci: [
      { locusTag: "JCVISYN3A_0730", gene: null, start: 448543, end: 449142, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0819",
    displayName: "Trx",
    fullName: "Thioredoxin-disulfide reductase",
    cutout: "cutouts/3A-819.png",
    loci: [
      { locusTag: "JCVISYN3A_0819", gene: "trx", start: 492852, end: 493784, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0138",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-138.png",
    loci: [
      { locusTag: "JCVISYN3A_0138", gene: null, start: 89084, end: 90982, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0140",
    displayName: "Tdk",
    fullName: "Thymidine kinase",
    cutout: "cutouts/3A-140.png",
    loci: [
      { locusTag: "JCVISYN3A_0140", gene: "tdk", start: 91944, end: 92573, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0141",
    displayName: "PrfA",
    fullName: "Peptide chain release factor 1",
    cutout: "cutouts/3A-141.png",
    loci: [
      { locusTag: "JCVISYN3A_0141", gene: "prfA", start: 92576, end: 93670, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0154",
    displayName: "Uncharacterized Peptidase",
    fullName: "Uncharacterized peptidase",
    cutout: "cutouts/3A-154.png",
    loci: [
      { locusTag: "JCVISYN3A_0154", gene: null, start: 311816, end: 313171, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0201",
    displayName: "Def",
    fullName: "Peptide deformylase",
    cutout: "cutouts/3A-201.png",
    loci: [
      { locusTag: "JCVISYN3A_0201", gene: "def", start: 125583, end: 126185, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0283",
    displayName: "RnhA",
    fullName: "Double-stranded RNA binding RNase HI",
    cutout: "cutouts/3A-283.png",
    loci: [
      { locusTag: "JCVISYN3A_0283", gene: "rnhA", start: 167885, end: 168502, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0285",
    displayName: "LepA",
    fullName: "Elongation factor 4",
    cutout: "cutouts/3A-285.png",
    loci: [
      { locusTag: "JCVISYN3A_0285", gene: "lepA; EF4", start: 168527, end: 170329, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0291",
    displayName: "RibF",
    fullName: "FAD synthetase",
    cutout: "cutouts/3A-291.png",
    loci: [
      { locusTag: "JCVISYN3A_0291", gene: "ribF", start: 175608, end: 176162, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0317",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-317.png",
    loci: [
      { locusTag: "JCVISYN3A_0317", gene: null, start: 194426, end: 194671, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0344",
    displayName: "Ppa",
    fullName: "Inorganic diphosphatase",
    cutout: "cutouts/3A-344.png",
    loci: [
      { locusTag: "JCVISYN3A_0344", gene: "ppa", start: 204074, end: 204634, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0347",
    displayName: "Cmk",
    fullName: "Cytidylate kinase",
    cutout: "cutouts/3A-347.png",
    loci: [
      { locusTag: "JCVISYN3A_0347", gene: "cmk", start: 206433, end: 207095, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0366",
    displayName: "YlqF",
    fullName: "L16-binding dependent 50S subunit-maturation GTPase",
    cutout: "cutouts/3A-366.png",
    loci: [
      { locusTag: "JCVISYN3A_0366", gene: "ylqF; rbgA", start: 216192, end: 217142, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0378",
    displayName: "NadE",
    fullName: "NAD(+) synthase",
    cutout: "cutouts/3A-378.png",
    loci: [
      { locusTag: "JCVISYN3A_0378", gene: "nadE", start: 225520, end: 226257, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0381",
    displayName: "MtnN",
    fullName: "5'-Methylthioadenosine nucleosidase",
    cutout: "cutouts/3A-381.png",
    loci: [
      { locusTag: "JCVISYN3A_0381", gene: "mtnN", start: 227672, end: 228331, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0394",
    displayName: "Lon",
    fullName: "Endopeptidase La",
    cutout: "cutouts/3A-394.png",
    loci: [
      { locusTag: "JCVISYN3A_0394", gene: "lon", start: 235262, end: 237622, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0441",
    displayName: "IscS",
    fullName: "Cysteine desulfurase",
    cutout: "cutouts/3A-441.png",
    loci: [
      { locusTag: "JCVISYN3A_0441", gene: "iscS", start: 293512, end: 294750, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0475",
    displayName: "Ldh",
    fullName: "L-lactate dehydrogenase",
    cutout: "cutouts/3A-475.png",
    loci: [
      { locusTag: "JCVISYN3A_0475", gene: "ldh", start: 307123, end: 308079, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0493",
    displayName: "Uncharacterized Peptidase",
    fullName: "Uncharacterized peptidase",
    cutout: "cutouts/3A-493.png",
    loci: [
      { locusTag: "JCVISYN3A_0493", gene: null, start: 313335, end: 314684, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0504",
    displayName: "RsmI",
    fullName: "16S rRNA (cytidine(1402)-2'-O)-methyltransferase",
    cutout: "cutouts/3A-504.png",
    loci: [
      { locusTag: "JCVISYN3A_0504", gene: "rsmI", start: 318101, end: 318988, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0527",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-527.png",
    loci: [
      { locusTag: "JCVISYN3A_0527", gene: null, start: 335489, end: 336007, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0593",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-593.png",
    loci: [
      { locusTag: "JCVISYN3A_0593", gene: null, start: 363271, end: 363549, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0606",
    displayName: "Pgk",
    fullName: "Phosphoglycerate kinase",
    cutout: "cutouts/3A-606.png",
    loci: [
      { locusTag: "JCVISYN3A_0606", gene: "pgk", start: 370946, end: 372160, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0607",
    displayName: "GapDH",
    fullName: "Type I glyceraldehyde-3-phosphate dehydrogenase",
    cutout: "cutouts/3A-607.png",
    loci: [
      { locusTag: "JCVISYN3A_0607", gene: "gapDH", start: 372272, end: 373288, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0615",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-615.png",
    loci: [
      { locusTag: "JCVISYN3A_0615", gene: null, start: 384707, end: 385315, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0650",
    displayName: "Map",
    fullName: "Type I methionyl aminopeptidase",
    cutout: "cutouts/3A-650.png",
    loci: [
      { locusTag: "JCVISYN3A_0650", gene: "map", start: 407340, end: 408095, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0684",
    displayName: "FolD",
    fullName: "5,10-Methylene-tetrahydrofolate dehydrogenase/cyclohydrolase",
    cutout: "cutouts/3A-684.png",
    loci: [
      { locusTag: "JCVISYN3A_0684", gene: "folD", start: 420991, end: 421857, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0710",
    displayName: "Uncharacterized Hydrolase",
    fullName: "Uncharacterized hydrolase",
    cutout: "cutouts/3A-710.png",
    loci: [
      { locusTag: "JCVISYN3A_0710", gene: null, start: 442279, end: 443142, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0727",
    displayName: "TpiA",
    fullName: "Triose-phosphate isomerase",
    cutout: "cutouts/3A-727.png",
    loci: [
      { locusTag: "JCVISYN3A_0727", gene: "tpiA", start: 445270, end: 446016, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0729",
    displayName: "Pgm",
    fullName: "Phosphoglycerate mutase",
    cutout: "cutouts/3A-729.png",
    loci: [
      { locusTag: "JCVISYN3A_0729", gene: "pgm", start: 446848, end: 448443, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0732",
    displayName: "DeoC",
    fullName: "Deoxyribose-phosphate aldolase",
    cutout: "cutouts/3A-732.png",
    loci: [
      { locusTag: "JCVISYN3A_0732", gene: "deoC", start: 449195, end: 449863, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0771",
    displayName: "Ribonucleotide Reductase",
    fullName: "Ribonucleotide-diphosphate reductase",
    cutout: "cutouts/3A-771.png",
    loci: [
      { locusTag: "JCVISYN3A_0771", gene: "nrdE", start: 452721, end: 454883, strand: "-" },
      { locusTag: "JCVISYN3A_0772", gene: "nrdI", start: 454870, end: 455343, strand: "-" },
      { locusTag: "JCVISYN3A_0773", gene: "nrdF", start: 455352, end: 456371, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0775",
    displayName: "Rnr",
    fullName: "Ribonuclease R",
    cutout: "cutouts/3A-775.png",
    loci: [
      { locusTag: "JCVISYN3A_0775", gene: "rnr", start: 456990, end: 459104, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0821",
    displayName: "Hpr",
    fullName: "HPr(Ser) kinase/phosphatase",
    cutout: "cutouts/3A-821.png",
    loci: [
      { locusTag: "JCVISYN3A_0821", gene: "hpr; ptsH", start: 495359, end: 496300, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0853",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-853.png",
    loci: [
      { locusTag: "JCVISYN3A_0853", gene: null, start: 517243, end: 517962, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0872",
    displayName: "YchF",
    fullName: "Uncharacterized ATPase",
    cutout: "cutouts/3A-872.png",
    loci: [
      { locusTag: "JCVISYN3A_0872", gene: "ychF", start: 522217, end: 523311, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0873",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-873.png",
    loci: [
      { locusTag: "JCVISYN3A_0873", gene: null, start: 523347, end: 523547, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0127",
    displayName: "Uncharacterized Phosphohydrolase",
    fullName: "Uncharacterized phosphohydrolase",
    cutout: "cutouts/3A-127.png",
    loci: [
      { locusTag: "JCVISYN3A_0127", gene: null, start: 79857, end: 81071, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0131",
    displayName: "FbaA",
    fullName: "Fructose-1,6-bisphosphate aldolase",
    cutout: "cutouts/3A-131.png",
    loci: [
      { locusTag: "JCVISYN3A_0131", gene: "fbaA", start: 83504, end: 84397, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0132",
    displayName: "IetA",
    fullName: "Toxin-antitoxin AAA ATPase",
    cutout: "cutouts/3A-132.png",
    loci: [
      { locusTag: "JCVISYN3A_0132", gene: "ietA", start: 84546, end: 85607, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0133",
    displayName: "IetS",
    fullName: "Toxin-antitoxin serine protease",
    cutout: "cutouts/3A-133.png",
    loci: [
      { locusTag: "JCVISYN3A_0133", gene: "ietS", start: 85600, end: 87873, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0145",
    displayName: "Uncharacterized Acetyltransferase",
    fullName: "Uncharacterized acetyltransferase",
    cutout: "cutouts/3A-145.png",
    loci: [
      { locusTag: "JCVISYN3A_0145", gene: null, start: 96616, end: 97530, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0146",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-146.png",
    loci: [
      { locusTag: "JCVISYN3A_0146", gene: null, start: 97759, end: 98466, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0213",
    displayName: "Eno",
    fullName: "Phosphopyruvate hydratase",
    cutout: "cutouts/3A-213.png",
    loci: [
      { locusTag: "JCVISYN3A_0213", gene: "eno", start: 127920, end: 129275, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0216",
    displayName: "HptA",
    fullName: "Hypoxanthine phosphoribosyltransferase",
    cutout: "cutouts/3A-216.png",
    loci: [
      { locusTag: "JCVISYN3A_0216", gene: "hptA", start: 130602, end: 131174, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0221",
    displayName: "Pyk",
    fullName: "Pyruvate kinase",
    cutout: "cutouts/3A-221.png",
    loci: [
      { locusTag: "JCVISYN3A_0221", gene: "pyk", start: 134193, end: 135629, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0247",
    displayName: "YsxC",
    fullName: "Ribosome biogenesis GTP-binding protein",
    cutout: "cutouts/3A-247.png",
    loci: [
      { locusTag: "JCVISYN3A_0247", gene: "ysxC; yihA", start: 150614, end: 151204, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0259",
    displayName: "NadK",
    fullName: "NAD(+) kinase",
    cutout: "cutouts/3A-259.png",
    loci: [
      { locusTag: "JCVISYN3A_0259", gene: "nadK", start: 157516, end: 158313, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0263",
    displayName: "Ribosome Small Subunit-Dependent GTPase A",
    fullName: "Ribosome small subunit-dependent GTPase A",
    cutout: "cutouts/3A-263.png",
    loci: [
      { locusTag: "JCVISYN3A_0263", gene: null, start: 161893, end: 162795, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0329",
    displayName: "RluB",
    fullName: "Uncharacterized pseudouridine synthase",
    cutout: "cutouts/3A-329.png",
    loci: [
      { locusTag: "JCVISYN3A_0329", gene: "rluB", start: 199899, end: 200657, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0373",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-373.png",
    loci: [
      { locusTag: "JCVISYN3A_0373", gene: null, start: 221297, end: 222904, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0377",
    displayName: "ObgE",
    fullName: "Ribosome GTPase",
    cutout: "cutouts/3A-377.png",
    loci: [
      { locusTag: "JCVISYN3A_0377", gene: "obgE", start: 224217, end: 225518, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0382",
    displayName: "Dnk",
    fullName: "Deoxynucleoside kinase",
    cutout: "cutouts/3A-382.png",
    loci: [
      { locusTag: "JCVISYN3A_0382", gene: "dnk", start: 228341, end: 228979, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0392",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-392.png",
    loci: [
      { locusTag: "JCVISYN3A_0392", gene: null, start: 234821, end: 235123, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0433",
    displayName: "CutC",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-433.png",
    loci: [
      { locusTag: "JCVISYN3A_0433", gene: "cutC", start: 283785, end: 284468, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0442",
    displayName: "IscU",
    fullName: "Iron-sulfur cluster assembly scaffold protein",
    cutout: "cutouts/3A-442.png",
    loci: [
      { locusTag: "JCVISYN3A_0442", gene: "iscU", start: 294753, end: 295190, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0444",
    displayName: "Uncharacterized Peptidase",
    fullName: "Uncharacterized peptidase",
    cutout: "cutouts/3A-444.png",
    loci: [
      { locusTag: "JCVISYN3A_0444", gene: null, start: 295767, end: 297662, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0445",
    displayName: "Pgi",
    fullName: "Glucose-6-phosphate isomerase",
    cutout: "cutouts/3A-445.png",
    loci: [
      { locusTag: "JCVISYN3A_0445", gene: "pgi", start: 297882, end: 299165, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0447",
    displayName: "Dut",
    fullName: "dUTP diphosphatase",
    cutout: "cutouts/3A-447.png",
    loci: [
      { locusTag: "JCVISYN3A_0447", gene: "dut", start: 299198, end: 299701, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0494",
    displayName: "NanE",
    fullName: "N-acetylmannosamine-6-phosphate 2-epimerase",
    cutout: "cutouts/3A-494.png",
    loci: [
      { locusTag: "JCVISYN3A_0494", gene: "nanE", start: 314840, end: 315520, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0511",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-511.png",
    loci: [
      { locusTag: "JCVISYN3A_0511", gene: null, start: 321082, end: 321705, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0623",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-623.png",
    loci: [
      { locusTag: "JCVISYN3A_0623", gene: null, start: 388449, end: 389519, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0687",
    displayName: "Glutamyl-tRNA Amidotransferase",
    fullName: "Glutamyl-tRNA amidotransferase",
    cutout: "cutouts/3A-687.png",
    loci: [
      { locusTag: "JCVISYN3A_0687", gene: "gatB", start: 424301, end: 425740, strand: "-" },
      { locusTag: "JCVISYN3A_0688", gene: "gatA", start: 425742, end: 427199, strand: "-" },
      { locusTag: "JCVISYN3A_0689", gene: "gatC", start: 427199, end: 427495, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0726",
    displayName: "NagB",
    fullName: "Glucosamine-6-phosphate deaminase",
    cutout: "cutouts/3A-726.png",
    loci: [
      { locusTag: "JCVISYN3A_0726", gene: "nagB", start: 444438, end: 445172, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0203",
    displayName: "Gmk",
    fullName: "Guanylate kinase",
    cutout: "cutouts/3A-203.png",
    loci: [
      { locusTag: "JCVISYN3A_0203", gene: "gmk", start: 126819, end: 127712, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0230",
    displayName: "AckA",
    fullName: "Acetate kinase",
    cutout: "cutouts/3A-230.png",
    loci: [
      { locusTag: "JCVISYN3A_0230", gene: "ackA", start: 142560, end: 143741, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0250",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-250.png",
    loci: [
      { locusTag: "JCVISYN3A_0250", gene: null, start: 152341, end: 153030, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0286",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-286.png",
    loci: [
      { locusTag: "JCVISYN3A_0286", gene: null, start: 170355, end: 171161, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0305",
    displayName: "Uncharacterized Metallopeptidase",
    fullName: "Uncharacterized metallopeptidase",
    cutout: "cutouts/3A-305.png",
    loci: [
      { locusTag: "JCVISYN3A_0305", gene: null, start: 188706, end: 189782, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0431",
    displayName: "Uncharacterized Metallophosphoesterase",
    fullName: "Uncharacterized metallophosphoesterase",
    cutout: "cutouts/3A-431.png",
    loci: [
      { locusTag: "JCVISYN3A_0431", gene: null, start: 281648, end: 282421, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0495",
    displayName: "Uncharacterized Kinase",
    fullName: "Uncharacterized kinase",
    cutout: "cutouts/3A-495.png",
    loci: [
      { locusTag: "JCVISYN3A_0495", gene: null, start: 315579, end: 316454, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0538",
    displayName: "Uncharacterized Protein",
    fullName: "Uncharacterized protein",
    cutout: "cutouts/3A-538.png",
    loci: [
      { locusTag: "JCVISYN3A_0538", gene: null, start: 348330, end: 348935, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0545",
    displayName: "ClpB",
    fullName: "ATP-dependent Clp protease subunit B",
    cutout: "cutouts/3A-545.png",
    loci: [
      { locusTag: "JCVISYN3A_0545", gene: "clpB", start: 355567, end: 357708, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0651",
    displayName: "Adk",
    fullName: "Adenylate kinase",
    cutout: "cutouts/3A-651.png",
    loci: [
      { locusTag: "JCVISYN3A_0651", gene: "adk", start: 408095, end: 408736, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0800",
    displayName: "RpiB",
    fullName: "Ribose 5-phosphate isomerase B",
    cutout: "cutouts/3A-800.png",
    loci: [
      { locusTag: "JCVISYN3A_0800", gene: "rpiB", start: 475261, end: 475704, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0907",
    displayName: "Uncharacterized Hydrolase",
    fullName: "Uncharacterized hydrolase",
    cutout: "cutouts/3A-907.png",
    loci: [
      { locusTag: "JCVISYN3A_0907", gene: null, start: 540537, end: 541331, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0359",
    displayName: "Ribonuclease Y",
    fullName: "Ribonuclease Y",
    cutout: "cutouts/3A-359.png",
    loci: [
      { locusTag: "JCVISYN3A_0359", gene: null, start: 210712, end: 212241, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0692",
    displayName: "Uncharacterized Pseudouridine Synthase",
    fullName: "Uncharacterized pseudouridine synthase",
    cutout: "cutouts/3A-692.png",
    loci: [
      { locusTag: "JCVISYN3A_0692", gene: null, start: 431531, end: 432439, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0885",
    displayName: "MnmG",
    fullName: "tRNA uridine(34) 5-carboxymethylaminomethyl synthesis enzyme",
    cutout: "cutouts/3A-885.png",
    loci: [
      { locusTag: "JCVISYN3A_0885", gene: "mnmG; gidA", start: 533864, end: 535753, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0257",
    displayName: "RnjB",
    fullName: "RNase J family beta-CASP ribonuclease",
    cutout: "cutouts/3A-257.png",
    loci: [
      { locusTag: "JCVISYN3A_0257", gene: "rnjB", start: 155628, end: 157379, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0240",
    displayName: "ThiI",
    fullName: "tRNA 4-thiouridine(8) synthase",
    cutout: "cutouts/3A-240.png",
    loci: [
      { locusTag: "JCVISYN3A_0240", gene: "thiI", start: 149254, end: 150441, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0390",
    displayName: "Fmt",
    fullName: "Methionyl-tRNA formyltransferase",
    cutout: "cutouts/3A-390.png",
    loci: [
      { locusTag: "JCVISYN3A_0390", gene: "fmt", start: 233209, end: 234162, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0126",
    displayName: "GluRS",
    fullName: "Glutamate--tRNA ligase",
    cutout: "cutouts/3A-126.png",
    loci: [
      { locusTag: "JCVISYN3A_0126", gene: "gluRS", start: 78403, end: 79854, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0260",
    displayName: "ValRS",
    fullName: "Valine--tRNA ligase",
    cutout: "cutouts/3A-260.png",
    loci: [
      { locusTag: "JCVISYN3A_0260", gene: "valRS", start: 158424, end: 161042, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0519",
    displayName: "IleRS",
    fullName: "Isoleucine--tRNA ligase",
    cutout: "cutouts/3A-519.png",
    loci: [
      { locusTag: "JCVISYN3A_0519", gene: "ileRS", start: 326541, end: 329288, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0539",
    displayName: "Tsf",
    fullName: "Translation elongation factor Ts",
    cutout: "cutouts/3A-539.png",
    loci: [
      { locusTag: "JCVISYN3A_0539", gene: "tsf", start: 348935, end: 349822, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0613",
    displayName: "TyrRS",
    fullName: "Tyrosine--tRNA ligase",
    cutout: "cutouts/3A-613.png",
    loci: [
      { locusTag: "JCVISYN3A_0613", gene: "tyrRS", start: 382415, end: 383659, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0402",
    displayName: "YbeY",
    fullName: "rRNA maturation RNase",
    cutout: "cutouts/3A-402.png",
    loci: [
      { locusTag: "JCVISYN3A_0402", gene: "ybeY", start: 248119, end: 248613, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0403",
    displayName: "Era",
    fullName: "Ribosome GTPase",
    cutout: "cutouts/3A-403.png",
    loci: [
      { locusTag: "JCVISYN3A_0403", gene: "era", start: 248617, end: 249522, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0282",
    displayName: "ProRS",
    fullName: "Proline--tRNA ligase",
    cutout: "cutouts/3A-282.png",
    loci: [
      { locusTag: "JCVISYN3A_0282", gene: "proRS", start: 166448, end: 167872, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0301",
    displayName: "RimP",
    fullName: "Ribosome assembly cofactor",
    cutout: "cutouts/3A-301.png",
    loci: [
      { locusTag: "JCVISYN3A_0301", gene: "rimP", start: 181752, end: 182246, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0361",
    displayName: "RlmH",
    fullName: "23S rRNA (pseudouridine(1915)-N3)-methyltransferase",
    cutout: "cutouts/3A-361.png",
    loci: [
      { locusTag: "JCVISYN3A_0361", gene: "rlmH", start: 213622, end: 214089, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0448",
    displayName: "Uncharacterized rRNA Methyltransferase",
    fullName: "Uncharacterized rRNA methyltransferase",
    cutout: "cutouts/3A-448.png",
    loci: [
      { locusTag: "JCVISYN3A_0448", gene: null, start: 299718, end: 300485, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0517",
    displayName: "RluD",
    fullName: "Uncharacterized RNA pseudouridine synthase",
    cutout: "cutouts/3A-517.png",
    loci: [
      { locusTag: "JCVISYN3A_0517", gene: "rluD", start: 325029, end: 325961, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0528",
    displayName: "Phenylalanine-tRNA Ligase",
    fullName: "Phenylalanine--tRNA ligase",
    cutout: "cutouts/3A-528.png",
    loci: [
      { locusTag: "JCVISYN3A_0528", gene: "pheRS", start: 336007, end: 338391, strand: "-" },
      { locusTag: "JCVISYN3A_0529", gene: "pheS", start: 338400, end: 339452, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0163",
    displayName: "AlaRS",
    fullName: "Alanine--tRNA ligase",
    cutout: "cutouts/3A-163.png",
    loci: [
      { locusTag: "JCVISYN3A_0163", gene: "alaRS", start: 105431, end: 108121, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0222",
    displayName: "ThrRS",
    fullName: "Threonine--tRNA ligase",
    cutout: "cutouts/3A-222.png",
    loci: [
      { locusTag: "JCVISYN3A_0222", gene: "thrRS", start: 135894, end: 137813, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0287",
    displayName: "AspRS",
    fullName: "Aspartate--tRNA ligase",
    cutout: "cutouts/3A-287.png",
    loci: [
      { locusTag: "JCVISYN3A_0287", gene: "aspRS", start: 171178, end: 172902, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0288",
    displayName: "HisRS",
    fullName: "Histidine--tRNA ligase",
    cutout: "cutouts/3A-288.png",
    loci: [
      { locusTag: "JCVISYN3A_0288", gene: "hisRS", start: 172911, end: 174155, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0348",
    displayName: "EngA",
    fullName: "Ribosome biogenesis GTPase",
    cutout: "cutouts/3A-348.png",
    loci: [
      { locusTag: "JCVISYN3A_0348", gene: "engA", start: 207102, end: 208409, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0364",
    displayName: "TrmD",
    fullName: "tRNA (guanosine(37)-N1)-methyltransferase",
    cutout: "cutouts/3A-364.png",
    loci: [
      { locusTag: "JCVISYN3A_0364", gene: "trmD", start: 214986, end: 215708, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0387",
    displayName: "MnmA",
    fullName: "tRNA 2-thiouridine(34) synthase",
    cutout: "cutouts/3A-387.png",
    loci: [
      { locusTag: "JCVISYN3A_0387", gene: "mnmA", start: 229208, end: 230335, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0500",
    displayName: "Prp",
    fullName: "Maturation protease for ribosomal protein L27",
    cutout: "cutouts/3A-500.png",
    loci: [
      { locusTag: "JCVISYN3A_0500", gene: "prp;ysxB", start: 316912, end: 317226, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0548",
    displayName: "tRNA (Cytidine(34)-2'-O)-Methyltransferase",
    fullName: "tRNA (cytidine(34)-2'-O)-methyltransferase",
    cutout: "cutouts/3A-548.png",
    loci: [
      { locusTag: "JCVISYN3A_0548", gene: null, start: 358736, end: 359281, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0640",
    displayName: "TruA",
    fullName: "tRNA pseudouridine(38-40) synthase",
    cutout: "cutouts/3A-640.png",
    loci: [
      { locusTag: "JCVISYN3A_0640", gene: "truA", start: 400754, end: 401509, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0823",
    displayName: "FolC",
    fullName: "Dihydrofolate synthase",
    cutout: "cutouts/3A-823.png",
    loci: [
      { locusTag: "JCVISYN3A_0823", gene: "folC", start: 497075, end: 498190, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0837",
    displayName: "CysRS",
    fullName: "Cysteine--tRNA ligase",
    cutout: "cutouts/3A-837.png",
    loci: [
      { locusTag: "JCVISYN3A_0837", gene: "cysRS", start: 512905, end: 514230, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0838",
    displayName: "RlmB",
    fullName: "23S rRNA (guanosine(2251)-2'-O)-methyltransferase",
    cutout: "cutouts/3A-838.png",
    loci: [
      { locusTag: "JCVISYN3A_0838", gene: "rlmB", start: 514232, end: 514966, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0308",
    displayName: "TrpRS",
    fullName: "Tryptophan--tRNA ligase",
    cutout: "cutouts/3A-308.png",
    loci: [
      { locusTag: "JCVISYN3A_0308", gene: "trpRS", start: 190227, end: 191237, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0405",
    displayName: "GlyRS",
    fullName: "Glycine--tRNA ligase",
    cutout: "cutouts/3A-405.png",
    loci: [
      { locusTag: "JCVISYN3A_0405", gene: "glyRS", start: 250335, end: 251705, strand: "+" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0535",
    displayName: "ArgRS",
    fullName: "Arginine--tRNA ligase",
    cutout: "cutouts/3A-535.png",
    loci: [
      { locusTag: "JCVISYN3A_0535", gene: "argRS", start: 345258, end: 346922, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  },
  {
    id: "0541",
    displayName: "DnaJ",
    fullName: "Molecular chaperone",
    cutout: "cutouts/3A-541.png",
    loci: [
      { locusTag: "JCVISYN3A_0541", gene: "dnaJ", start: 350920, end: 352038, strand: "-" }
    ],
    description: "",
    links: [
      { label: "SynWiki", url: "https://synwiki.uni-goettingen.de/" }
    ]
  }
];
