
import { useState } from "react";
import "./ListaProdutos.css";

function ListaProdutos({ produtos, unidades }) {
    const [busca, setBusca] = useState("");

    const produtosFiltrados = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(busca.toLowerCase().trim())
    );

    function limparFiltro() {
        setBusca("");
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
