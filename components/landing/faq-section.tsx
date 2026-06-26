import { faqs } from "@/content/boreas-home";
import { SectionFrame } from "./boreas-landing-sections";

export function FaqSection() {
  return (
    <SectionFrame id="faq">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="mb-14 lg:max-w-[48rem]">
          <h2 className="text-balance text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground">
            Lo importante está claro desde el inicio.
          </h2>
        </div>

        <div className="grid gap-x-12 gap-y-8 border-t border-line pt-8 md:grid-cols-2">
          {faqs.map((faq) => (
            <article key={faq.question} className="border-b border-line pb-8">
              <h3 className="text-lg font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
