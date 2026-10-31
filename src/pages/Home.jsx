
import { useState } from "react";
import Cabecalho from "../components/Cabecalho";
import "./Home.css";

function Home() {
    const [codigoBarras, setCodigoBarras] = useState("");
    const [produto, setProduto] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [lote, setLote] = useState("");
    const [loteSelecionado, setLoteSelecionado] = useState(null);
    const [quantidadeConsumo, setQuantidadeConsumo] = useState("");
    const [movimentacoes, setMovimentacoes] = useState([]);

    const produtos = [
        { id: 1, nome: "Glicose", fabricante: "Kovalent" },
        { id: 2, nome: "Ureia", fabricante: "Kovalent" },
        { id: 3, nome: "Creatinina", fabricante: "Ebram" }
    ];

    const [lotes, setLotes] = useState([
        { id: 1, produtoId: 1, numero: "L24001", validade: "30/06/2027", saldo: 150 },
        { id: 2, produtoId: 1, numero: "L24002", validade: "15/08/2027", saldo: 80 },
        { id: 3, produtoId: 2, numero: "L25001", validade: "10/05/2027", saldo: 0 },
        { id: 4, produtoId: 3, numero: "L26001", validade: "20/09/2027", saldo: 45 }
    ]);

    const quantidadeValida =
        loteSelecionado !== null &&
        quantidadeConsumo !== "" &&
        Number(quantidadeConsumo) > 0 &&
        Number(quantidadeConsumo) <= loteSelecionado.saldo;

    const produtosFiltrados = produtos.filter((item) =>
        item.nome.toLowerCase().includes(produto.toLowerCase())
    );

    const lotesFiltrados = lotes.filter((item) =>
        item.produtoId === produtoSelecionado?.id && item.saldo > 0
    );

    function confirmarConsumo() {
        if (!quantidadeValida) {
            return;
        }

        const novaMovimentacao = {
            id: Date.now(),
            data: new Date().toLocaleString("pt-BR"),
            produto: produtoSelecionado.nome,
            lote: loteSelecionado.numero,
            tipo: "Consumo",
            quantidade: Number(quantidadeConsumo),
            saldoFinal: loteSelecionado.saldo - Number(quantidadeConsumo)
        };

        setMovimentacoes((movimentacoesAtuais) => [
            ...movimentacoesAtuais,
            novaMovimentacao
        ]);

        setLotes((lotesAtuais) =>
            lotesAtuais.map((item) =>
                item.id === loteSelecionado.id
                    ? {
                        ...item,
                        saldo: item.saldo - Number(quantidadeConsumo)
                    }
                    : item
            )
        );

        setLoteSelecionado((loteAtual) => ({
            ...loteAtual,
            saldo: loteAtual.saldo - Number(quantidadeConsumo)
        }));

        setQuantidadeConsumo("");

        alert("Consumo confirmado com sucesso!");
    }

    function selecionarProduto(item) {
        setProduto(item.nome);
        setProdutoSelecionado(item);
        setLote("");
        setLoteSelecionado(null);
    }

    function selecionarLote(item) {
        setLote(item.numero);
        setLoteSelecionado(item);
    }

    return (
        <div className="home-container">
            <Cabecalho paginaAtiva="home" />

            <main className="home-conteudo">
                <section className="area-consumo">
                    <h2>Consumir Produto</h2>

                    <div className="campo-formulario">
                        <label htmlFor="codigoBarras">Código de barras</label>

                        <input
                            type="text"
                            id="codigoBarras"
                            placeholder="Digite o código de barras"
                            value={codigoBarras}
                            onChange={(evento) => setCodigoBarras(evento.target.value)}
                        />
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="produto">Produto</label>

                        <input
                            type="text"
                            id="produto"
                            placeholder="Nome do Produto"
                            value={produto}
                            onChange={(evento) => {
                                setProduto(evento.target.value);
                                setProdutoSelecionado(null);
                                setLote("");
                                setLoteSelecionado(null);
                            }}
                        />

                        <div className="lista-sugestoes">
                            {produto.length > 0 &&
                                produtosFiltrados.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => selecionarProduto(item)}
                                    >
                                        {item.nome} - {item.fabricante}
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="lote">Lote</label>

                        <input
                            type="text"
                            id="lote"
                            placeholder="Digite o número do lote"
                            value={lote}
                            onChange={(evento) => {
                                setLote(evento.target.value);
                                setLoteSelecionado(null);
                            }}
                        />

                        <div className="lista-sugestoes">
                            {lote.length > 0 &&
                                lotesFiltrados
                                    .filter((item) =>
                                        item.numero.toLowerCase().includes(lote.toLowerCase())
                                    )
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => selecionarLote(item)}
                                        >
                                            {item.numero}
                                        </div>
                                    ))
                            }
                        </div>

                        {loteSelecionado && (
                            <div className="informacoes-lote">
                                <div>
                                    <span>Validade</span>
                                    <strong>{loteSelecionado.validade}</strong>
                                </div>

                                <div>
                                    <span>Saldo disponível</span>
                                    <strong>{loteSelecionado.saldo}</strong>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="campo-formulario">
                        <label htmlFor="quantidadeConsumo">Quantidade</label>

                        <input
                            type="number"
                            id="quantidadeConsumo"
                            placeholder="Digite a quantidade"
                            value={quantidadeConsumo}
                            onChange={(evento) => setQuantidadeConsumo(evento.target.value)}
                        />
                    </div>

                    <button
                        disabled={!quantidadeValida}
                        onClick={confirmarConsumo}
                    >
                        Confirmar consumo
                    </button>
                </section>

                <section className="area-alertas">
                    <h2>Alertas</h2>
                </section>
            </main>
            <section className="historico-movimentacoes">
                <h3>Movimentações registradas</h3>

                {movimentacoes.map((item) => (
                    <p key={item.id}>
                        {item.data} — {item.produto} — Lote: {item.lote}
                        — {item.tipo} — Quantidade: {item.quantidade}
                        — Saldo final: {item.saldoFinal}
                    </p>
                ))}
            </section>
        </div>
    );
}

export default Home;
