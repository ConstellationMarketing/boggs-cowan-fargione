import RichText from "@site/components/shared/RichText";

interface TeamMemberCardProps {
  name: string;
  title: string;
  bio: string;
  image: string;
  imageAlt?: string;
  credentials?: string[];
  specialties?: string[];
}

export default function TeamMemberCard({
  name,
  title,
  bio,
  image,
  imageAlt,
  credentials,
  specialties,
}: TeamMemberCardProps) {
  const credentialItems = (credentials && credentials.length > 0 ? credentials : specialties || []).filter(Boolean);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-card transition-all duration-300 hover:border-brand-accent">
      <div className="relative overflow-hidden aspect-[4/5] min-h-[360px]">
        <img
          src={image}
          alt={imageAlt || name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          width={400}
          height={500}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="flex flex-1 flex-col p-[24px] text-center md:p-[32px] lg:text-left">
        <h3 className="font-playfair text-[26px] md:text-[30px] leading-tight text-white pb-[6px]">
          {name}
        </h3>
        <p className="font-inter text-[17px] md:text-[19px] text-brand-accent pb-[14px]">
          {title}
        </p>
        <RichText
          html={bio}
          className="font-inter text-[15px] md:text-[17px] leading-[24px] md:leading-[28px] text-white/80"
        />

        {credentialItems.length > 0 && (
          <div className="mt-[20px] pt-[18px] border-t border-brand-border/60">
            <h4 className="font-inter text-[15px] md:text-[16px] uppercase tracking-[0.08em] text-brand-accent mb-[10px]">
              Credentials
            </h4>
            <ul className="space-y-2.5">
              {credentialItems.map((credential, index) => (
                <li key={index} className="flex items-start justify-center gap-2.5 text-white/85 lg:justify-start">
                  <span className="mt-[8px] h-[6px] w-[6px] rounded-full bg-brand-accent shrink-0" />
                  <span className="font-inter text-[14px] md:text-[15px] leading-[22px] md:leading-[24px]">
                    {credential}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
