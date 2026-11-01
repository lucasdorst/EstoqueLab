
import "./AlertasEstoque.css";

function AlertasEstoque({ produtos, lotes }) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const alertas = [];

    // ALERTAS DE VALIDADE

    lotes.forEach((lote) => {
        if (lote.quantidadeAtual <= 0) return;

        const validade = new Date(`${lote.validade}T00:00:00`);

        const diasRestantes = Math.ceil(
            (validade - hoje) / (1000 * 60 * 60 * 24)
        );

        const produto = produtos.find(
            (item) => item.id === lote.produtoId
        );

        if (diasRestantes < 0) {
            alertas.push({
                id: `vencido-${lote.id}`,
                tipo: "Lote vencido",
                produto: produto?.nome || "Produto não encontrado",
                lote: lote.numeroLote,
                detalhe: "Lote vencido com saldo disponível",
                categoria: "vencido"
            });
        } else if (diasRestantes <= 60) {
            alertas.push({
                id: `validade-${lote.id}`,
                tipo: "Próximo do vencimento",
                produto: produto?.nome || "Produto não encontrado",
                lote: lote.numeroLote,
                detalhe: `Vence em ${diasRestantes} dias`,
                categoria: "validade"
            });
        }
    });

    // ALERTAS DE ESTOQUE MÍNIMO

    produtos.forEach((produto) => {
        const saldoTotal = lotes
            .filter((lote) => lote.produtoId === produto.id)
            .reduce(
                (total, lote) => total + lote.quantidadeAtual,
                0
            );

        if (saldoTotal <= produto.estoqueMinimo) {
            alertas.push({
                id: `estoque-${produto.id}`,
                tipo: "Estoque baixo",
                produto: produto.nome,
                lote: "Todos os lotes",
                detalhe: `Saldo: ${saldoTotal} | Mínimo: ${produto.estoqueMinimo}`,
                categoria: "estoque"
            });
        }
    });

    const quantidadeAlertas = alertas.length;

    return (
        <section className="alertas-estoque">
            <div className="cabecalho-alertas">
                <h2>Alertas de estoque</h2>

                <span className="contador-alertas">
                    {quantidadeAlertas}
                </span>
            </div>

            {quantidadeAlertas === 0 ? (
                <p className="sem-alertas">
                    Nenhum alerta no momento.
                </p>
            ) : (
                <div className="lista-alertas">
                    {alertas.map((alerta) => (
                        <div
                            className={`item-alerta ${alerta.categoria}`}
                            key={alerta.id}
                        >
                            <div className="alerta-informacoes">
                                <strong>{alerta.tipo}</strong>

                                <p>{alerta.produto}</p>

                                <span>
                                    {alerta.lote} — {alerta.detalhe}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default AlertasEstoque;
