import { KanbanBoard } from '@/components/kanban/kanban-board';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b shadow-sm">
        <h1 className="text-2xl font-bold text-foreground font-headline">
          Pé na Areia Sales Flow
        </h1>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  );
}
