const colorByType = {
  "Marco positivo": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Evento traumático": "border-rose-200 bg-rose-50 text-rose-800",
  Insight: "border-amber-200 bg-amber-50 text-amber-800",
  Evento: "border-violet-200 bg-violet-50 text-violet-800",
  "Observação clínica": "border-blue-200 bg-blue-50 text-blue-800",
}

const connectionColorByStrength = {
  leve: "bg-slate-100 text-slate-700",
  moderada: "bg-violet-100 text-violet-800",
  forte: "bg-rose-100 text-rose-800",
}

export function TimelineBlockModal({
  block,
  onClose,
  onOpenConnectedBlock,
}) {
  if (!block) return null

  function handleOpenConnection(connection) {
    if (!onOpenConnectedBlock) return

    onOpenConnectedBlock(connection.targetBlockId)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-6 py-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    colorByType[block.type] ||
                    "border-slate-200 bg-slate-100 text-slate-700"
                  }`}
                >
                  {block.type}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  Intensidade {block.intensity}/10
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900">
                {block.title}
              </h2>

              <div className="mt-3 grid gap-2 text-sm text-slate-500 md:grid-cols-2">
                <p>
                  Acontecimento:{" "}
                  <span className="font-medium text-slate-700">
                    {block.eventDate || block.date}
                  </span>
                </p>

                <p>
                  Relatado na sessão:{" "}
                  <span className="font-medium text-slate-700">
                    {block.sessionDate || "não informado"}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="p-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Bloco narrativo
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              {block.text}
            </p>
          </section>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <section className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-bold text-slate-900">Emoções</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {(block.emotions || []).length > 0 ? (
                  block.emotions.map((emotion) => (
                    <span
                      key={emotion}
                      className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
                    >
                      {emotion}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Nenhuma emoção registrada.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-bold text-slate-900">Pessoas</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {(block.people || []).length > 0 ? (
                  block.people.map((person) => (
                    <span
                      key={person}
                      className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
                    >
                      {person}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Nenhuma pessoa registrada.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-bold text-slate-900">Tags</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {(block.tags || []).length > 0 ? (
                  block.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs text-slate-700"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Nenhuma tag registrada.
                  </p>
                )}
              </div>
            </section>
          </div>

          <section className="mt-5 rounded-3xl border border-violet-100 bg-violet-50/60 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-violet-950">
                  Conexões emocionais
                </h3>

                <p className="mt-1 text-sm text-violet-700">
                  Eventos relacionados a este bloco.
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700">
                {(block.connections || []).length} conexão
                {(block.connections || []).length !== 1 ? "ões" : ""}
              </span>
            </div>

            {(block.connections || []).length > 0 ? (
              <div className="mt-4 space-y-3">
                {block.connections.map((connection) => (
                  <button
                    key={connection.targetBlockId}
                    onClick={() => handleOpenConnection(connection)}
                    className="w-full rounded-2xl bg-white p-4 text-left text-sm text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {connection.targetTitle}
                        </p>

                        <p className="mt-2 text-slate-600">
                          {connection.reason}
                        </p>

                        <p className="mt-3 text-xs font-medium text-violet-700">
                          Clique para abrir o bloco conectado
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          connectionColorByStrength[connection.strength] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {connection.strength}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-violet-700">
                Este bloco ainda não possui conexões emocionais registradas.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}