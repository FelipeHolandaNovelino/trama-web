import { useState } from "react"

import {
  getBlocksById,
  getConnectionsCount,
  getDayFromDate,
  getMirrorConnectedBlocks,
  getMirrorMainBlocks,
  getMonthFromEventDate,
  getUniquePeopleCount,
  getYearFromEventDate,
  sortBlocksByEventDate,
} from "../utils/timelineUtils"

const mirrorColorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50",
  "Evento traumático": "border-rose-200 bg-rose-50",
  Insight: "border-amber-200 bg-amber-50",
  Evento: "border-violet-200 bg-violet-50",
  "Observação clínica": "border-blue-200 bg-blue-50",
}

const mirrorConnectionColorByStrength = {
  leve: "border-slate-200 bg-slate-50 text-slate-700",
  moderada: "border-amber-200 bg-amber-50 text-amber-800",
  forte: "border-emerald-200 bg-emerald-50 text-emerald-800",
}

function MirrorConnectedCard({ block, onOpenBlock }) {
  return (
    <button
      type="button"
      onClick={() => onOpenBlock(block)}
      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
        mirrorConnectionColorByStrength[block.connectionStrength] ||
        "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      <p className="text-xs font-semibold text-slate-500">
        {block.eventDate || block.date}
      </p>

      <h5 className="mt-1 text-sm font-bold text-slate-900">{block.title}</h5>

      {block.connectionReason && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {block.connectionReason}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(block.emotions || []).slice(0, 2).map((emotion) => (
          <span
            key={emotion}
            className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] text-slate-700"
          >
            {emotion}
          </span>
        ))}
      </div>
    </button>
  )
}

function MirrorMainCard({ block, connectedBlocks, onOpenBlock }) {
  const year = getYearFromEventDate(block.eventDate)
  const month = getMonthFromEventDate(block.eventDate)

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_420px]">
      <button
        type="button"
        onClick={() => onOpenBlock(block)}
        className={`relative rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
          mirrorColorByType[block.type] || "border-slate-200 bg-white"
        }`}
      >
        <div className="absolute -left-[25px] top-7 h-4 w-4 rounded-full border-4 border-white bg-violet-700 shadow sm:-left-[29px]" />

        <div className="grid gap-4 md:grid-cols-[88px_1fr] xl:grid-cols-[90px_1fr_180px]">
          <div className="border-b border-slate-200 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <p className="text-2xl font-bold text-slate-900">
              {getDayFromDate(block.eventDate)}
            </p>

            <p className="text-xs font-semibold text-violet-700">{month}</p>

            <p className="mt-1 text-xs text-slate-400">{year}</p>
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">{block.type}</p>

            <h4 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
              {block.title}
            </h4>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:line-clamp-2">
              {block.text}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(block.emotions || []).slice(0, 4).map((emotion) => (
                <span
                  key={emotion}
                  className="rounded-full bg-white/80 px-2 py-1 text-xs text-slate-700"
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 md:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
            <p className="text-xs font-semibold text-slate-500">
              Pessoas envolvidas
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {(block.people || []).slice(0, 3).map((person) => (
                <span
                  key={person}
                  className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-slate-700"
                >
                  {person}
                </span>
              ))}

              {(block.people || []).length > 3 && (
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-slate-700">
                  +{block.people.length - 3}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Intensidade
            </p>

            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index < Math.ceil((block.intensity || 0) / 2)
                      ? "bg-violet-700"
                      : "bg-slate-200"
                  }`}
                />
              ))}

              <span className="ml-2 text-xs text-slate-500">
                {block.intensity}/10
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-violet-700">
              Abrir acontecimento
            </p>
          </div>
        </div>
      </button>

      <div className="relative">
        {connectedBlocks.length > 0 ? (
          <>
            <div className="absolute -left-4 top-1/2 hidden h-px w-4 border-t border-dashed border-violet-300 xl:block" />

            <div className="rounded-3xl border border-dashed border-violet-100 bg-white/60 p-3 xl:border-none xl:bg-transparent xl:p-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-700 xl:hidden">
                Blocos conectados
              </p>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {connectedBlocks.map((connectedBlock) => (
                  <MirrorConnectedCard
                    key={connectedBlock.id}
                    block={connectedBlock}
                    onOpenBlock={onOpenBlock}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="hidden h-full items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-xs text-slate-400 xl:flex">
            Sem desdobramentos conectados.
          </div>
        )}
      </div>
    </div>
  )
}

export function MirrorTimeline({ blocks, onOpenBlock }) {
  const [showOnlyConnected, setShowOnlyConnected] = useState(false)

  const blocksById = getBlocksById(blocks)
  const sortedBlocks = sortBlocksByEventDate(blocks)
  const mainBlocks = getMirrorMainBlocks(sortedBlocks)

  const visibleBlocks = showOnlyConnected
    ? mainBlocks.filter((block) => (block.connections || []).length > 0)
    : mainBlocks

  const totalPeople = getUniquePeopleCount(blocks)
  const totalConnections = getConnectionsCount(blocks)

  const firstYear = sortedBlocks[0]
    ? getYearFromEventDate(sortedBlocks[0].eventDate)
    : "-"

  const lastYear = sortedBlocks[sortedBlocks.length - 1]
    ? getYearFromEventDate(sortedBlocks[sortedBlocks.length - 1].eventDate)
    : "-"

  return (
    <div className="mt-6 sm:mt-8">
      <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-4 sm:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-700">
              Espelho longitudinal
            </p>

            <h3 className="mt-1 text-xl font-bold text-violet-950 sm:text-2xl">
              Linha da vida emocional
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-violet-700">
              Visualize os acontecimentos principais em todos os anos, com seus
              desdobramentos e conexões emocionais ao lado.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowOnlyConnected(!showOnlyConnected)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
              showOnlyConnected
                ? "bg-violet-800 text-white"
                : "bg-white text-violet-800 hover:bg-violet-100"
            }`}
          >
            {showOnlyConnected
              ? "Mostrar todos"
              : "Mostrar apenas conectados"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Eventos principais
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {mainBlocks.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Pessoas envolvidas
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalPeople}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Conexões identificadas
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {totalConnections}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold text-slate-500">
              Período coberto
            </p>

            <p className="mt-1 text-lg font-bold text-violet-800">
              {firstYear} — {lastYear}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="relative border-l-2 border-violet-100 pl-6 sm:pl-8">
          <div className="space-y-5">
            {visibleBlocks.map((block) => {
              const connectedBlocks = getMirrorConnectedBlocks(block, blocksById)

              return (
                <MirrorMainCard
                  key={block.id}
                  block={block}
                  connectedBlocks={connectedBlocks}
                  onOpenBlock={onOpenBlock}
                />
              )
            })}
          </div>
        </div>

        {visibleBlocks.length === 0 && (
          <div className="flex min-h-[220px] items-center justify-center text-center">
            <div>
              <p className="text-lg font-semibold text-slate-800">
                Nenhum acontecimento encontrado
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Os acontecimentos aparecerão aqui quando houver blocos
                registrados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}