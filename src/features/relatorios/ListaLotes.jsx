
import { useState } from "react";
import "./ListaLotes.css";

function ListaLotes({ lotes, produtos, fabricantes }) {
    const [buscaProduto, setBuscaProduto] = useState("");
    const [buscaLote, setBuscaLote] = useState("");
    const [buscaFabricante, setBuscaFabricante] = useState("");

    const [alertasSelecionados, setAlertasSelecionados] = useState([]);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Calcula o estoque total de cada produto
    function obterSaldoTotal(produtoId) {
        return lotes
            .filter((lote) => lote.produtoId === produtoId)
            .reduce(
                (total, lote) => total + Number(lote.quantidadeAtual || 0),
                0
            );
    }

    // Identifica os alertas de cada linha da tabela
    function obterAlertas(lote) {
        const alertas = [];

        const produto = produtos.find(
            (item) => item.id === lote.produtoId
        );

        if (!produto) return alertas;

        // Estoque baixo: alerta vinculado ao produto
        const saldoTotal = obterSaldoTotal(produto.id);

        if (saldoTotal <= Number(produto.estoqueMinimo)) {
            alertas.push("Estoque baixo");
        }

        // Validade: alerta vinculado ao lote
        if (lote.quantidadeAtual > 0 && lote.validade) {
            const validade = new Date(`${lote.validade}T00:00:00`);

            const diasRestantes = Math.ceil(
                (validade - hoje) / (1000 * 60 * 60 * 24)
            );

            if (diasRestantes < 0) {
                alertas.push("Lote vencido");
            } else if (diasRestantes <= 60) {
                alertas.push("Próximo do vencimento");
            }
        }

        return alertas;
    }

    function alternarAlerta(alerta) {
        setAlertasSelecionados((atuais) =>
            atuais.includes(alerta)
                ? atuais.filter((item) => item !== alerta)
                : [...atuais, alerta]
        );
    }

    const lotesFiltrados = lotes.filter((lote) => {
        const produto = produtos.find(
            (item) => item.id === lote.produtoId
        );

        const fabricante = fabricantes.find(
            (item) => item.id === lote.fabricanteId
        );

        const nomeProduto = produto?.nome || "";
        const nomeFabricante = fabricante?.nome || "";

        const correspondeTexto =
            nomeProduto.toLowerCase().includes(buscaProduto.toLowerCase().trim()) &&
            lote.numeroLote.toLowerCase().includes(buscaLote.toLowerCase().trim()) &&
            nomeFabricante.toLowerCase().includes(buscaFabricante.toLowerCase().trim());

        const alertas = obterAlertas(lote);

        const correspondeAlerta =
            alertasSelecionados.length === 0 ||
            alertasSelecionados.some((alerta) =>
                alertas.includes(alerta)
            );

        return correspondeTexto && correspondeAlerta;
    });

    function limparFiltros() {
        setBuscaProduto("");
        setBuscaLote("");
        setBuscaFabricante("");
        setAlertasSelecionados([]);
    }

    return (
        <section className="lista-lotes">
            <h2>Produtos em estoque</h2>

            <div className="filtros-lotes">
                <input
                    type="text"
                    placeholder="Pesquisar produto..."
                    value={buscaProduto}
                    onChange={(evento) => setBuscaProduto(evento.target.value)}
                />

                <input
                    type="text"
                    placeholder="Pesquisar número do lote..."
                    value={buscaLote}
                    onChange={(evento) => setBuscaLote(evento.target.value)}
                />

                <input
                    type="text"
                    placeholder="Pesquisar fabricante..."
                    value={buscaFabricante}
                    onChange={(evento) => setBuscaFabricante(evento.target.value)}
                />

                <button type="button" onClick={limparFiltros}>
                    Limpar filtros
                </button>
            </div>

            <div className="filtros-alertas-lotes">
                <strong>Filtrar por alerta:</strong>

                {["Estoque baixo", "Próximo do vencimento", "Lote vencido"].map(
                    (alerta) => (
                        <label key={alerta}>
                            <input
                                type="checkbox"
                                checked={alertasSelecionados.includes(alerta)}
                                onChange={() => alternarAlerta(alerta)}
                            />
                            {alerta}
                        </label>
                    )
                )}
            </div>

            {lotes.length === 0 ? (
                <p>Nenhum lote cadastrado.</p>
            ) : lotesFiltrados.length === 0 ? (
                <p>Nenhum lote encontrado com os filtros selecionados.</p>
            ) : (
                <div className="tabela-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Número do lote</th>
                                <th>Fabricante</th>
                                <th>Validade</th>
                                <th>Quantidade atual</th>
                                <th>Alerta</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lotesFiltrados.map((lote) => {
                                const produto = produtos.find(
                                    (item) => item.id === lote.produtoId
                                );

                                const fabricante = fabricantes.find(
                                    (item) => item.id === lote.fabricanteId
                                );

                                const alertas = obterAlertas(lote);

                                return (
                                    <tr key={lote.id}>
                                        <td>{produto ? produto.nome : "—"}</td>
                                        <td>{lote.numeroLote}</td>
                                        <td>{fabricante ? fabricante.nome : "—"}</td>
                                        <td>
                                            {lote.validade
                                                ? lote.validade.split("-").reverse().join("/")
                                                : "—"}
                                        </td>
                                        <td>{lote.quantidadeAtual}</td>
                                        <td>
                                            {alertas.length > 0
                                                ? alertas.join(", ")
                                                : "Sem alerta"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default ListaLotes;
