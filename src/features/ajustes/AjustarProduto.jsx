
import { useState } from "react";
import "./AjustarProduto.css";

function AjustarProduto({ produtos, unidades, onAjustarProduto }) {
    const [produtoEditarSelecionado, setProdutoEditarSelecionado] = useState("");
    const [nomeProduto, setNomeProduto] = useState("");
    const [unidadeProduto, setUnidadeProduto] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");
    const [estoqueMaximo, setEstoqueMaximo] = useState("");

    // SELECIONAR PRODUTO PARA EDIÇÃO

    function selecionarProdutoParaEditar(id) {
        setProdutoEditarSelecionado(id);

        const produto = produtos.find(
            (item) => String(item.id) === id
        );

        if (!produto) {
            setNomeProduto("");
            setUnidadeProduto("");
            setEstoqueMinimo("");
            setEstoqueMaximo("");
            return;
        }

        setNomeProduto(produto.nome);
        setUnidadeProduto(String(produto.unidadeId));
        setEstoqueMinimo(String(produto.estoqueMinimo));
        setEstoqueMaximo(String(produto.estoqueMaximo));
    }

    // CONFIRMAR AJUSTE DO PRODUTO

    function confirmarAjusteProduto() {
        if (
            !produtoEditarSelecionado ||
            !nomeProduto.trim() ||
            !unidadeProduto ||
            estoqueMinimo === "" ||
            estoqueMaximo === ""
        ) {
            alert("Preencha todos os campos do produto.");
            return;
        }

        const minimo = Number(estoqueMinimo);
        const maximo = Number(estoqueMaximo);

        if (
            !Number.isFinite(minimo) ||
            !Number.isFinite(maximo) ||
            minimo < 0 ||
            maximo < 0
        ) {
            alert("Informe valores válidos para os estoques.");
            return;
        }

        if (maximo < minimo) {
            alert("O estoque máximo não pode ser menor que o mínimo.");
            return;
        }

        const sucesso = onAjustarProduto({
            id: Number(produtoEditarSelecionado),
            nome: nomeProduto.trim(),
            unidadeId: Number(unidadeProduto),
            estoqueMinimo: minimo,
            estoqueMaximo: maximo
        });

        if (!sucesso) return;

        setProdutoEditarSelecionado("");
        setNomeProduto("");
        setUnidadeProduto("");
        setEstoqueMinimo("");
        setEstoqueMaximo("");
    }

    return (
        <section className="ajuste-card">
            <div className="ajuste-card-titulo">
                <h2>Ajustar produto</h2>
                <p>
                    Selecione um produto para atualizar suas informações.
                </p>
            </div>

            <div className="ajuste-formulario">
                <div className="campo-ajuste">
                    <label>Produto</label>

                    <select
                        value={produtoEditarSelecionado}
                        onChange={(e) =>
                            selecionarProdutoParaEditar(e.target.value)
                        }
                    >
                        <option value="">Selecione um produto</option>

                        {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                                {produto.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-ajuste">
                    <label>Nome do produto</label>

                    <input
                        type="text"
                        value={nomeProduto}
                        onChange={(e) => setNomeProduto(e.target.value)}
                        placeholder="Nome do produto"
                        disabled={!produtoEditarSelecionado}
                    />
                </div>

                <div className="campo-ajuste">
                    <label>Unidade de medida</label>

                    <select
                        value={unidadeProduto}
                        onChange={(e) => setUnidadeProduto(e.target.value)}
                        disabled={!produtoEditarSelecionado}
                    >
                        <option value="">Selecione a unidade</option>

                        {unidades.map((unidade) => (
                            <option key={unidade.id} value={unidade.id}>
                                {unidade.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-ajuste">
                    <label>Estoque mínimo</label>

                    <input
                        type="number"
                        min="0"
                        value={estoqueMinimo}
                        onChange={(e) => setEstoqueMinimo(e.target.value)}
                        placeholder="Estoque mínimo"
                        disabled={!produtoEditarSelecionado}
                    />
                </div>

                <div className="campo-ajuste">
                    <label>Estoque máximo</label>

                    <input
                        type="number"
                        min="0"
                        value={estoqueMaximo}
                        onChange={(e) => setEstoqueMaximo(e.target.value)}
                        placeholder="Estoque máximo"
                        disabled={!produtoEditarSelecionado}
                    />
                </div>

                <button
                    type="button"
                    className="botao-ajuste"
                    onClick={confirmarAjusteProduto}
                    disabled={!produtoEditarSelecionado}
                >
                    Salvar alterações
                </button>
            </div>
        </section>
    );
}

export default AjustarProduto;
