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
  }
];
