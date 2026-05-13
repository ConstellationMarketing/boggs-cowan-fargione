import type { ContentBlock } from "@site/lib/blocks";
import StructuredPagePreview from "@site/components/StructuredPagePreview";
import HeroBlock from "@site/components/blocks/HeroBlock";
import HeadingBlock from "@site/components/blocks/HeadingBlock";
import ContentSectionBlock from "@site/components/blocks/ContentSectionBlock";
import CTABlock from "@site/components/blocks/CTABlock";
import TeamMembersBlock from "@site/components/blocks/TeamMembersBlock";
import TestimonialsBlock from "@site/components/blocks/TestimonialsBlock";
import ContactSectionBlock from "@site/components/blocks/ContactSectionBlock";
import MapBlock from "@site/components/blocks/MapBlock";
import PracticeAreasGridBlock from "@site/components/blocks/PracticeAreasGridBlock";
import RecentPostsBlock from "@site/components/blocks/RecentPostsBlock";
import LegacyBlock from "@site/components/blocks/LegacyBlock";
import SectionTransition from "@site/components/shared/SectionTransition";

interface BlockRendererProps {
  content: ContentBlock[] | Record<string, unknown> | null | undefined;
  isPreview?: boolean;
}

// Block types that use a background image — never put a transition strip right after these.
const BG_IMAGE_BLOCK_TYPES = new Set(["hero"]);

// Returns the background tone of a block at a given index.
// "other" = accent/unknown color — skip transitions around it.
function getBlockBg(block: ContentBlock, index: number): "dark" | "light" | "other" {
  switch (block.type) {
    case "hero":
    case "team-members":
      return "dark";
    case "cta":
      return "other";
    case "content-section":
      // ContentSectionBlock alternates: even index = white, odd index = black
      return index % 2 === 0 ? "light" : "dark";
    default:
      return "light";
  }
}

export default function BlockRenderer({
  content,
  isPreview = false,
}: BlockRendererProps) {
  if (!content) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No content available</p>
      </div>
    );
  }

  // Structured page content (objects with hero, features, etc.) — not a block array
  if (!Array.isArray(content) && typeof content === "object") {
    return <StructuredPagePreview content={content} />;
  }

  if (!Array.isArray(content)) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No content available</p>
      </div>
    );
  }

  return (
    <div>
      {content.map((block, index) => {
        const currentBg = getBlockBg(block, index);
        const prevBg = index > 0 ? getBlockBg(content[index - 1], index - 1) : null;
        const prevBlock = index > 0 ? content[index - 1] : null;
        const needsTransition =
          prevBg !== null &&
          prevBg !== currentBg &&
          prevBg !== "other" &&
          currentBg !== "other" &&
          !(prevBlock && BG_IMAGE_BLOCK_TYPES.has(prevBlock.type));

        return (
          <div key={index}>
            {needsTransition && (
              <SectionTransition
                direction={prevBg === "dark" ? "dark-to-light" : "light-to-dark"}
              />
            )}
            <RenderBlock block={block} index={index} isPreview={isPreview} />
          </div>
        );
      })}
    </div>
  );
}

function RenderBlock({
  block,
  index,
  isPreview,
}: {
  block: ContentBlock;
  index: number;
  isPreview: boolean;
}) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "heading":
      return <HeadingBlock block={block} />;
    case "content-section":
      return <ContentSectionBlock block={block} index={index} />;
    case "cta":
      return <CTABlock block={block} />;
    case "team-members":
      return <TeamMembersBlock block={block} />;
    case "testimonials":
      return <TestimonialsBlock block={block} />;
    case "contact-section":
      return <ContactSectionBlock block={block} />;
    case "map":
      return <MapBlock block={block} />;
    case "practice-areas-grid":
      return <PracticeAreasGridBlock block={block} />;
    case "recent-posts":
      return <RecentPostsBlock block={block} />;
    default:
      return <LegacyBlock block={block} />;
  }
}
