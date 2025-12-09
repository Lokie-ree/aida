import { Helmet } from "react-helmet-async";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  noindex?: boolean;
}

const DEFAULT_TITLE = "Pelican AI - Intelligent Coaching for Louisiana Educators";
const DEFAULT_DESCRIPTION =
  "Conversational AI coach that helps Louisiana K-12 educators generate high-quality, Louisiana-aligned prompts for ChatGPT, Claude, Gemini, and more. Demonstrates knowledge of LER, LSS, and LEADS evaluation framework.";
const DEFAULT_IMAGE = "https://www.pelicanai.org/og-preview.png";
const DEFAULT_URL = "https://www.pelicanai.org";
const SITE_NAME = "Pelican AI";

export function Metadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = DEFAULT_URL,
  type = "website",
  noindex = false,
}: MetadataProps) {
  const fullTitle = title.includes("Pelican AI") ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = url.startsWith("http") ? url : `${DEFAULT_URL}${url}`;
  const fullImage = image.startsWith("http") ? image : `${DEFAULT_URL}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@pelicanai" />

      {/* Additional Meta Tags */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}

