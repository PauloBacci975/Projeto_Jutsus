package com.jutsus.dto;

import com.jutsus.entity.NaturezaChakra;
import com.jutsus.entity.RankJutsu;
import jakarta.validation.constraints.*;

public class JutsuRequest {

    @NotBlank(message = "O nome do Jutsu é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    private String nome;

    @NotNull(message = "A natureza do chakra é obrigatória.")
    private NaturezaChakra naturezaChakra;

    @NotNull(message = "O rank é obrigatório.")
    private RankJutsu rank;

    @NotNull(message = "O custo de chakra é obrigatório.")
    @Min(value = 0, message = "O custo de chakra não pode ser negativo.")
    private Integer custoChakra;

    public String getNome() {
        return nome;
    }

    public NaturezaChakra getNaturezaChakra() {
        return naturezaChakra;
    }

    public RankJutsu getRank() {
        return rank;
    }

    public Integer getCustoChakra() {
        return custoChakra;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setNaturezaChakra(NaturezaChakra naturezaChakra) {
        this.naturezaChakra = naturezaChakra;
    }

    public void setRank(RankJutsu rank) {
        this.rank = rank;
    }

    public void setCustoChakra(Integer custoChakra) {
        this.custoChakra = custoChakra;
    }
}
