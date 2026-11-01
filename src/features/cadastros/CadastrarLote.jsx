
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
    const [quantidadeLote, setQuantidadeLote] = useState("");

    const fabricantesFiltrados = fabricantes.filter((fabricante) =>
        fabricante.nome.toLowerCase().includes(fabricanteSelecionado.toLowerCase())
    );

    const produtosFiltrados = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(produtoSelecionado.toLowerCase())
    );

    function formatarData(valor) {
        const numeros = valor.replace(/\D/g, "").slice(0, 8);

        if (numeros.length <= 2) {
            return numeros;
        }

        if (numeros.length <= 4) {
            return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
        }

        return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    }

    function validarData(data) {
        const partes = data.split("/");

        if (
            partes.length !== 3 ||
            partes[0].length !== 2 ||
            partes[1].length !== 2 ||
            partes[2].length !== 4
        ) {
            return false;
        }

        const dia = Number(partes[0]);
        const mes = Number(partes[1]);
        const ano = Number(partes[2]);

        if (ano < 1900 || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
            return false;
        }

        const dataVerificada = new Date(ano, mes - 1, dia);

        return (
            dataVerificada.getFullYear() === ano &&
            dataVerificada.getMonth() === mes - 1 &&
            dataVerificada.getDate() === dia
        );
    }

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

        if (!validarData(validadeLote)) {
            alert("Informe uma data de validade válida no formato DD/MM/AAAA.");
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

        const [dia, mes, ano] = validadeLote.split("/");
        const validadeFormatada = `${ano}-${mes}-${dia}`;

        onCadastrarLote({
            produtoId: produto.id,
            numeroLote: numeroLote.trim(),
            fabricanteId: fabricante.id,
            validade: validadeFormatada,
            quantidadeRecebida: quantidade,
            quantidadeAtual: quantidade
        });

        setProdutoSelecionado("");
        setFabricanteSelecionado("");
        setNumeroLote("");
        setValidadeLote("");
        setQuantidadeLote("");

        alert("Lote cadastrado com sucesso!");
    }

    return (
        <section className="formulario-lote">
            <h2>Cadastro de estoque</h2>

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
                    type="text"
                    id="validadeLote"
                    placeholder="DD/MM/AAAA"
                    value={validadeLote}
                    maxLength={10}
                    inputMode="numeric"
                    onChange={(evento) =>
                        setValidadeLote(formatarData(evento.target.value))
                    }
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
