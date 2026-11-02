import { useState } from "react";
import "./ListaProdutos.css";

function ListaProdutos({ produtos, unidades, lotes, movimentacoes }) {
    const [busca, setBusca] = useState("");

    const produtosFiltrados = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(busca.toLowerCase().trim())
    );

    function limparFiltro() {
        setBusca("");
    }

    function calcularTempoMedio(produtoId) {
        const consumosProduto = movimentacoes.filter(
            (movimentacao) =>
                movimentacao.tipo === "Consumo" &&
                movimentacao.produtoId === produtoId &&
                movimentacao.loteId != null
        );

        let quantidadeTotalConsumida = 0;
        let tempoTotalPonderado = 0;

        consumosProduto.forEach((consumo) => {
            const lote = lotes.find(
                (lote) => lote.id === consumo.loteId
            );

            if (!lote || !lote.dataEntrada) {
                return;
            }

            const dataEntrada = new Date(lote.dataEntrada);
            const dataConsumo = new Date(consumo.data);

            if (
                Number.isNaN(dataEntrada.getTime()) ||
                Number.isNaN(dataConsumo.getTime()) ||
                dataConsumo < dataEntrada ||
                !Number.isFinite(consumo.quantidade) ||
                consumo.quantidade <= 0
            ) {
                return;
            }

            const tempoEmDias =
                (dataConsumo - dataEntrada) / (1000 * 60 * 60 * 24);

            tempoTotalPonderado += tempoEmDias * consumo.quantidade;
            quantidadeTotalConsumida += consumo.quantidade;
        });

        if (quantidadeTotalConsumida === 0) {
            return "—";
        }

        const mediaEmDias =
            tempoTotalPonderado / quantidadeTotalConsumida;

        return `${mediaEmDias.toFixed(1).replace(".", ",")} dias`;
    }

    return (
        <section className="lista-produtos">
            <h2>Produtos cadastrados</h2>

            <div className="filtro-produtos">
                <input
                    type="text"
                    placeholder="Pesquisar produto pelo nome..."
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                />

                <button type="button" onClick={limparFiltro}>
                    Limpar filtros
                </button>
            </div>

            {produtos.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
            ) : produtosFiltrados.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
            ) : (
                <div className="tabela-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Unidade</th>
                                <th>Estoque mínimo</th>
                                <th>Estoque máximo</th>
                                <th>Tempo médio de permanência</th>
                            </tr>
                        </thead>

                        <tbody>
                            {produtosFiltrados.map((produto) => {
                                const unidade = unidades.find(
                                    (unidade) => unidade.id === produto.unidadeId
                                );

                                return (
                                    <tr key={produto.id}>
                                        <td>{produto.nome}</td>
                                        <td>{unidade ? unidade.nome : "—"}</td>
                                        <td>{produto.estoqueMinimo}</td>
                                        <td>{produto.estoqueMaximo}</td>
                                        <td>{calcularTempoMedio(produto.id)}</td>
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

export default ListaProdutos;