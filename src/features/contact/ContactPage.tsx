import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';
import { Container } from '@/components/ui/Container';
import { InfoRow } from '@/components/ui/InfoRow';
import { FadeIn, RevealText } from '@/components/motion/Reveal';
import { contact } from '@/content/site';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { ContactForm } from './components/ContactForm';

export default function ContactPage() {
  useDocumentMeta({
    title: 'Contact',
    description: 'Partner with HACKB4 on a hackathon, sponsor an upcoming cohort, or ask us anything.',
  });

  return (
    <PageTransition>
      <div className="relative overflow-hidden pb-24">
        {/* Slow ambient glow */}
        <motion.div
          aria-hidden="true"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="pointer-events-none absolute top-[10%] -right-[10%] -z-[1] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50"
        />

        <Container className="grid gap-16 py-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col">
            <RevealText>
              <h1 className="mb-6 text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[1.1] font-light tracking-[0.05em]">
                LET'S BUILD
                <br />
                SOMETHING
                <br />
                <span className="font-medium">EXTRAORDINARY.</span>
              </h1>
            </RevealText>
            <FadeIn delay={0.2}>
              <p className="mb-16 max-w-[400px] text-lg leading-relaxed text-muted">
                Whether you're looking to partner on a hackathon or sponsor an upcoming cohort, we'd love to hear from
                you.
              </p>
            </FadeIn>
            <FadeIn delay={0.4} className="flex flex-col gap-8">
              <InfoRow variant="badge" icon={Mail} label="Email">
                <a href={`mailto:${contact.email}`} className="text-lg hover:underline">
                  {contact.email}
                </a>
              </InfoRow>
              <InfoRow variant="badge" icon={Phone} label="Phone">
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-lg hover:underline">
                  {contact.phone}
                </a>
              </InfoRow>
              <InfoRow variant="badge" icon={MapPin} label="Headquarters">
                <address className="text-lg not-italic">
                  {contact.headquarters.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </InfoRow>
            </FadeIn>
          </div>

          <FadeIn delay={0.6} className="border border-line bg-[rgba(5,5,5,0.8)] px-6 py-12 sm:px-12 sm:py-16">
            <ContactForm />
          </FadeIn>
        </Container>
      </div>
    </PageTransition>
  );
}
