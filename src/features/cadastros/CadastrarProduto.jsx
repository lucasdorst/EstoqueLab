
import { useState } from "react";
import "./CadastrarProduto.css";

function CadastrarProduto({
    unidades,
    unidadeSelecionada,
    setUnidadeSelecionada,
    onAbrirGerenciarUnidades,
    onCadastrarProduto,
    produtos
}) {
    const [nomeProduto, setNomeProduto] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");
    const [estoqueMaximo, setEstoqueMaximo] = useState("");

    function cadastrarProduto() {
        const nome = nomeProduto.trim();
        const minimo = Number(estoqueMinimo);
        const maximo = Number(estoqueMaximo);

        if (!nome || !unidadeSelecionada ||
            estoqueMinimo === "" || estoqueMaximo === "") {
            alert("Preencha todos os campos do produto.");
            return;
        }

        if (minimo < 0 || maximo < 0) {
            alert("Os estoques não podem ser negativos.");
            return;
        }

        if (maximo < minimo) {
            alert("O estoque máximo não pode ser menor que o mínimo.");
            return;
        }

        const produtoExiste = produtos.some(
            (produto) =>
                produto.nome.toLowerCase() === nome.toLowerCase()
        );

        if (produtoExiste) {
            alert("Já existe um produto cadastrado com esse nome.");
            return;
        }

        onCadastrarProduto({
            nome: nome,
            unidadeId: unidadeSelecionada,
            estoqueMinimo: minimo,
            estoqueMaximo: maximo
        });

        setNomeProduto("");
        setUnidadeSelecionada("");
        setEstoqueMinimo("");
        setEstoqueMaximo("");

        alert("Produto cadastrado com sucesso!");
    }

    return (
        <section className="formulario-produto">
            <h2>Cadastro de Produto</h2>

            <div className="campo-formulario">
                <label htmlFor="nomeProduto">Nome do produto</label>
                <input
                    type="text"
                    id="nomeProduto"
                    placeholder="Digite o nome do produto"
                    value={nomeProduto}
                    onChange={(evento) =>
                        setNomeProduto(evento.target.value)
                    }
                />
            </div>

            <div className="campo-formulario">
                <label htmlFor="unidade">Unidade de medida</label>

                <div className="campo-unidade">
                    <select
                        id="unidade"
                        value={unidadeSelecionada}
                        onChange={(evento) =>
                            setUnidadeSelecionada(
                                evento.target.value
                                    ? Number(evento.target.value)
                                    : ""
                            )
                        }
                    >
                        <option value="">Selecione a unidade</option>

                        {unidades.map((unidade) => (
                            <option key={unidade.id} value={unidade.id}>
                                {unidade.nome}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="botao-editar-unidade"
                        onClick={onAbrirGerenciarUnidades}
                    >
                        Editar
                    </button>
                </div>
            </div>

            <div className="campo-formulario">
                <label htmlFor="estoqueMinimo">Estoque mínimo</label>
                <input
                    type="number"
                    id="estoqueMinimo"
                    min="0"
                    placeholder="Digite o estoque mínimo"
                    value={estoqueMinimo}
                    onChange={(evento) =>
                        setEstoqueMinimo(evento.target.value)
                    }
                />
            </div>

            <div className="campo-formulario">
                <label htmlFor="estoqueMaximo">Estoque máximo</label>
                <input
                    type="number"
                    id="estoqueMaximo"
                    min="0"
                    placeholder="Digite o estoque máximo"
                    value={estoqueMaximo}
                    onChange={(evento) =>
                        setEstoqueMaximo(evento.target.value)
                    }
                />
            </div>

            <button type="button" onClick={cadastrarProduto}>
                Cadastrar produto
            </button>
        </section>
    );
}

export default CadastrarProduto;
