package com.jutsus.service;

import com.jutsus.dto.JutsuRequest;
import com.jutsus.entity.Jutsu;
import com.jutsus.entity.RankJutsu;
import com.jutsus.exception.RecursoNaoEncontradoException;
import com.jutsus.exception.RegraNegocioException;
import com.jutsus.repository.JutsuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JutsuService {

    private final JutsuRepository repository;

    public JutsuService(JutsuRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Jutsu> listar(String busca, String natureza, String rank) {
        List<Jutsu> jutsus = repository.findAllByOrderByIdDesc();

        return jutsus.stream()
                .filter(j -> busca == null || busca.isBlank()
                        || j.getNome().toLowerCase().contains(busca.trim().toLowerCase()))
                .filter(j -> natureza == null || natureza.isBlank()
                        || j.getNaturezaChakra().name().equalsIgnoreCase(natureza))
                .filter(j -> rank == null || rank.isBlank()
                        || j.getRank().name().equalsIgnoreCase(rank))
                .toList();
    }

    @Transactional(readOnly = true)
    public Jutsu buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Jutsu não encontrado para o ID informado."));
    }

    @Transactional
    public Jutsu criar(JutsuRequest request) {
        validarRegras(request, null);

        Jutsu jutsu = new Jutsu();
        preencher(jutsu, request);
        return repository.save(jutsu);
    }

    @Transactional
    public Jutsu atualizar(Long id, JutsuRequest request) {
        Jutsu jutsu = buscarPorId(id);
        validarRegras(request, id);

        preencher(jutsu, request);
        return repository.save(jutsu);
    }

    private void preencher(Jutsu jutsu, JutsuRequest request) {
        jutsu.setNome(request.getNome().trim());
        jutsu.setNaturezaChakra(request.getNaturezaChakra());
        jutsu.setRank(request.getRank());
        jutsu.setCustoChakra(request.getCustoChakra());
    }

    private void validarRegras(JutsuRequest request, Long id) {
        String nome = request.getNome().trim();

        boolean nomeDuplicado = id == null
                ? repository.existsByNomeIgnoreCase(nome)
                : repository.existsByNomeIgnoreCaseAndIdNot(nome, id);

        if (nomeDuplicado) {
            throw new RegraNegocioException(
                    "Já existe um Jutsu cadastrado com esse nome.");
        }

        if (request.getCustoChakra() < 0) {
            throw new RegraNegocioException(
                    "O custo de chakra não pode ser negativo.");
        }

        if (request.getRank() == RankJutsu.S && request.getCustoChakra() < 100) {
            throw new RegraNegocioException(
                    "Jutsus de Rank S exigem custo de chakra mínimo de 100 pontos.");
        }
    }
}
