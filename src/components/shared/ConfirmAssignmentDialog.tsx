import { ConfirmDialog } from '../overlays/Overlays';

export function ConfirmAssignmentDialog({ open, onCancel, onConfirm, participantName, hostName, dateLabel }: { open: boolean; onCancel: () => void; onConfirm: () => void; participantName: string; hostName: string; dateLabel: string; }) {
  const title = 'Confirm Assignment';
  const message = `Assign ${participantName} to ${hostName} for ${dateLabel}?`;
  return (
    <ConfirmDialog open={open} onCancel={onCancel} onConfirm={onConfirm} title={title} message={message} />
  );
}


