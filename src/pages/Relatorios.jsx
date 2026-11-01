
import { useState } from "react";
import Cabecalho from "../components/Cabecalho";

import ListaProdutos from "../features/relatorios/ListaProdutos";
import ListaLotes from "../features/relatorios/ListaLotes";

import "./Relatorios.css";

function Relatorios({
    produtos,
    lotes,
    fabricantes,
    unidades,
    movimentacoes,
    historicoAjustes,
    onNavegar
}) {
    const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);

    // FILTROS DE MOVIMENTAÇÕES

    const [buscaMovProduto, setBuscaMovProduto] = useState("");
    const [buscaMovLote, setBuscaMovLote] = useState("");
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    // FILTROS DE AJUSTES

    const [buscaAjusteProduto, setBuscaAjusteProduto] = useState("");
    const [buscaAjusteLote, setBuscaAjusteLote] = useState("");
    const [dataInicialAjuste, setDataInicialAjuste] = useState("");
    const [dataFinalAjuste, setDataFinalAjuste] = useState("");

    // FORMATAR DATA DIGITADA

    function formatarCampoData(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 8);

        if (numeros.length <= 2) {
            return numeros;
        }

        if (numeros.length <= 4) {
            return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
        }

        return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    }

    // CONVERTER DATA BRASILEIRA

    function converterDataBrasileira(data) {
        if (!data) return null;

        const partes = data.split("/");

        if (
            partes.length !== 3 ||
            partes[0].length !== 2 ||
            partes[1].length !== 2 ||
            partes[2].length !== 4
        ) {
            return null;
        }

        const [dia, mes, ano] = partes.map(Number);

        if (ano < 1900 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            return null;
        }

        const dataConvertida = new Date(ano, mes - 1, dia);

        if (
            dataConvertida.getDate() !== dia ||
            dataConvertida.getMonth() !== mes - 1 ||
            dataConvertida.getFullYear() !== ano
        ) {
            return null;
        }

        return dataConvertida;
    }

    // CONVERTER DATA E HORA DOS AJUSTES

    function converterDataAjuste(data) {
        if (!data) return null;

        const [dataTexto, horaTexto] = data.split(" ");
        const partes = dataTexto.split("/");

        if (partes.length !== 3) return null;

        const [dia, mes, ano] = partes.map(Number);

        const [hora = 0, minuto = 0, segundo = 0] =
            (horaTexto || "").split(":").map(Number);

        const dataConvertida = new Date(
            ano, mes - 1, dia, hora, minuto, segundo
        );

        if (
            dataConvertida.getDate() !== dia ||
            dataConvertida.getMonth() !== mes - 1 ||
            dataConvertida.getFullYear() !== ano
        ) {
            return null;
        }

        return dataConvertida;
    }

    // FILTRAR MOVIMENTAÇÕES

    const movimentacoesFiltradas = movimentacoes.filter((item) => {
        const produtoCorresponde = (item.produto || "")
            .toLowerCase()
            .includes(buscaMovProduto.toLowerCase().trim());

        const loteCorresponde = (item.lote || "")
            .toLowerCase()
            .includes(buscaMovLote.toLowerCase().trim());

        const dataMovimentacao = new Date(item.data);
        const inicio = converterDataBrasileira(dataInicial);
        const fim = converterDataBrasileira(dataFinal);

        const dataCorresponde =
            (!dataInicial || (inicio && dataMovimentacao >= inicio)) &&
            (!dataFinal || (fim && dataMovimentacao < new Date(
                fim.getFullYear(),
                fim.getMonth(),
                fim.getDate() + 1
            )));

        return produtoCorresponde && loteCorresponde && dataCorresponde;
    });

    // FILTRAR HISTÓRICO DE AJUSTES

    const ajustesFiltrados = historicoAjustes.filter((item) => {
        const produtoCorresponde = (item.produto || "")
            .toLowerCase()
            .includes(buscaAjusteProduto.toLowerCase().trim());

        const loteCorresponde =
            item.tipo === "produto" ||
            (item.lote || "")
                .toLowerCase()
                .includes(buscaAjusteLote.toLowerCase().trim());

        const dataAjuste = converterDataAjuste(item.data);
        const inicio = converterDataBrasileira(dataInicialAjuste);
        const fim = converterDataBrasileira(dataFinalAjuste);

        const dataCorresponde =
            (!dataInicialAjuste || (inicio && dataAjuste && dataAjuste >= inicio)) &&
            (!dataFinalAjuste || (fim && dataAjuste && dataAjuste < new Date(
                fim.getFullYear(),
                fim.getMonth(),
                fim.getDate() + 1
            )));

        return produtoCorresponde && loteCorresponde && dataCorresponde;
    });

    // LIMPAR FILTROS

    function limparFiltrosMovimentacoes() {
        setBuscaMovProduto("");
        setBuscaMovLote("");
        setDataInicial("");
        setDataFinal("");
    }

    function limparFiltrosAjustes() {
        setBuscaAjusteProduto("");
        setBuscaAjusteLote("");
        setDataInicialAjuste("");
        setDataFinalAjuste("");
    }

    // FORMATAR DATA DAS MOVIMENTAÇÕES

    function formatarData(data) {
        return new Date(data).toLocaleString("pt-BR");
    }

    // FORMATAR VALIDADE DO HISTÓRICO DE LOTES

    function formatarValorAjuste(item, valor) {
        if (item.tipo === "lote" && item.campo === "Validade") {
            if (!valor) return "—";

            const [ano, mes, dia] = valor.split("-");

            if (ano && mes && dia) {
                return `${dia}/${mes}/${ano}`;
            }
        }

        return valor ?? "—";
    }

    // IDENTIFICAR TIPO DE AJUSTE

    function identificarTipoAjuste(item) {
        if (item.tipo === "produto") {
            return "Ajuste de produto";
        }

        if (item.tipo === "lote") {
            return "Ajuste de lote";
        }

        return "Correção de estoque";
    }

    // VOLTAR AOS RELATÓRIOS

    function voltarAosRelatorios() {
        setRelatorioSelecionado(null);
    }

    return (
        <div className="relatorios-container">

            <Cabecalho
                paginaAtiva="relatorios"
                onNavegar={onNavegar}
            />

            <main className="relatorios-conteudo">

                {relatorioSelecionado === null ? (

                    <div className="relatorios-cards">

                        <button
                            className="relatorio-card"
                            onClick={() => setRelatorioSelecionado("produtos")}
                        >
                            <span className="relatorio-card-icone">📦</span>
                            <h2>Produtos cadastrados</h2>
                            <p>Consulte os produtos e seus limites de estoque.</p>
                        </button>

                        <button
                            className="relatorio-card"
                            onClick={() => setRelatorioSelecionado("lotes")}
                        >
                            <span className="relatorio-card-icone">🧪</span>
                            <h2>Produtos em estoque</h2>
                            <p>Consulte lotes, fabricantes, validades e saldos.</p>
                        </button>

                        <button
                            className="relatorio-card"
                            onClick={() => setRelatorioSelecionado("movimentacoes")}
                        >
                            <span className="relatorio-card-icone">📋</span>
                            <h2>Histórico de movimentações</h2>
                            <p>Consulte os consumos registrados no estoque.</p>
                        </button>

                        <button
                            className="relatorio-card"
                            onClick={() => setRelatorioSelecionado("ajustes")}
                        >
                            <span className="relatorio-card-icone">⚙️</span>
                            <h2>Histórico de ajustes</h2>
                            <p>
                                Consulte as correções de estoque e alterações
                                dos produtos e lotes.
                            </p>
                        </button>

                    </div>

                ) : (

                    <div className="relatorio-detalhe">

                        <button
                            type="button"
                            className="botao-voltar-relatorios"
                            onClick={voltarAosRelatorios}
                        >
                            ← Voltar aos relatórios
                        </button>

                        {/* PRODUTOS */}

                        {relatorioSelecionado === "produtos" && (
                            <section className="relatorio-secao">

                                <ListaProdutos
                                    produtos={produtos}
                                    unidades={unidades}
                                />

                            </section>
                        )}

                        {/* LOTES */}

                        {relatorioSelecionado === "lotes" && (
                            <section className="relatorio-secao">

                                <ListaLotes
                                    lotes={lotes}
                                    produtos={produtos}
                                    fabricantes={fabricantes}
                                />

                            </section>
                        )}

                        {/* MOVIMENTAÇÕES */}

                        {relatorioSelecionado === "movimentacoes" && (
                            <section className="relatorio-secao">

                                <div className="relatorio-secao-titulo">
                                    <h2>Histórico de movimentações</h2>
                                    <p>
                                        Consulte os consumos registrados no estoque.
                                    </p>
                                </div>

                                <div className="filtros-movimentacoes">

                                    <input
                                        type="text"
                                        placeholder="Pesquisar produto..."
                                        value={buscaMovProduto}
                                        onChange={(e) => setBuscaMovProduto(e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Pesquisar número do lote..."
                                        value={buscaMovLote}
                                        onChange={(e) => setBuscaMovLote(e.target.value)}
                                    />

                                    <div className="campo-data-movimentacao">
                                        <label>Data inicial</label>
                                        <input
                                            type="text"
                                            placeholder="DD/MM/AAAA"
                                            inputMode="numeric"
                                            value={dataInicial}
                                            onChange={(e) =>
                                                setDataInicial(formatarCampoData(e.target.value))
                                            }
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="campo-data-movimentacao">
                                        <label>Data final</label>
                                        <input
                                            type="text"
                                            placeholder="DD/MM/AAAA"
                                            inputMode="numeric"
                                            value={dataFinal}
                                            onChange={(e) =>
                                                setDataFinal(formatarCampoData(e.target.value))
                                            }
                                            maxLength={10}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={limparFiltrosMovimentacoes}
                                    >
                                        Limpar filtros
                                    </button>

                                </div>

                                <div className="tabela-relatorios">

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Data e hora</th>
                                                <th>Produto</th>
                                                <th>Lote</th>
                                                <th>Movimentação</th>
                                                <th>Quantidade</th>
                                                <th>Saldo final</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {movimentacoesFiltradas.length > 0 ? (
                                                [...movimentacoesFiltradas].reverse().map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{formatarData(item.data)}</td>
                                                        <td>{item.produto}</td>
                                                        <td>{item.lote}</td>
                                                        <td>{item.tipo}</td>
                                                        <td>{item.quantidade}</td>
                                                        <td>{item.saldoFinal}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6">
                                                        Nenhuma movimentação encontrada.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>

                            </section>
                        )}

                        {/* HISTÓRICO DE AJUSTES */}

                        {relatorioSelecionado === "ajustes" && (
                            <section className="relatorio-secao">

                                <div className="relatorio-secao-titulo">
                                    <h2>Histórico de ajustes</h2>
                                    <p>
                                        Consulte as correções de estoque e as
                                        alterações realizadas nos produtos e lotes.
                                    </p>
                                </div>

                                <div className="filtros-movimentacoes">

                                    <input
                                        type="text"
                                        placeholder="Pesquisar produto..."
                                        value={buscaAjusteProduto}
                                        onChange={(e) => setBuscaAjusteProduto(e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Pesquisar número do lote..."
                                        value={buscaAjusteLote}
                                        onChange={(e) => setBuscaAjusteLote(e.target.value)}
                                    />

                                    <div className="campo-data-movimentacao">
                                        <label>Data inicial</label>
                                        <input
                                            type="text"
                                            placeholder="DD/MM/AAAA"
                                            inputMode="numeric"
                                            value={dataInicialAjuste}
                                            onChange={(e) =>
                                                setDataInicialAjuste(formatarCampoData(e.target.value))
                                            }
                                            maxLength={10}
                                        />
                                    </div>

                                    <div className="campo-data-movimentacao">
                                        <label>Data final</label>
                                        <input
                                            type="text"
                                            placeholder="DD/MM/AAAA"
                                            inputMode="numeric"
                                            value={dataFinalAjuste}
                                            onChange={(e) =>
                                                setDataFinalAjuste(formatarCampoData(e.target.value))
                                            }
                                            maxLength={10}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={limparFiltrosAjustes}
                                    >
                                        Limpar filtros
                                    </button>

                                </div>

                                <div className="tabela-relatorios">

                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Data e hora</th>
                                                <th>Tipo de ajuste</th>
                                                <th>Produto</th>
                                                <th>Campo alterado</th>
                                                <th>Lote</th>
                                                <th>Valor anterior</th>
                                                <th>Novo valor</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {ajustesFiltrados.length > 0 ? (
                                                [...ajustesFiltrados].reverse().map((item) => (
                                                    <tr key={item.id}>

                                                        <td>{item.data}</td>

                                                        <td>
                                                            {identificarTipoAjuste(item)}
                                                        </td>

                                                        <td>{item.produto}</td>

                                                        <td>
                                                            {item.tipo === "estoque"
                                                                ? "Saldo do lote"
                                                                : item.campo}
                                                        </td>

                                                        <td>{item.lote || "—"}</td>

                                                        <td>
                                                            {item.tipo === "estoque"
                                                                ? item.saldoAnterior
                                                                : formatarValorAjuste(item, item.valorAnterior)}
                                                        </td>

                                                        <td>
                                                            {item.tipo === "estoque"
                                                                ? item.novoSaldo
                                                                : formatarValorAjuste(item, item.novoValor)}
                                                        </td>

                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7">
                                                        Nenhum ajuste encontrado.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>

                            </section>
                        )}

                    </div>
                )}

            </main>
        </div>
    );
}

export default Relatorios;
