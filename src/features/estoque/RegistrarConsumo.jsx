
import { useState } from "react";
import "./RegistrarConsumo.css";

function RegistrarConsumo({
    produtos,
    lotes,
    unidades,
    onRegistrarConsumo,
    onAguardarConsumo
}) {
    const [produtoBusca, setProdutoBusca] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [produtoFocado, setProdutoFocado] = useState(false);

    const [loteSelecionado, setLoteSelecionado] = useState("");
    const [quantidade, setQuantidade] = useState("");

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const produtosFiltrados = produtos.filter((item) =>
        item.nome.toLowerCase().includes(produtoBusca.toLowerCase())
    );

    const lotesDoProduto = lotes
        .filter((lote) => lote.produtoId === produtoSelecionado?.id)
        .sort((a, b) => a.validade.localeCompare(b.validade));

    const lotesComStatus = lotesDoProduto.map((lote) => {
        const dataValidade = new Date(`${lote.validade}T00:00:00`);

        return {
            ...lote,
            vencido: dataValidade < hoje
        };
    });

    const loteEscolhido = lotes.find(
        (item) => item.id === Number(loteSelecionado)
    );

    const unidade = unidades.find(
        (item) => item.id === produtoSelecionado?.unidadeId
    );

    const quantidadeValida =
        loteEscolhido &&
        new Date(`${loteEscolhido.validade}T00:00:00`) >= hoje &&
        loteEscolhido.quantidadeAtual > 0 &&
        quantidade !== "" &&
        Number(quantidade) > 0 &&
        Number(quantidade) <= loteEscolhido.quantidadeAtual;

    function selecionarProduto(item) {
        setProdutoBusca(item.nome);
        setProdutoSelecionado(item);
        setProdutoFocado(false);
        setLoteSelecionado("");
        setQuantidade("");
    }

    function limparFormulario() {
        setProdutoBusca("");
        setProdutoSelecionado(null);
        setProdutoFocado(false);
        setLoteSelecionado("");
        setQuantidade("");
    }

    function registrarConsumo() {
        if (!quantidadeValida) {
            return;
        }

        onRegistrarConsumo({
            loteId: loteEscolhido.id,
            produtoId: produtoSelecionado.id,
            quantidade: Number(quantidade)
        });

        limparFormulario();

        alert("Consumo registrado com sucesso!");
    }

    function aguardarConsumo() {
        if (!quantidadeValida) {
            return;
        }

        onAguardarConsumo({
            loteId: loteEscolhido.id,
            produtoId: produtoSelecionado.id,
            quantidade: Number(quantidade)
        });

        limparFormulario();

        alert("Consumo salvo na lista de aguardando!");
    }

    return (
        <section className="registrar-consumo">
            <h2>Registrar consumo</h2>

            <div className="campo-consumo campo-produto">
                <label htmlFor="produtoConsumo">Produto</label>

                <input
                    type="text"
                    id="produtoConsumo"
                    placeholder="Digite o nome do produto"
                    value={produtoBusca}
                    onFocus={() => setProdutoFocado(true)}
                    onChange={(evento) => {
                        setProdutoBusca(evento.target.value);
                        setProdutoSelecionado(null);
                        setLoteSelecionado("");
                        setQuantidade("");
                        setProdutoFocado(true);
                    }}
                />

                {produtoFocado && produtoBusca.trim() !== "" && (
                    <div className="sugestoes-consumo">
                        {produtosFiltrados.length > 0 ? (
                            produtosFiltrados.map((item) => (
                                <div
                                    key={item.id}
                                    onMouseDown={() => selecionarProduto(item)}
                                >
                                    {item.nome}
                                </div>
                            ))
                        ) : (
                            <div className="sem-sugestoes">
                                Nenhum produto encontrado.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="campo-consumo">
                <label htmlFor="loteConsumo">Lote</label>

                <select
                    id="loteConsumo"
                    value={loteSelecionado}
                    disabled={!produtoSelecionado}
                    onChange={(evento) => {
                        setLoteSelecionado(evento.target.value);
                        setQuantidade("");
                    }}
                >
                    <option value="">
                        {produtoSelecionado
                            ? "Selecione um lote"
                            : "Selecione primeiro um produto"}
                    </option>

                    {lotesComStatus.map((lote) => (
                        <option
                            key={lote.id}
                            value={lote.id}
                            disabled={lote.vencido || lote.quantidadeAtual <= 0}
                        >
                            {lote.numeroLote} — Validade: {lote.validade.split("-").reverse().join("/")}
                            {lote.vencido
                                ? " — Vencido"
                                : lote.quantidadeAtual <= 0
                                ? " — Sem saldo"
                                : ""}
                        </option>
                    ))}
                </select>
            </div>

            <p className="saldo-produto">
                Unidade: {unidade?.nome || "—"}
            </p>

            <div className="campo-consumo">
                <label htmlFor="quantidadeConsumo">
                    Quantidade consumida
                </label>

                <input
                    type="number"
                    id="quantidadeConsumo"
                    min="0"
                    placeholder="Informe a quantidade"
                    value={quantidade}
                    disabled={!loteSelecionado}
                    onChange={(evento) => setQuantidade(evento.target.value)}
                />

                {loteEscolhido && (
                    <p>
                        Saldo disponível: {loteEscolhido.quantidadeAtual}
                    </p>
                )}
            </div>

            <div className="botoes-consumo">
                <button
                    type="button"
                    onClick={registrarConsumo}
                    disabled={!quantidadeValida}
                >
                    Registrar consumo
                </button>

                <button
                    type="button"
                    className="botao-aguardar-consumo"
                    onClick={aguardarConsumo}
                    disabled={!quantidadeValida}
                >
                    Aguardar consumo
                </button>
            </div>
        </section>
    );
}

export default RegistrarConsumo;
