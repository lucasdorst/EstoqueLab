
import { useState } from "react";
import "./ControleEstoque.css";

function ControleEstoque({
    produtos,
    lotes,
    fabricantes,
    onCorrigirEstoque,
    onAjustarLote
}) {
    const [produtoSelecionado, setProdutoSelecionado] = useState("");
    const [loteSelecionado, setLoteSelecionado] = useState("");
    const [fabricanteLote, setFabricanteLote] = useState("");
    const [validadeLote, setValidadeLote] = useState("");
    const [novoSaldo, setNovoSaldo] = useState("");

    // FILTRAR LOTES DO PRODUTO SELECIONADO

    const lotesFiltrados = lotes.filter(
        (lote) => String(lote.produtoId) === produtoSelecionado
    );

    // LOCALIZAR LOTE SELECIONADO

    const loteEscolhido = lotes.find(
        (lote) => String(lote.id) === loteSelecionado
    );

    // FORMATAR DATA PARA DD/MM/AAAA

    function formatarDataBrasileira(data) {
        if (!data) return "";

        const [ano, mes, dia] = data.split("-");

        if (!ano || !mes || !dia) return "";

        return `${dia}/${mes}/${ano}`;
    }

    // VALIDAR DATA

    function validarData(data) {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
            return false;
        }

        const [dia, mes, ano] = data.split("/").map(Number);
        const dataValida = new Date(ano, mes - 1, dia);

        return (
            ano >= 1900 &&
            dataValida.getFullYear() === ano &&
            dataValida.getMonth() === mes - 1 &&
            dataValida.getDate() === dia
        );
    }

    // SELECIONAR LOTE PARA EDIÇÃO

    function selecionarLoteParaEditar(id) {
        setLoteSelecionado(id);

        const lote = lotes.find(
            (item) => String(item.id) === id
        );

        if (!lote) {
            setFabricanteLote("");
            setValidadeLote("");
            setNovoSaldo("");
            return;
        }

        setFabricanteLote(String(lote.fabricanteId));
        setValidadeLote(formatarDataBrasileira(lote.validade));
        setNovoSaldo(String(lote.quantidadeAtual));
    }

    // SALVAR ALTERAÇÕES DO CONTROLE DE ESTOQUE

    function salvarAlteracoesEstoque() {
        if (!loteEscolhido) {
            alert("Selecione um produto e um lote.");
            return;
        }

        if (!fabricanteLote) {
            alert("Selecione um fabricante.");
            return;
        }

        if (!validarData(validadeLote)) {
            alert("Informe uma data de validade válida no formato DD/MM/AAAA.");
            return;
        }

        if (novoSaldo === "") {
            alert("Informe o saldo do lote.");
            return;
        }

        const quantidade = Number(novoSaldo);

        if (!Number.isFinite(quantidade) || quantidade < 0) {
            alert("Informe um saldo válido.");
            return;
        }

        const saldoAlterado =
            quantidade !== Number(loteEscolhido.quantidadeAtual);

        const fabricanteAlterado =
            Number(fabricanteLote) !== Number(loteEscolhido.fabricanteId);

        const [dia, mes, ano] = validadeLote.split("/");
        const validadeFormatada = `${ano}-${mes}-${dia}`;

        const validadeAlterada =
            validadeFormatada !== loteEscolhido.validade;

        if (!saldoAlterado && !fabricanteAlterado && !validadeAlterada) {
            alert("Nenhuma alteração foi realizada.");
            return;
        }

        if (fabricanteAlterado || validadeAlterada) {
            const sucessoLote = onAjustarLote({
                id: Number(loteSelecionado),
                fabricanteId: Number(fabricanteLote),
                validade: validadeFormatada
            });

            if (!sucessoLote) return;
        }

        if (saldoAlterado) {
            const sucessoSaldo = onCorrigirEstoque({
                loteId: Number(loteSelecionado),
                novoSaldo: quantidade
            });

            if (!sucessoSaldo) return;
        }

        alert("Alterações do lote salvas com sucesso.");

        setProdutoSelecionado("");
        setLoteSelecionado("");
        setFabricanteLote("");
        setValidadeLote("");
        setNovoSaldo("");
    }

    return (
        <section className="ajuste-card">
            <div className="ajuste-card-titulo">
                <h2>Controle de estoque</h2>
                <p>
                    Corrija os dados do lote ou atualize seu saldo.
                </p>
            </div>

            <div className="ajuste-formulario">
                <div className="campo-ajuste">
                    <label>Produto</label>

                    <select
                        value={produtoSelecionado}
                        onChange={(e) => {
                            setProdutoSelecionado(e.target.value);
                            setLoteSelecionado("");
                            setFabricanteLote("");
                            setValidadeLote("");
                            setNovoSaldo("");
                        }}
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
                    <label>Lote</label>

                    <select
                        value={loteSelecionado}
                        onChange={(e) =>
                            selecionarLoteParaEditar(e.target.value)
                        }
                        disabled={!produtoSelecionado}
                    >
                        <option value="">Selecione um lote</option>

                        {lotesFiltrados.map((lote) => (
                            <option key={lote.id} value={lote.id}>
                                {lote.numeroLote}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-ajuste">
                    <label>Fabricante</label>

                    <select
                        value={fabricanteLote}
                        onChange={(e) => setFabricanteLote(e.target.value)}
                        disabled={!loteEscolhido}
                    >
                        <option value="">Selecione o fabricante</option>

                        {fabricantes.map((fabricante) => (
                            <option key={fabricante.id} value={fabricante.id}>
                                {fabricante.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-ajuste">
                    <label>Validade</label>

                    <input
                        type="text"
                        value={validadeLote}
                        onChange={(e) => {
                            const numeros = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 8);

                            let data = numeros;

                            if (numeros.length > 4) {
                                data = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
                            } else if (numeros.length > 2) {
                                data = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
                            }

                            setValidadeLote(data);
                        }}
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        inputMode="numeric"
                        disabled={!loteEscolhido}
                    />
                </div>

                <div className="campo-ajuste">
                    <label>Saldo atual / Novo saldo</label>

                    <input
                        type="number"
                        min="0"
                        value={novoSaldo}
                        onChange={(e) => setNovoSaldo(e.target.value)}
                        placeholder="Informe o saldo correto"
                        disabled={!loteEscolhido}
                    />
                </div>

                <button
                    type="button"
                    className="botao-ajuste"
                    onClick={salvarAlteracoesEstoque}
                    disabled={!loteEscolhido}
                >
                    Salvar alterações
                </button>
            </div>
        </section>
    );
}

export default ControleEstoque;
