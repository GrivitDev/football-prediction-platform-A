'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  VisuallyHidden,
} from '@radix-ui/react-visually-hidden';

import CommunityGuidelinesContent from './CommunityGuidelinesContent';


interface CommunityGuidelinesDialogProps {

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

}


export default function CommunityGuidelinesDialog({

  open,

  onOpenChange,

}: CommunityGuidelinesDialogProps) {


  return (

    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent
        className="
          max-h-[90dvh]
          w-[calc(100%-2rem)]
          max-w-3xl
          overflow-hidden
          rounded-2xl
          border-border
          bg-card
          p-0
          shadow-xl
          sm:rounded-3xl
        "
      >

        <VisuallyHidden>

          <DialogTitle>
            Community Guidelines
          </DialogTitle>

        </VisuallyHidden>


        <div
          className="
            max-h-[90dvh]
            overflow-y-auto
            overscroll-contain
          "
        >

          <CommunityGuidelinesContent />

        </div>

      </DialogContent>

    </Dialog>

  );

}