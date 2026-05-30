import { TimelineBlock } from "./TimelineBlock"

/**
 * Exibe blocos agrupados por uma chave clínica.
 * Pode ser usado para visões por emoção, pessoa, tag ou outros agrupamentos futuros.
 */
export function GroupedBlocksView({
  groupedBlocks,
  emptyTitle = "Nenhum bloco encontrado",
  emptyDescription = "Os blocos aparecerão aqui quando houver registros disponíveis.",
  onOpenConnectedBlock,
  onDeleteBlock,
  onEditBlock,
}) {
  const groups = Object.entries(groupedBlocks).sort(([firstName], [secondName]) =>
    firstName.localeCompare(secondName)
  )

  if (groups.length === 0) {
    return (
      <div className="mt-6 flex min-h-[260px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-slate-800">{emptyTitle}</p>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            {emptyDescription}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
      {groups.map(([groupName, blocks]) => (
        <section
          key={groupName}
          className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-violet-800 sm:text-xl">
              {groupName}
            </h3>

            <p className="text-sm text-slate-500">
              {blocks.length} bloco{blocks.length > 1 ? "s" : ""} conectado
              {blocks.length > 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {blocks.map((block) => (
              <TimelineBlock
                key={`${groupName}-${block.id}`}
                block={block}
                onOpenConnectedBlock={onOpenConnectedBlock}
                onDeleteBlock={onDeleteBlock}
                onEditBlock={onEditBlock}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}