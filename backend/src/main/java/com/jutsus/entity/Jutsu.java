package com.jutsus.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "jutsus",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_jutsu_nome",
        columnNames = "nome"
    )
)
public class Jutsu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(name = "natureza_chakra", nullable = false, length = 10)
    private NaturezaChakra naturezaChakra;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private RankJutsu rank;

    @Column(name = "custo_chakra", nullable = false)
    private Integer custoChakra;

    public Jutsu() {
    }

    public Jutsu(Long id, String nome, NaturezaChakra naturezaChakra,
                 RankJutsu rank, Integer custoChakra) {
        this.id = id;
        this.nome = nome;
        this.naturezaChakra = naturezaChakra;
        this.rank = rank;
        this.custoChakra = custoChakra;
    }

    public Long getId() {
        return id;
    }

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

    public void setId(Long id) {
        this.id = id;
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
