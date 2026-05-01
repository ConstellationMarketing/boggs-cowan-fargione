import { Phone } from "lucide-react";
import type { ContentBlock } from "@site/lib/blocks";
import PageHero from "@site/components/shared/PageHero";
import { normalizeSharedHeroContent } from "@site/lib/cms/sharedHero";

interface HeroBlockProps {
  block: Extract<ContentBlock, { type: "hero" }>;
}

export default function HeroBlock({ block }: HeroBlockProps) {
  return <PageHero content={normalizeSharedHeroContent(block)} underHeader={false} />;
}
