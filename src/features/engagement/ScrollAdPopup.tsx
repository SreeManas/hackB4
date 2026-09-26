import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useScrollThreshold } from '@/hooks/useScrollThreshold';
import { useStorage } from '@/hooks/useStorage';
import { useAdCampaign } from '@/lib/api/queries';
import { imageUrl } from '@/lib/image';

/** Shows the page's active campaign once per session, after the visitor scrolls past its threshold. */
export function ScrollAdPopup({ page }: { page: string }) {
  const { data: campaign } = useAdCampaign(page);
  const [seen, setSeen] = useStorage(`ad_seen_${page}`, false, 'session');
  const [open, setOpen] = useState(false);
  const reached = useScrollThreshold(campaign?.scroll_threshold_percent ?? 50, !!campaign && !seen);

  useEffect(() => {
    if (reached && campaign && !seen) {
      setOpen(true);
      setSeen(true);
    }
  }, [reached, campaign, seen, setSeen]);

  if (!campaign) return null;
  const close = () => setOpen(false);

  return (
    <Modal open={open} onClose={close} title={campaign.title} className="rounded-2xl bg-[#111] shadow-2xl">
      <div className="relative h-[240px] sm:h-[300px]">
        <img src={imageUrl(campaign.image_url, 1200)} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
      </div>
      <div className="p-8 text-center">
        <p className="mb-6 text-2xl font-bold tracking-[0.05em] sm:text-3xl">{campaign.title}</p>
        <Button href={campaign.destination_url} onClick={close} variant="primary" arrow>
          DISCOVER MORE
        </Button>
      </div>
    </Modal>
  );
}
