import { ClinicalBlockCard } from "./ClinicalBlockCard"

/**
 * Extrai o nome do grupo de forma segura.
 *
 * Mantém compatibilidade caso o agrupamento venha como objeto ou array.
 */
function getGroupLabel(group) {
  if (!group) return ""

  if (typeof group === "string") return group

  return group.label || group.name || group.title || group.key || group.group || ""
}

/**
 * Extrai os blocos do grupo de forma segura.
 */
function getGroupBlocks(group) {
  if (!group) return []

  if (Array.isArray(group)) return group

  return group.blocks || group.items || group.values || []
}

/**
 * Normaliza agrupamentos em uma lista única.
 *
 * Aceita:
 * - objeto: { Ansiedade: [blocks], Culpa: [blocks] }
 * - array: [{ label: "Ansiedade", blocks: [...] }]
 */
function normalizeGroupedBlocks(groupedBlocks) {
  if (!groupedBlocks) return []

  if (Array.isArray(groupedBlocks)) {
    return groupedBlocks
      .map((group) => ({
        label: getGroupLabel(group),
        blocks: getGroupBlocks(group),
      }))
      .filter((group) => group.label && group.blocks.length > 0)
  }

  return Object.entries(groupedBlocks)
    .map(([label, blocks]) => ({
      label,
      blocks: Array.isArray(blocks) ? blocks : [],
    }))
    .filter((group) => group.label && group.blocks.length > 0)
}

/**
 * Visualização agrupada de blocos clínicos.
 *
 * Usada nos modos Emoções e Relações da timeline. O card do bloco foi
 * padronizado em ClinicalBlockCard para manter consistência visual com
 * o Espelho e com os demais pontos de leitura da timeline.
 */
export function GroupedBlocksView({
  groupedBlocks,
  emptyTitle,
  emptyDescription,
  onOpenConnectedBlock,
  onDeleteBlock,
  onEditBlock,
}) {
  const groups = normalizeGroupedBlocks(groupedBlocks)

  function handleOpenBlock(block) {
    onOpenConnectedBlock?.(block.id)
  }

  if (groups.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
        <h3 className="text-base font-black text-slate-950">{emptyTitle}</h3>

        <p className="mx-auto mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          {emptyDescription}
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-5">
      {groups.map((group) => (
        <article
          key={group.label}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <header className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">
                Grupo clínico
              </p>

              <h3 className="mt-1 text-lg font-black text-slate-950">
                {group.label}
              </h3>
            </div>

            <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {group.blocks.length} bloco{group.blocks.length !== 1 ? "s" : ""}
            </span>
          </header>

          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            {group.blocks.map((block) => (
              <ClinicalBlockCard
                key={block.id}
                block={block}
                onOpenBlock={handleOpenBlock}
                onEditBlock={onEditBlock}
                onDeleteBlock={onDeleteBlock}
                showActions
              />
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}