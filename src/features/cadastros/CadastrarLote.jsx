
import { useState } from "react";
import "./CadastrarLote.css";

function CadastrarLote({
    produtos,
    lotes,
    produtoSelecionado,
    setProdutoSelecionado,
    fabricantes,
    fabricanteSelecionado,
    setFabricanteSelecionado,
    onAbrirGerenciarFabricantes,
    onCadastrarLote
}) {
    const [fabricanteFocado, setFabricanteFocado] = useState(false);
    const [produtoFocado, setProdutoFocado] = useState(false);

    const [numeroLote, setNumeroLote] = useState("");
    const [validadeLote, setValidadeLote] = useState("");
    const [registroAnvisa, setRegistroAnvisa] = useState("");
    const [quantidadeLote, setQuantidadeLote] = useState("");

    const fabricantesFiltrados = fabricantes.filter((fabricante) =>
        fabricante.nome.toLowerCase().includes(fabricanteSelecionado.toLowerCase())
    );

    const produtosFiltrados = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(produtoSelecionado.toLowerCase())
    );

    function cadastrarLote() {
        const produto = produtos.find(
            (produto) =>
                produto.nome.toLowerCase() === produtoSelecionado.trim().toLowerCase()
        );

        const fabricante = fabricantes.find(
            (fabricante) =>
                fabricante.nome.toLowerCase() === fabricanteSelecionado.trim().toLowerCase()
        );

        const quantidade = Number(quantidadeLote);

        if (
            !produtoSelecionado.trim() ||
            !numeroLote.trim() ||
            !fabricanteSelecionado.trim() ||
            !validadeLote ||
            !registroAnvisa.trim() ||
            quantidadeLote === ""
        ) {
            alert("Preencha todos os campos do lote.");
            return;
        }

        if (!produto) {
            alert("Selecione um produto cadastrado na lista.");
            return;
        }

        if (!fabricante) {
            alert("Selecione um fabricante cadastrado na lista.");
            return;
        }

        if (quantidade <= 0 || !Number.isFinite(quantidade)) {
            alert("A quantidade recebida deve ser maior que zero.");
            return;
        }

        const loteDuplicado = lotes.some(
            (lote) =>
                lote.produtoId === produto.id &&
                lote.fabricanteId === fabricante.id &&
                lote.numeroLote.toLowerCase() === numeroLote.trim().toLowerCase()
        );

        if (loteDuplicado) {
            alert(
                "Este lote já está cadastrado para este produto e fabricante. Utilize a página de Ajustes para registrar uma nova entrada."
            );
            return;
        }

        onCadastrarLote({
            produtoId: produto.id,
            numeroLote: numeroLote.trim(),
            fabricanteId: fabricante.id,
            validade: validadeLote,
            registroAnvisa: registroAnvisa.trim(),
            quantidadeRecebida: quantidade,
            quantidadeAtual: quantidade
        });

        setProdutoSelecionado("");
        setFabricanteSelecionado("");
        setNumeroLote("");
        setValidadeLote("");
        setRegistroAnvisa("");
        setQuantidadeLote("");

        alert("Lote cadastrado com sucesso!");
    }

    return (
        <section className="formulario-lote">
            <h2>Cadastro de Lote</h2>

            <div className="campo-lote">
                <label htmlFor="produtoLote">Produto</label>

                <div className="campo-produto-pesquisa">
                    <input
                        type="text"
                        id="produtoLote"
                        placeholder="Digite para pesquisar o produto"
                        value={produtoSelecionado}
                        onChange={(evento) => {
                            setProdutoSelecionado(evento.target.value);
                            setProdutoFocado(true);
                        }}
                        onFocus={() => setProdutoFocado(true)}
                        onBlur={() => setProdutoFocado(false)}
                        autoComplete="off"
                    />

                    {produtoFocado && produtosFiltrados.length > 0 && (
                        <div className="lista-sugestoes-produtos">
                            {produtosFiltrados.map((produto) => (
                                <button
                                    type="button"
                                    key={produto.id}
                                    onMouseDown={(evento) => evento.preventDefault()}
                                    onClick={() => {
                                        setProdutoSelecionado(produto.nome);
                                        setProdutoFocado(false);
                                    }}
                                >
                                    {produto.nome}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="campo-lote">
                <label htmlFor="numeroLote">Número do lote</label>
                <input
                    type="text"
                    id="numeroLote"
                    placeholder="Digite o número do lote"
                    value={numeroLote}
                    onChange={(evento) => setNumeroLote(evento.target.value)}
                />
            </div>

            <div className="campo-lote">
                <label htmlFor="fabricanteLote">Fabricante</label>

                <div className="campo-fabricante">
                    <div className="campo-fabricante-pesquisa">
                        <input
                            type="text"
                            id="fabricanteLote"
                            placeholder="Digite para pesquisar o fabricante"
                            value={fabricanteSelecionado}
                            onChange={(evento) => {
                                setFabricanteSelecionado(evento.target.value);
                                setFabricanteFocado(true);
                            }}
                            onFocus={() => setFabricanteFocado(true)}
                            onBlur={() => setFabricanteFocado(false)}
                            autoComplete="off"
                        />

                        {fabricanteFocado && fabricantesFiltrados.length > 0 && (
                            <div className="lista-sugestoes-fabricantes">
                                {fabricantesFiltrados.map((fabricante) => (
                                    <button
                                        type="button"
                                        key={fabricante.id}
                                        onMouseDown={(evento) => evento.preventDefault()}
                                        onClick={() => {
                                            setFabricanteSelecionado(fabricante.nome);
                                            setFabricanteFocado(false);
                                        }}
                                    >
                                        {fabricante.nome}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onAbrirGerenciarFabricantes}
                    >
                        Editar
                    </button>
                </div>
            </div>

            <div className="campo-lote">
                <label htmlFor="validadeLote">Data de validade</label>
                <input
                    type="date"
                    id="validadeLote"
                    value={validadeLote}
                    onChange={(evento) => setValidadeLote(evento.target.value)}
                />
            </div>

            <div className="campo-lote">
                <label htmlFor="registroAnvisa">Registro na Anvisa</label>
                <input
                    type="text"
                    id="registroAnvisa"
                    placeholder="Digite o registro na Anvisa"
                    value={registroAnvisa}
                    onChange={(evento) => setRegistroAnvisa(evento.target.value)}
                />
            </div>

            <div className="campo-lote">
                <label htmlFor="quantidadeLote">Quantidade recebida</label>
                <input
                    type="number"
                    id="quantidadeLote"
                    min="0"
                    placeholder="Digite a quantidade recebida"
                    value={quantidadeLote}
                    onChange={(evento) => setQuantidadeLote(evento.target.value)}
                />
            </div>

            <button type="button" onClick={cadastrarLote}>
                Cadastrar lote
            </button>
        </section>
    );
}

export default CadastrarLote;
