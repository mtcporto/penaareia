
'use client';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { AppShell } from '@/components/app-shell';

export default function Home() {
  return (
    <AppShell>
      <KanbanBoard />
    </AppShell>
  );
}
