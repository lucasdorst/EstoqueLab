
import { useState } from "react";
import "./ListaLotes.css";

function ListaLotes({ lotes, produtos, fabricantes }) {
    const [buscaProduto, setBuscaProduto] = useState("");
    const [buscaLote, setBuscaLote] = useState("");
    const [buscaFabricante, setBuscaFabricante] = useState("");

    const lotesFiltrados = lotes.filter((lote) => {
        const produto = produtos.find(
            (item) => item.id === lote.produtoId
        );

        const fabricante = fabricantes.find(
            (item) => item.id === lote.fabricanteId
        );

        const nomeProduto = produto?.nome || "";
        const nomeFabricante = fabricante?.nome || "";

        return (
            nomeProduto.toLowerCase().includes(buscaProduto.toLowerCase().trim()) &&
            lote.numeroLote.toLowerCase().includes(buscaLote.toLowerCase().trim()) &&
            nomeFabricante.toLowerCase().includes(buscaFabricante.toLowerCase().trim())
        );
    });

    function limparFiltros() {
        setBuscaProduto("");
        setBuscaLote("");
        setBuscaFabricante("");
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

            {lotes.length === 0 ? (
                <p>Nenhum lote cadastrado.</p>
            ) : lotesFiltrados.length === 0 ? (
                <p>Nenhum lote encontrado.</p>
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
